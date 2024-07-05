const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');

const db = new Database('meercatch.db',{encoding:'unicode',verbose: console.log});
db.pragma("journal_mode = WAL");
// Route to get all users
router.get('/items', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM T_HISTORY').all();

    rows.forEach(row => {
      const decodedContent = decodeURIComponent(row['EVENT_CODE']);
      console.log(decodedContent)
    })

    let response = res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Route to get a user by ID
router.get('/users/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;
