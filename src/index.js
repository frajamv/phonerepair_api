require('dotenv').config();

/**
 * Servidor de express configurado con dependencias, rutas, conexiones y middlewares.
 */
const server = require('./app');

/**
 * Encender servidor en puerto ubicado en variable de entorno.
 */
server.listen(server.get('port'), () => {
    console.log('Servidor en linea en el puerto ' + server.get('port'))
});