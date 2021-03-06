const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info('connecting to', config.MONGOBD_URI);
// CONECTAMOS CON LA BASE DE DATOS
mongoose.connect(config.MONGOBD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then( () => {
    logger.info('connected to MongoDB');
})
.catch( (error) => {
    logger.error('error connecting to MongoDB:', error.message);
});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
// EL ENRUTADOR FUNCIONARÁ SI LA RUTA ES /api/notes
app.use('/api/notes', notesRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;