//#region Importaciones y configuraciones.
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');
const userController = require('../src/controllers/user.controller')
chai.should();
chai.use(chaiHttp);
//#endregion

const expect = chai.expect;
/**
 * PRUEBAS PARA METODOS DE CONTROLADOR DE USUARIOS.
 */
describe("User methods", () => {
    let created_user_id; // id de usuario que sera creado en casos puntuales.
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
     * Obtener todos los usuarios de la BD.
     * Verificar que se obtengan correctamente con status 200 y que sea un arreglo de objetos (puede ser vacío).
     */
    it('Should get all users from database.', async() => {
        await userController.getAllUsers(req, res);
        expect(res.statusCode).to.equal(200);

        const users_array = res.sendCalledWith;
        expect(users_array).to.be.an('array');
    })

    /**
     * Obtener todos los clientes de la BD.
     * Verificar que se obtengan correctamente con status 200, que sea un arreglo de objetos y que los usuarios obtenidos tengan el rol 'Cliente'. 
     */
    it('Should get all clients from database.', async() => {
        await userController.getAllClients(req, res);
        expect(res.statusCode).to.equal(200);

        const users_array = res.sendCalledWith;
        expect(users_array).to.be.an('array');
        expect(users_array).to.satisfy(user => user.role = 'Cliente');
    })

    /**
     * Insertar nuevo usuario 'Cliente' a la base de datos.
     * Se ingresa un objeto de pruebas para usuario de tipo cliente (role_id = 2) y se inserta.
     * Verificar que se cree correctamete con status 201 y que su id primaria exista.
     * Su id primaria se guardara como objeto de pruebas para pruebas posteriores.
     */
    it('Should insert a client to database.', async() => {
        req.body = {
            full_name: 'Mario Orlando Carrillo Howard Arlington',
            username: 'mocha',
            password: 'root123',
            role_id: 2
        }
        await userController.createUser(req, res);
        expect(res.statusCode).to.equal(201);
        expect(res.sendCalledWith.user_id).to.not.equal(undefined);
        created_user_id = res.sendCalledWith.user_id;
    })

    /**
     * Obtener el cliente con username 'mocha' creado anteriormente.
     * Verificar que se obtenga el dato correctamente con status 200, que su rol sea 'Cliente', su id primaria sea igual a la creada anteriormente
     * y no tenga ningun telefono registrado.
     */
    it('Should get new mocha client from database.', async() => {
        req.params = {
            id: created_user_id
        };

        await userController.getClientData(req, res);
        expect(res.statusCode).to.equal(200);
        mocha_user = res.sendCalledWith;
        expect(mocha_user.role.name).to.equal('Cliente');
        expect(mocha_user.user_id).to.equal(created_user_id);
        expect(mocha_user.phones).to.be.empty;
    })

    /**
     * Iniciar sesion como usuario creado anteriormente.
     * Verificar que al ingresar username incorrecto retorne 404.
     * Verificar que al ingresar username correcto pero contrasena incorrecta retorne 400.
     * Verificar que al ingresar username y contrasena correctas retorne 200, que obtenga un token y el usuario (sin contrasena).
     */
    it('Should login as mocha.', async() => {
        req.body = {
            username: 'moka',
            password: 'root1234'
        }
        await userController.login(req, res);
        expect(res.statusCode).to.equal(404);

        req.body = {
            username: 'mocha',
            password: 'root1234'
        }
        await userController.login(req, res);
        expect(res.statusCode).to.equal(400);

        req.body = {
            username: 'mocha',
            password: 'root123'
        }
        await userController.login(req, res);
        expect(res.statusCode).to.equal(200);
        expect(res.sendCalledWith.token).to.not.equal(undefined);
        expect(res.sendCalledWith.user).to.not.equal(undefined);
    })

    it('Clean test data.', async() => {
        if (created_user_id) {
            req.params.id = created_user_id;
            await userController.deleteUser(req, res);
        }
    })
})