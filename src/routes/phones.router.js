const { Router } = require('express')
const router = Router()
const auth = require('../middlewares/auth')

const phone = require('../controllers/phone.controller')

/**
 * http://host:port/api/phones/client/:id
 */
router.route('/:id')
    .post(auth, phone.createUserPhone)

/**
 * http://host:port/api/phones/client/:id
 */
router.route('/repairings/:id')
    .get(auth, phone.getPhoneRepairings)

/**
 * http://host:port/api/phones/client/:id
 */
router.route('/repairings/')
    .get(auth, phone.getAllPhoneRepairings)
    .post(auth, phone.createPhoneRepairings)

module.exports = router