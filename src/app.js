const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const app = express();
const env = process.env; // Obtener datos de archivo .ENV
const config = require('../knexfile')
const { Model } = require('objection');
const Knex = require('knex');
const db = Knex(config);
Model.knex(db);

app.set('port', env.PORT || 80);

// MIDDLEWARES:
app.use(cors()); // Permitir comunicación entre servidores.
app.use(morgan('dev')) // Atrapar y mostrar las peticiones al API.
app.use(express.json()); // Permitir lectura y escritura de objetos JSON en las peticiones y respuestas.

// RUTAS PRINCIPALES
app.use('/api/users', require('./routes/users.router')); // CRUD de usuarios.
app.use('/api/phones', require('./routes/phones.router')); // CRUD de telefonos y reparaciones.
app.use('/', (req, res) => res.send("Hello world!")); // Raiz de REST API.

module.exports = app;