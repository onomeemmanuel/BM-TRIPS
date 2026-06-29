import { Router } from 'express';
import { getAllTours, getTourBySlug, createTour, updateTour, deleteTour, getAdminTours } from '../controllers/toursController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const r = Router();
r.get('/', getAllTours);
r.get('/admin/all', protect, getAdminTours);
r.get('/:slug', getTourBySlug);
r.post('/', protect, upload.single('image'), createTour);
r.put('/:id', protect, upload.single('image'), updateTour);
r.delete('/:id', protect, deleteTour);
export default r;