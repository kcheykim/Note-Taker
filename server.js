const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const { notes } = require('./db/db');





app.get('/api/db', (req, res) => {
    let results = notes;
    console.log(req.query)
    res.json(results);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});