//#region Importaciones
const { parseSuccess, parseSuccessOK, parseError } = require('../utils/parser.utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const salt_rounds = 10;
const env = process.env;
const User = require('../models/user.model');
//#endregion

/**
 * Modulo que contiene todas las funciones que seran enrutadas.
 */
controller = {}

/**
 * Obtiene todos los usuarios registrados en el sistema.
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Arreglo de usuarios registrados en la base de datos.
 */
controller.getAllUsers = async(req, res) => {
    try {
        const users = await User.query()
            .select('user_id', 'full_name', 'username', 'roles.name AS role', 'roles.role_id AS role_id', 'users.status')
            .leftJoin('roles', 'roles.role_id', 'users.role_id');
        parseSuccessOK(res, users);
    } catch (error) {
        return parseError(res, 500, `Error obteniendo usuarios: ${error}`)
    }
}

/**
 * Obtiene todos los usuarios registrados en el sistema que contienen el rol 'Cliente'.
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Arreglo de clientes registrados en la base de datos.
 */
controller.getAllClients = async(req, res) => {
    try {
        const users = await User.query()
            .select('users.user_id',
                'full_name',
                'username',
                'status'
            )
            .withGraphFetched('[phones, role]')
        const clients = users.filter(u => u.role.name === 'Cliente').map(c => {
            return {
                ...c,
                role_id: c.role.role_id,
                role: c.role.name
            }
        })
        parseSuccessOK(res, clients);
    } catch (error) {
        return parseError(res, 500, `Error obteniendo clientes: ${error}`)
    }
}

/**
 * Registra un nuevo usuario en el sistema, su contrasena se guardara encriptada.
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Mensaje de confirmacion o error al crear usuario.
 */
controller.createUser = async(req, res) => {
    try {
        const payload = {
            full_name: req.body.full_name,
            username: req.body.username,
            password: req.body.password,
            role_id: req.body.role_id
        };

        if (!payload.full_name || !payload.username || !payload.role_id || !payload.password)
            return parseError(res, 400, 'Debe provisionar nombre completo, nombre de usuario, contraseña y rol válidos.');

        const existing_user = await User.query().where('username', payload.username);
        if (existing_user.length > 0)
            return parseError(res, 400, `Ya existe un nombre de usuario con el nombre ${payload.username}.`);

        const hashed_password = await _generateHashedPassword(payload.password);
        payload.password = hashed_password;

        const addition = await User.query().insert(payload);
        if (!addition)
            return parseError(res, 500, 'No pudo agregarse al usuario.');

        const response = {
            message: 'Usuario creado satisfactoriamente.',
            user_id: addition.id
        }

        return parseSuccess(res, 201, response);
    } catch (error) {
        return parseError(res, 500, `Error creando usuario: ${error}`);
    }
}

/**
 * Elimina el usuario con el id puesto por parametro. Esta funcion actualmente solo cumple la funcion de ser apoyo al modulo de testing.
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Mensaje de confirmacion o error al eliminar usuario.
 */
controller.deleteUser = async(req, res) => {
    try {
        const user_id = req.params.id;

        if (!user_id)
            return parseError(res, 400, 'Debe provisionar un usuario existente a eliminar.');

        const deletion = await User.query().delete().where('user_id', user_id);
        if (!deletion)
            return parseError(res, 500, 'No se pudo eliminar al usuario.');

        const response = {
            message: 'Usuario eliminado de la base de datos.'
        }

        return parseSuccessOK(res, response);
    } catch (error) {
        return parseError(res, 500, `Error eliminando usuario: ${error}`);
    }
}

/**
 * Obtiene todos los datos de un cliente, incluyendo su rol y sus teléfonos.
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Objeto usuario encontrado.
 */
controller.getClientData = async(req, res) => {
    try {
        const id = req.params.id;
        const data = await User.query()
            .select('users.user_id', 'full_name', 'username', 'users.created_at')
            .where('users.user_id', id)
            .withGraphFetched('[role, phones.repairings]');
        parseSuccessOK(res, data[0]);
    } catch (error) {
        return parseError(res, 500, `Error obteniendo datos del cliente: ${error}`)
    }
}

/**
 * Busca a un usuario con 'username' en el sistema y compara su contraseña con la obtenida en base de datos, si el usuario existe.
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Mensaje de confirmacion o error al autenticar. Si se autentica correctamente contendra el usuario que inicia sesion y un token con sus datos.
 */
controller.login = async(req, res) => {
    try {
        const credentials = {
            username: req.body.username,
            password: req.body.password
        }

        if (!credentials.username || !credentials.password)
            return parseError(res, 400, { status: 'Debe provisionar nombre de usuario y contraseña.' });

        const found = await User.query()
            .select('user_id', 'full_name', 'username', 'password', 'role.name AS role', 'role.role_id AS role_id', 'users.status')
            .where('username', credentials.username)
            .joinRelated('role');

        if (!found[0])
            return parseError(res, 404, { status: `El nombre de usuario ${credentials.username} no está registrado.` });

        const user = found[0];
        const correct_password = await _comparePasswords(credentials.password, user.password);
        if (correct_password) {
            delete user.password
            const token = jwt.sign({
                    ...user
                },
                env.JWT_KEY, {
                    expiresIn: '3600s',
                }
            );

            const payload = {
                message: `¡Bienvenido, ${user.full_name}!`,
                user: user,
                token: token
            }
            return parseSuccessOK(res, payload)
        }

        const payload = {
            message: 'Contraseña incorrecta.',
        }
        return parseError(res, 400, payload)
    } catch (error) {
        return parseError(res, 500, error)
    }
}

//#region Funciones privadas del controlador.
/**
 * Crea una contraseña encriptada.
 * @param {*} plain_password Contraseña nueva en texto plano.
 * @returns Contraseña encriptada con bcrypt.
 */
const _generateHashedPassword = async(plain_password) => {
    const hash = await bcrypt.hash(plain_password, salt_rounds)
    return hash
};

/**
 * Compara una contraseña provista en texto plano con una encriptada (usualmente obtenida de la BD). 
 * @param {*} plain_password Texto plano con contraseña.
 * @param {*} hashed_password Contraseña encriptada para comarar.
 * @returns true si son iguales, false de lo contrario.
 */
const _comparePasswords = async(plain_password, hashed_password) => {
    const result = await bcrypt.compare(plain_password, hashed_password)
    return result;
};
//#endregion

module.exports = controller;