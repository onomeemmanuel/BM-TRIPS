import { Router } from 'express';
import { login, getMe } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.post('/login', login);
r.get('/me', protect, getMe);
export default r;