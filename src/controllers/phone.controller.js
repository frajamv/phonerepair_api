//#region Importaciones
const { parseSuccess, parseSuccessOK, parseError, generateAccessToken } = require('../utils/parser.utils');
const Phone = require('../models/phone.model');
const Phone_repairing = require('../models/phone_repairing.model');
//#endregion

/**
 * Modulo que contiene todas las funciones que seran enrutadas.
 */
controller = {}

/**
 * Registra un nuevo telefono para el usuario provisto.
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Mensaje de respuesta si el telefono fue creado.
 */
controller.createUserPhone = async(req, res) => {
    try {
        const payload = {
            brand: req.body.brand,
            reference: req.body.reference,
            purchase_year: req.body.purchase_year,
            user_id: req.body.user_id
        };

        if (!payload.brand || !payload.reference || !payload.purchase_year || !payload.user_id)
            return parseError(res, 400, 'Debe provisionar marca, referencia, año de compra y usuario válidos.');

        const addition = await Phone.query().insert(payload);
        if (!addition)
            return parseError(res, 500, 'No pudo agregarse teléfono al usuario.');

        const response = {
            message: 'Teléfono creado satisfactoriamente.',
            phone_id: addition.id,
            token: generateAccessToken(req.user)
        }

        return parseSuccess(res, 201, response);
    } catch (error) {
        return parseError(res, 500, `Error creando teléfono para el usuario: ${error}`);
    }
}

/**
 * Elimina el telefono con el id puesto por parametro. Esta funcion actualmente solo cumple la funcion de ser apoyo al modulo de testing.
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Mensaje de confirmacion o error al eliminar telefono.
 */
controller.deletePhone = async(req, res) => {
    try {
        const phone_id = req.params.id;

        if (!phone_id)
            return parseError(res, 400, 'Debe provisionar un telefono existente a eliminar.');

        const deletion = await Phone.query().delete().where('phone_id', phone_id);
        if (!deletion)
            return parseError(res, 500, 'No se pudo eliminar al telefono.');

        const response = {
            message: 'Telefono eliminado de la base de datos.',
        }

        return parseSuccessOK(res, response);
    } catch (error) {
        return parseError(res, 500, `Error eliminando telefono: ${error}`);
    }
}

/**
 * Elimina la reparacion con el id puesto por parametro. Esta funcion actualmente solo cumple la funcion de ser apoyo al modulo de testing.
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Mensaje de confirmacion o error al eliminar reparacion.
 */
controller.deletePhoneRepairing = async(req, res) => {
    try {
        const phone_repairing_id = req.params.id;

        if (!phone_repairing_id)
            return parseError(res, 400, 'Debe provisionar una reparacion existente a eliminar.');

        const deletion = await Phone_repairing.query().delete().where('phone_repairing_id', phone_repairing_id);
        if (!deletion)
            return parseError(res, 500, 'No se pudo eliminar la reparacion.');

        const response = {
            message: 'Reparacion eliminada de la base de datos.'
        }

        return parseSuccessOK(res, response);
    } catch (error) {
        return parseError(res, 500, `Error eliminando reparacion: ${error}`);
    }
}

/**
 * Obtiene todas las reparaciones realizadas hasta el momento (si las hay).
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Arreglo de reparaciones.
 */
controller.getAllPhoneRepairings = async(req, res) => {
    try {
        const repairings = await Phone_repairing.query()
            .withGraphFetched('[phone.user]')
            .orderBy('created_at', 'DESC');
        const data = {
            data: repairings,
            token: generateAccessToken(req.user)
        }
        parseSuccessOK(res, data);
    } catch (error) {
        return parseError(res, 500, `Error obteniendo reparaciones: ${error}`)
    }
}

/**
 * Obtiene todas las reparaciones realizadas al telefono provisto (si las hay).
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Arreglo de reparaciones del telefono.
 */
controller.getPhoneRepairings = async(req, res) => {
    try {
        const id = req.params.id;
        const repairings = await Phone_repairing.query()
            .where('phone_id', id)
            .orderBy('created_at', 'DESC');
        const data = {
            data: repairings,
            token: generateAccessToken(req.user)
        }
        parseSuccessOK(res, data);
    } catch (error) {
        return parseError(res, 500, `Error obteniendo reparaciones: ${error}`)
    }
}

/**
 * Registra una nueva reparacion realizada a un telefono hasta el momento (si las hay).
 * @param {*} req Peticion HTTP.
 * @param {*} res Respuesta HTTP.
 * @returns Mensaje de respuesta si la reparacion del telefono fue creado.
 */
controller.createPhoneRepairings = async(req, res) => {
    try {
        const payload = {
            phone_entrance_status: req.body.phone_entrance_status,
            phone_exit_status: req.body.phone_exit_status,
            repairing_cost: req.body.repairing_cost,
            phone_id: req.body.phone_id
        };

        if (!payload.phone_entrance_status || !payload.phone_exit_status || !payload.repairing_cost || !payload.phone_id)
            return parseError(res, 400, 'Debe provisionar estado de entrada, estado de salida, costo de reparación y teléfono válidos.');

        const addition = await Phone_repairing.query().insert(payload);
        if (!addition)
            return parseError(res, 500, 'No pudo agregarse la reparación de teléfono al usuario.');

        const response = {
            message: 'Reparación de teléfono creada satisfactoriamente.',
            phone_repairing_id: addition.id,
            token: generateAccessToken(req.user)
        }

        return parseSuccess(res, 201, response);
    } catch (error) {
        return parseError(res, 500, `Error creando reparación de teléfono para el usuario: ${error}`);
    }
}

module.exports = controller;