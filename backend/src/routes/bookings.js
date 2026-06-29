import { Router } from 'express';
import { createBooking, verifyPayment, getAllBookings, updateBookingStatus, getDashboardStats } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.post('/', createBooking);
r.post('/verify/:reference', verifyPayment);
r.get('/dashboard', protect, getDashboardStats);
r.get('/', protect, getAllBookings);
r.put('/:id/status', protect, updateBookingStatus);
export default r;