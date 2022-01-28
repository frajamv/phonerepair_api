const { Router } = require('express')
const router = Router()
const auth = require('../middlewares/auth')

/**
 * Controlador de usuarios que ejecutará las operaciones.
 */
const user = require('../controllers/user.controller')

/**
 * http://host:port/api/users/authenticate
 */
router.route('/authenticate')
    .post(user.login)

/**
 * http://host:port/api/users/client
 */
router.route('/client')
    .get(auth, user.getAllClients)

/**
 * http://host:port/api/users/client/:id
 */
router.route('/client/:id')
    .get(auth, user.getClientData)

/**
 * http://host:port/api/users
 */
router.route('/')
    .get(auth, user.getAllUsers)
    .post(user.createUser)

module.exports = router