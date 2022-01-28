const jwt = require('jsonwebtoken');
const env = process.env;

response = {}

/**
 * Traer data obtenida por el servicio con código de status exitoso.
 * @param {*} http_response paquete HTTP con respuesta.
 * @param {*} status_code Status HTTP de la operacion.
 * @param {*} data Datos de respuesta.
 */
response.parseSuccess = (http_response, status_code, data) => {
    http_response.status(status_code || 200).send(data)
}

/**
 * Traer data obtenida por el servicio con código de status 200 (OK).
 * @param {*} http_response paquete HTTP con respuesta.
 * @param {*} data Datos de la respuesta.
 */
response.parseSuccessOK = (http_response, data) => {
    http_response.status(200).send(data)
}

/**
 * Retorna mensaje de error con status HTTP de error para la peticion.
 * @param {*} http_response paquete HTTP con respuesta.
 * @param {*} status_code Status HTTP de la operacion.
 * @param {*} message Mensaje de error.
 */
response.parseError = (http_response, status_code, message) => {
    http_response.status(status_code || 500).send(message)
}

/**
 * Genera un token con el usuario provisto.
 * @param {*} user Usuario con datos de acceso.
 * @returns Token con usuario.
 */
response.generateAccessToken = async(user) => {
    return await jwt.sign({
            ...user
        },
        env.JWT_KEY, {
            expiresIn: '3600s',
        }
    );
}

module.exports = response