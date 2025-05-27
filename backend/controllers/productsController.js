const pool = require('../db');

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching product ${id}`, err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST
exports.create = async (req, res) => {
  const {
    name,
    description = null,
    price = 0.0,
    in_stock = true,
    category,
    tags = [],
    metadata = {}
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products
         (name, description, price, in_stock, category, tags, metadata)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, price, in_stock, category, tags, metadata]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT
exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description = null,
    price,
    in_stock,
    category,
    tags = [],
    metadata = {}
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET
         name        = $1,
         description = $2,
         price       = $3,
         in_stock    = $4,
         category    = $5,
         tags        = $6,
         metadata    = $7,
         updated_at  = NOW()
       WHERE id = $8
       RETURNING *`,
      [name, description, price, in_stock, category, tags, metadata, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating product ${id}`, err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE
exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(`Error deleting product ${id}`, err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
