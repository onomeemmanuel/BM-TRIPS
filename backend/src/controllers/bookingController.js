import pool from '../config/db.js';
import { sendBookingConfirmation } from '../utils/email.js';

const genRef = () => 'SKY-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

export const createBooking = async (req, res) => {
  const { tour_id, full_name, email, phone, num_travellers, travel_date, special_requests } = req.body;
  try {
    const tourRes = await pool.query('SELECT * FROM tours WHERE id=$1', [tour_id]);
    if (!tourRes.rows.length) return res.status(404).json({ message: 'Tour not found' });
    const tour = tourRes.rows[0];
    const total_amount = tour.price * (num_travellers || 1);
    const reference = genRef();
    const { rows } = await pool.query(
      `INSERT INTO bookings (reference,tour_id,tour_title,full_name,email,phone,
        num_travellers,travel_date,total_amount,special_requests)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [reference, tour_id, tour.title, full_name, email, phone,
       num_travellers, travel_date, total_amount, special_requests]
    );
    sendBookingConfirmation({ email, full_name, tour_title: tour.title, reference, travel_date, num_travellers, total_amount }).catch(console.error);
    res.status(201).json({ booking: rows[0], paystack_amount: total_amount * 100 });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const verifyPayment = async (req, res) => {
  const { reference } = req.params;
  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const data = await paystackRes.json();
    if (data.data?.status === 'success') {
      await pool.query(
        'UPDATE bookings SET payment_status=$1, paystack_ref=$2, status=$3 WHERE reference=$4',
        ['paid', data.data.reference, 'confirmed', reference]
      );
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Payment not successful' });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getAllBookings = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *',
      [req.body.status, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [tours, bookings, contacts, revenue] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM tours WHERE is_active=true'),
      pool.query('SELECT COUNT(*) FROM bookings'),
      pool.query("SELECT COUNT(*) FROM contacts WHERE status='new'"),
      pool.query("SELECT COALESCE(SUM(total_amount),0) as total FROM bookings WHERE payment_status='paid'"),
    ]);
    const recent = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5');
    res.json({
      totalTours: parseInt(tours.rows[0].count),
      totalBookings: parseInt(bookings.rows[0].count),
      newEnquiries: parseInt(contacts.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].total),
      recentBookings: recent.rows,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};