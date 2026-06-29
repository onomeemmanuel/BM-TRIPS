import { Router } from 'express';
import { getAllPosts, getPostBySlug, createPost, updatePost, deletePost, getAdminPosts } from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const r = Router();
r.get('/', getAllPosts);
r.get('/admin/all', protect, getAdminPosts);
r.get('/:slug', getPostBySlug);
r.post('/', protect, upload.single('image'), createPost);
r.put('/:id', protect, upload.single('image'), updatePost);
r.delete('/:id', protect, deletePost);
export default r;