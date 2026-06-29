import pool from '../config/db.js';

export const getAllTours = async (req, res) => {
  try {
    const { type, featured, search } = req.query;
    let q = 'SELECT * FROM tours WHERE is_active=true';
    const params = [];
    if (type) { params.push(type); q += ` AND tour_type=$${params.length}`; }
    if (featured === 'true') q += ' AND is_featured=true';
    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      q += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(destination) LIKE $${params.length} OR LOWER(region) LIKE $${params.length})`;
    }
    q += ' ORDER BY is_featured DESC, created_at DESC';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getTourBySlug = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tours WHERE slug=$1 AND is_active=true', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ message: 'Tour not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createTour = async (req, res) => {
  const { title,slug,region,destination,description,short_desc,price,duration_nights,
          tour_type,badge,emoji,bg_gradient,is_featured,highlights,included,excluded,max_group_size } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO tours (title,slug,region,destination,description,short_desc,price,duration_nights,
        tour_type,badge,emoji,bg_gradient,is_featured,highlights,included,excluded,max_group_size,image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
      [title,slug,region,destination,description,short_desc,price,duration_nights,
       tour_type,badge,emoji,bg_gradient,is_featured,highlights,included,excluded,max_group_size,
       req.file ? `/uploads/${req.file.filename}` : null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateTour = async (req, res) => {
  const fields = { ...req.body };
  if (req.file) fields.image_url = `/uploads/${req.file.filename}`;
  const keys = Object.keys(fields);
  if (!keys.length) return res.status(400).json({ message: 'No fields to update' });
  const values = Object.values(fields);
  const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(',');
  try {
    const { rows } = await pool.query(
      `UPDATE tours SET ${setClause} WHERE id=$${keys.length + 1} RETURNING *`,
      [...values, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Tour not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteTour = async (req, res) => {
  try {
    await pool.query('UPDATE tours SET is_active=false WHERE id=$1', [req.params.id]);
    res.json({ message: 'Tour removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getAdminTours = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tours ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};