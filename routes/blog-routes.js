import { addBlog, deleteBlog, getAllBlogs, getBlogById, getBlogsByUserId, updateBlog } from '../controllers/blog-controller.js';

import express from 'express';
const router = express.Router();

router.get('/', getAllBlogs);
router.post('/add', addBlog);
router.put('/update/:id', updateBlog);
router.get('/:id', getBlogById); // Updated to use getBlogById
router.delete('/:id', deleteBlog);
router.get('/user/:id',getBlogsByUserId); // Updated to use getBlogsByUserId

export default router;
