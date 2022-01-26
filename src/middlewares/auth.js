const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const env = process.env;
const { parseError } = require('../utils/parser.utils');


/**
 * Verifica que el usuario este en el sistema y que tenga un rol ACTUALMENTE (En base de datos, no al iniciar sesion).
 * @param {*} req Peticion HTTP
 * @param {*} res Respuesta HTTP
 * @param {*} next Metodo de acceso al controlador (si se permite).
 * @returns Mensaje de error si el usuario es invalido, o redirige al controlador en cuestion.
 */
const verifyToken = async(req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return parseError(res, 403, 'Debe iniciar sesión para acceder al sistema.')
    }
    try {
        const decoded = jwt.verify(token, env.JWT_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(403).send('Sesión inválida.');
    }

    const current = await User.query().where('user_id', req.user.user_id);
    console.log(req.user.role_id);
    console.log(current[0].role_id);

    if (!current || !current[0].role_id || current[0].role_id === '')
        return parseError(res, 403, 'El usuario no tiene roles válidos en el sistema. Sus roles han sido eliminados dentro de su sesión.');

    return next();
};

module.exports = verifyToken;