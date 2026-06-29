import pool from '../config/db.js';
import { sendContactEmail } from '../utils/email.js';

export const createContact = async (req, res) => {
  const { first_name, last_name, email, phone, destination, travel_date, message } = req.body;
  if (!first_name || !email) return res.status(400).json({ message: 'Name and email required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO contacts (first_name,last_name,email,phone,destination,travel_date,message)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [first_name, last_name, email, phone, destination, travel_date || null, message]
    );
    sendContactEmail({ first_name, last_name, email, phone, destination, message }).catch(console.error);
    res.status(201).json({ message: 'Enquiry received! We will be in touch within 2 hours.', data: rows[0] });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getAllContacts = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateContactStatus = async (req, res) => {
  try {
    await pool.query('UPDATE contacts SET status=$1 WHERE id=$2', [req.body.status, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};