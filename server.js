const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const { notest } = require('./db/db');





app.get('/api/db', (req, res) => {
    res.send('Hello!');
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});