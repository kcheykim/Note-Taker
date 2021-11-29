const fs = require('fs');
const path = require('path');
const express = require('express');
//const { notes } = require('./db/db.json');
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

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add notes`);
    const { title, text } = req.body;
    if (title && text) {
        fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
            if (err) { console.log(err) } else {
                const savedNotes = JSON.parse(data);
                savedNotes.push({ title, text, id: uuid() });
                // Write the string to a file
                fs.writeFile(`./db/db.json`, JSON.stringify(savedNotes), (err) => err ?
                    console.error(err) : console.log(`Note for ${title} has been written to JSON file`)
                );
            }
        })
        const response = { status: 'success', body: { title, text, id: uuid() } };
        res.json(response);
    } else { res.json('Error in adding note'); }
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
        let deleteID = req.params.id;
        console.log(deleteID);
        if (err) { console.log(err); }
        let savedNotes = JSON.parse(data);
        for (let i = 0; i < savedNotes.length; i++) {
            console.log(savedNotes[i].id + ' = ' + deleteID)
            if (savedNotes[i].id === deleteID) {
                savedNotes.splice(i, 1);
            }
        }
        fs.writeFile(`./db/db.json`, JSON.stringify(savedNotes), (err) => err ?
            console.error(err) : console.log(`Note for ${req.params.id} has been deleted from JSON file`)
        );
        console.log(`Note deleted ID: ${req.params.id}`);
        res.send(savedNotes);
    })

});

app.put('/api/notes/:id', (req, res) => {
    console.log(JSON.parse(req.params.id));
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) { console.log(err) }
        let savedNotes = JSON.parse(data);
        let select = savedNotes.find((element) => element.id === req.params.id);
        if (select) {
            let update = { title: req.body.title, text: req.body.text, id: select.id };
            savedNotes.splice(savedNotes.indexOf(select), 1, update);
            fs.writeFile('./db/db.json', JSON.stringify(savedNotes), (err) => err ?
                console.error(err) : console.log(`Note for ${savedNotes.id} has been written to JSON file`)
            );
            res.json(savedNotes);
        }
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});