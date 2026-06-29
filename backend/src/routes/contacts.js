import { Router } from 'express';
import { createContact, getAllContacts, updateContactStatus } from '../controllers/contactsController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.post('/', createContact);
r.get('/', protect, getAllContacts);
r.put('/:id/status', protect, updateContactStatus);
export default r;