const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');
const userController = require('../src/controllers/user.controller')
const phoneController = require('../src/controllers/phone.controller')
chai.should();
chai.use(chaiHttp);

const expect = chai.expect;
/**
 * PRUEBAS PARA METODOS DE CONTROLADOR DE TELEFONOS.
 */
describe("Phone methods", () => {
    let created_user_id; // id de usuario que sera creado en casos puntuales.
    let created_phone_id; // id de telefono que sera creado en casos puntuales.
    let created_phone_repairing_id; // id de reparacion de telefono que sera creado en casos puntuales.
    let req = {} // Objeto que simulara la peticion a los controladores.
    let res = { // Objeto de respuesta que guardara el resultado de los metodos.
        sendCalledWith: '',
        send: function(arg) {
            this.sendCalledWith = arg;
        },
        json: function(err) {
            console.log("\n : " + err);
        },
        status: function(s) { this.statusCode = s; return this; }
    }

    /**
     * Insertar un nuevo usuario y un telefono.
     * Verificar que al crear usuario se obtenga status 201 y un id primario. Se guardara este id para pruebas posteriores.
     * Verificar que al crear telefono se obtenga status 201 y un id primario. Se guardara este id para pruebas posteriores.
     */
    it('Should insert a user with a phone.', async() => {
        req.body = {
            full_name: 'Lorem Ipsum Dolor Sit Amet',
            username: 'phoneowner',
            password: 'root1234',
            role_id: 2
        }
        await userController.createUser(req, res);
        expect(res.statusCode).to.equal(201);
        expect(res.sendCalledWith.user_id).to.not.equal(undefined);
        created_user_id = res.sendCalledWith.user_id;

        req.body = {
            brand: 'OnePlus',
            reference: 'Nord',
            purchase_year: 2022,
            user_id: created_user_id
        }
        await phoneController.createUserPhone(req, res);
        expect(res.statusCode).to.equal(201);
        created_phone_id = res.sendCalledWith.phone_id;
    })

    /**
     * Obtener usuario ingresado junto con el telefono.
     * Verificar que al obtener al usuario se obtenga status 200 y extraer sus telefonos en un arreglo.
     * Verificar que exista un telefono con el id del telefono creado anteriormente.
     */
    it('Should get inserted user with phone.', async() => {
        req.params = {
            id: created_user_id
        }
        await userController.getClientData(req, res);
        expect(res.statusCode).to.equal(200);

        const client_user = res.sendCalledWith;
        expect(client_user.phones).not.to.be.empty;
        const test_phone = client_user.phones.filter(phone => phone.phone_id === created_phone_id)
        expect(test_phone).not.to.be.empty;
    })

    /**
     * Registrar una nueva reparacion a telefono creado anteriormente.
     * Verificar que la creacion resulte en status 200 yque tenga id primario.
     * Se guarda id primario para pruebas posteriores.
     */
    it('Should register repairings to phone.', async() => {
        req.body = {
            phone_entrance_status: 'Prueba de telefono funcional. Ingresa con rayones menores.',
            phone_exit_status: 'Prueba de telefono fucional. Sale pulido y en perfecto estado.',
            repairing_cost: 256256,
            phone_id: created_phone_id
        }
        await phoneController.createPhoneRepairings(req, res);
        expect(res.statusCode).to.equal(201);
        expect(res.sendCalledWith.phone_repairing_id).to.not.equal(undefined);
        created_phone_repairing_id = res.sendCalledWith.phone_repairing_id;
    })

    /**
     * Obtener la reparacion del todo telefono existente.
     * Verificar que se obtenga status 200.
     */
    it('Should get all phone repairings.', async() => {
        await phoneController.getAllPhoneRepairings(req, res);
        expect(res.statusCode).to.equal(200);
        expect(res.sendCalledWith).not.to.be.empty;
    })

    it('Clean test data.', async() => {
        if (created_phone_repairing_id) {
            req.params.id = created_phone_repairing_id;
            await phoneController.deletePhoneRepairing(req, res);
        }
        if (created_phone_repairing_id) {
            req.params.id = created_phone_id;
            await phoneController.deletePhone(req, res);
        }
        if (created_phone_repairing_id) {
            req.params.id = created_user_id;
            await userController.deleteUser(req, res);
        }
    })
})