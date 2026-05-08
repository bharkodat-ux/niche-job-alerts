const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3100;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/jobs?q=keyword&location=remote,nyc
app.get('/api/jobs', (req, res) => {
  const q = req.query.q ? req.query.q.toLowerCase() : null;
  const location = req.query.location ? req.query.location.toLowerCase() : null;
  const dataPath = path.join(__dirname, 'data', 'jobs.json');
  fs.readFile(dataPath, 'utf8', (err, raw) => {
    if (err) return res.status(500).json({ error: 'failed to read data' });
    let list = JSON.parse(raw);
    if (q) {
      list = list.filter(j => [j.title, j.company, j.description, (j.tags||[]).join(' ')].join(' ').toLowerCase().includes(q));
    }
    if (location) {
      list = list.filter(j => (j.location||'').toLowerCase().includes(location) || (location === 'remote' && j.remote));
    }
    res.json(list);
  });
});

app.listen(PORT, () => console.log(`niche-job-alerts running on http://localhost:${PORT}`));
