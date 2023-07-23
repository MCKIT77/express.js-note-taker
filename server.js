// On the back end, the application should include a `db.json` file that will be used to store and retrieve notes using the `fs` module.

// The following HTML routes should be created:

// * `GET /notes` should return the `notes.html` file.

// * `GET *` should return the `index.html` file.

// The following API routes should be created:

// * `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.

// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).





// imports
const express = require('express');

const fs = require('fs');

const path = require('path');

const api = require('./routes/index')

const notesRouter = require('./routes/notes');



const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));




app.use('/notes', notesRouter);

const PORT = 3306;



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})


app.listen(PORT, () => {
    console.log(`Visit localhost:${PORT} to view app`)
});