import pool from '../config/db.js';

export const getAllPosts = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE is_published=true ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getPostBySlug = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE slug=$1 AND is_published=true', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ message: 'Post not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createPost = async (req, res) => {
  const { title,slug,category,excerpt,content,emoji,bg_color,read_time,is_published } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO posts (title,slug,category,excerpt,content,emoji,bg_color,read_time,is_published,image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title,slug,category,excerpt,content,emoji,bg_color,read_time,is_published,
       req.file ? `/uploads/${req.file.filename}` : null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updatePost = async (req, res) => {
  const fields = { ...req.body };
  if (req.file) fields.image_url = `/uploads/${req.file.filename}`;
  const keys = Object.keys(fields);
  if (!keys.length) return res.status(400).json({ message: 'No fields to update' });
  const values = Object.values(fields);
  const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(',');
  try {
    const { rows } = await pool.query(
      `UPDATE posts SET ${setClause} WHERE id=$${keys.length + 1} RETURNING *`,
      [...values, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Post not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deletePost = async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id=$1', [req.params.id]);
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getAdminPosts = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};