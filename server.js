const fs = require('fs');
const path = require('path');
const express = require('express');
const { notes } = require('./db/db.json');

const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public')); //make front end files like css and javascript available
app.use(express.urlencoded({ extended: true })); //parse incoming string or array data
app.use(express.json()); //parse incoming JSON data



app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});




app.get('/api/notes/:note_id', (req, res) => {
    fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
        if (err) { throw (err) } else { res.JSON.parse(data); }
    })
    if (req.body && req.params.note_id) {
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].note_id === req.params.note_id) {
                res.json(notes[i]);
                return;
            }
        }
        res.json('Note ID not found');
    }
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add notes`);

    const { title, text } = req.body;
    if (title && text) {
        fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
            if (err) { console.log(err) } else {
                const savedNotes = JSON.parse(data);
                savedNotes.push({ title, text, note_id: uuid() });
                // Write the string to a file
                fs.writeFile(`./db/db.json`, JSON.stringify(savedNotes), (err) => err ?
                    console.error(err) : console.log(`Note for ${title} has been written to JSON file`)
                );
            }
        })
        const response = { status: 'success', body: { title, text, note_id: uuid() } };
        // console.log(response);
        res.json(response);
    } else { res.json('Error in adding note'); }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});