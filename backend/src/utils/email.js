import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendContactEmail = async ({ first_name, last_name, email, phone, destination, message }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.SMTP_USER,
    subject: `New Enquiry from ${first_name} ${last_name}`,
    html: `
      <h2>New Travel Enquiry</h2>
      <p><b>Name:</b> ${first_name} ${last_name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || 'N/A'}</p>
      <p><b>Destination:</b> ${destination || 'N/A'}</p>
      <p><b>Message:</b> ${message || 'N/A'}</p>
    `,
  });
};

export const sendBookingConfirmation = async ({ email, full_name, tour_title, reference, travel_date, num_travellers, total_amount }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Booking Confirmed — ${tour_title}`,
    html: `
      <h2>Your Booking is Confirmed! ✈️</h2>
      <p>Hi ${full_name},</p>
      <p>We've received your booking for <b>${tour_title}</b>.</p>
      <hr/>
      <p><b>Reference:</b> ${reference}</p>
      <p><b>Travel Date:</b> ${travel_date || 'TBD'}</p>
      <p><b>Travellers:</b> ${num_travellers}</p>
      <p><b>Total:</b> ₦${Number(total_amount).toLocaleString()}</p>
      <hr/>
      <p>Our team will be in touch within 2 hours to finalise your itinerary.</p>
      <p>—BM TRIPS Team</p>
    `,
  });
};