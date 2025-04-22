const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { IncomingForm } = require('formidable');

const app = express();
const PORT = 8889;
const uploadDir = path.join(__dirname, 'uploads');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));



// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  db.get(
    `SELECT * FROM security WHERE email = ? AND password = ?`,
    [email, password],
    (err, row) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Database error.' });
      }

      if (!row) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // For real apps, don’t send password back
      const { password, ...userWithoutPassword } = row;

      res.json({ message: 'Login successful', user: userWithoutPassword });
    }
  );
});









// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// SQLite connection
const db = new sqlite3.Database('./security.db', (err) => {
  if (err) console.error('Error connecting to DB', err);
  else console.log('Connected to SQLite DB');
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS security (
    SecurityID INTEGER PRIMARY KEY AUTOINCREMENT,
    companyname TEXT,
    address TEXT,
    contact TEXT,
    username TEXT,
    password TEXT,
    email TEXT,
    position TEXT,
    photo TEXT
  )
`);

// Get all users
app.get('/', (req, res) => {
  db.all('SELECT * FROM security', (err, rows) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(rows);
  });
});

// Upload and add user
// Upload and add user
app.post('/upload', (req, res) => {
    const form = new IncomingForm({ uploadDir, keepExtensions: true, multiples: true });
  
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(400).json({ error: 'Form parsing failed' });
      }
  
      // Convert array fields to strings (e.g., { username: ['John'] } → { username: 'John' })
      const cleanFields = Object.fromEntries(
        Object.entries(fields).map(([key, val]) => [key, Array.isArray(val) ? val[0] : val])
      );
  
      const {
        companyname = '',
        address = '',
        contact = '',
        username = '',
        password = '',
        email = '',
        position = '',
      } = cleanFields;
  
      let photoFileName = '';
  
      if (files.photo && files.photo[0]) {
        const oldPath = files.photo[0].filepath;
        const newName = `${Date.now()}-${files.photo[0].originalFilename}`;
        const newPath = path.join(uploadDir, newName);
  
        fs.renameSync(oldPath, newPath);
        photoFileName = newName;
      }
  
      db.run(
        `INSERT INTO security (companyname, address, contact, username, password, email, position, photo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [companyname, address, contact, username, password, email, position, photoFileName],
        function (err) {
          if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ error: 'DB insert failed' });
          }
          res.status(201).json({ id: this.lastID });
        }
      );
    });
  });
  

// Delete user
app.delete('/', (req, res) => {
  const { SecurityID } = req.body;

  db.run('DELETE FROM security WHERE SecurityID = ?', [SecurityID], function (err) {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ error: 'Delete failed' });
    }
    res.json({ message: 'User deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
