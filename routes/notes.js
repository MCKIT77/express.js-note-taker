const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dbPath = path.join(__dirname, '../db/db.json');


router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../public/notes.html');
    res.sendFile(filePath, (err) => {

        if (err) {
            console.log(__dirname);
            console.log(filePath);
            console.error(err);
        }
    });
})

router.get('/api/notes', (req, res) => {

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the database', err);
        } else {
            try {
                const notes = JSON.parse(data);
                res.json(notes);
            } catch (parseError) {
                console.error('Error parsing JSON data:', parseError);
                res.status(500).json({ error: 'Failed to parse JSON data' });
            }
        }
    });
})

router.post('/api/notes', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            try {
                const notes = JSON.parse(data);
                const newNote = req.body;
                newNote.id = uuidv4(); // Assign a unique ID to the new note
                notes.push(newNote);

                // Write the updated notes array back to the `db.json` file
                fs.writeFile(dbPath, JSON.stringify(notes), (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing to the database:', writeErr);
                        res.status(500).json({ error: 'Failed to write to the database' });
                    } else {
                        res.json(newNote); // Respond with the newly created note
                    }
                });
            } catch (parseError) {
                console.error('Error parsing JSON data:', parseError);
                res.status(500).json({ error: 'Failed to parse JSON data' });
            }
        }
    });
});


router.delete('/api/notes/:id', (req, res) => {
    const noteIdToDelete = req.params.id;

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            try {
                let notes = JSON.parse(data);

                // Find the index of the note with the specified ID
                const indexToDelete = notes.findIndex((note) => note.id === noteIdToDelete);

                if (indexToDelete === -1) {
                    res.status(404).json({ error: 'Note not found' });
                } else {
                    // Remove the note from the array
                    notes.splice(indexToDelete, 1);

                    // Write the updated notes array back to the `db.json` file
                    fs.writeFile(dbPath, JSON.stringify(notes), (writeErr) => {
                        if (writeErr) {
                            console.error('Error writing to the database:', writeErr);
                            res.status(500).json({ error: 'Failed to write to the database' });
                        } else {
                            res.json({ message: 'Note deleted successfully' });
                        }
                    });
                }
            } catch (parseError) {
                console.error('Error parsing JSON data:', parseError);
                res.status(500).json({ error: 'Failed to parse JSON data' });
            }
        }
    });
});


module.exports = router;