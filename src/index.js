require('dotenv').config();

const server = require('./app');

server.listen(server.get('port'), () => {
    console.log('Servidor en linea en el puerto ' + server.get('port'))
});