const express = require('express');
const router = express.Router();
const fetchuser = require('../Middleware/fetchuser');
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//Route1 : Getting the notes of user using: GET "/api/notes/getNotes". login required
router.get('/getNotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route2 : Adding the notes of user using: POST "/api/notes/addNotes". login required
router.post('/addNotes', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const result = validationResult(req);
        //If there are errors return bad request and the error
        if (!result.isEmpty()) {
            return res.status(400).send({ errors: result.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route3 : Update an existing note of user using: PUT "/api/notes/updateNotes". login required
router.put('/updateNotes/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        //finding the node to be updated 
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        //checing if the user is trying to update the notes of another user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route4 : Deleting an existing note of user using: DELETE "/api/notes/deleteNotes". login required
router.delete('/deleteNotes/:id', fetchuser, async (req, res) => {
    try {
        //finding the note to be deleted
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        //checing if the user is trying to delete the notes of another user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router