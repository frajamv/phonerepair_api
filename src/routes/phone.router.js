const { Router } = require('express')
const router = Router()
const auth = require('../middlewares/auth')

/**
 * Controlador de teléfonos que ejecutará las operaciones.
 */
const phone = require('../controllers/phone.controller')

/**
 * http://host:port/api/phones/repairings/:id
 */
router.route('/repairings/:id')
    .get(auth, phone.getPhoneRepairings)

/**
 * http://host:port/api/phones/repairings/
 */
router.route('/repairings/')
    .get(auth, phone.getAllPhoneRepairings)
    .post(auth, phone.createPhoneRepairings)

/**
 * http://host:port/api/phones/:id
 */
router.route('/:id')
    .post(auth, phone.createUserPhone)

module.exports = router