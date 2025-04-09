const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Serve static files from your public directory
app.use(express.static('public'));

// Connect to the SQLite database
const db = new sqlite3.Database('./library.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the library database');
  }
});

// Create the API endpoint that your frontend is trying to call
app.get('/api/books', (req, res) => {
  const category = req.query.category || '';
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 10;
  
  const offset = (page - 1) * perPage;
  
  // Get books by category
  db.all(
    'SELECT * FROM books WHERE category = ? LIMIT ? OFFSET ?',
    [category, perPage, offset],
    (err, books) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Get total count for pagination
      db.get('SELECT COUNT(*) as total FROM books WHERE category = ?', [category], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        const total = row.total;
        const totalPages = Math.ceil(total / perPage);
        
        res.json({
          books: books,
          pagination: {
            total: total,
            per_page: perPage,
            current_page: page,
            total_pages: totalPages
          }
        });
      });
    }
  );
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});