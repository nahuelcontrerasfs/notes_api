// CREAMOS UN NUEVO OBJETO ROUTER
const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes);
    });
});

notesRouter.get('/:id', (req, res, next) => {
    Note.findById(req.params.id).then(note => {
        if(note)
            res.json(note);
        else
            res.status(404).end();
    }).catch(error => next());
});

notesRouter.post('/', (req, res, next) => {
    const body = req.body;

    const note = new Note({
        content: body.content,
        inmportant: body.inmportant || false,
        date: new Date(),
    });

    note.save()
        .then(savedNote => {
            res.json(savedNote.toJSON);
        })
        .then(savedAndFormattedNote => {
            res.json(savedAndFormattedNote);
        })
        .catch(error => next(error));
});


notesRouter.delete('/:id', (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error))
});

notesRouter.put('/:id', (req, res, next) => {    
    const body = req.body;

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id, note, {new: true})
        .then(updatedNote => {
            res.json(updatedNote);
        })
        .catch(error => next(error));
});

// SE EXPORTA EL ENRUTADOR PARA QUE ESTE DISPONIBLE PARA TODOS LOS CONSUMIDORES DEL MÓDULO
module.exports = notesRouter;