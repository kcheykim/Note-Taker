const fs = require('fs');
const path = require('path');
const express = require('express');
const { notes } = require('./db/db');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public')); //make front end files like css and javascript available
app.use(express.urlencoded({ extended: true })); //parse incoming string or array data
app.use(express.json()); //parse incoming JSON data

function createNewNotes(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
}

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') { return false; }
    if (!note.text || typeof note.text !== 'string') { return false; }
    return true;
}


app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString(); // set id based on what the next index of the array will be
    const note = createNewNote(req.body, notes); // add note to json file and note array in this function
    res.json(note);
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});