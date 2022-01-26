//#region Importaciones y configuraciones.
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');
const userController = require('../src/controllers/user.controller')
chai.should();
chai.use(chaiHttp);
//#endregion

const expect = chai.expect;
describe("User methods", () => {
    let created_user_id;
    let req = {}
    let res = {
        sendCalledWith: '',
        send: function(arg) {
            this.sendCalledWith = arg;
        },
        json: function(err) {
            console.log("\n : " + err);
        },
        status: function(s) { this.statusCode = s; return this; }
    }

    it('Should get all users from database.', async() => {
        await userController.getAllUsers(req, res);
        expect(res.statusCode).to.equal(200);

        const users_array = res.sendCalledWith;
        expect(users_array).to.be.an('array');
    })

    it('Should get all clients from database.', async() => {
        await userController.getAllClients(req, res);
        expect(res.statusCode).to.equal(200);

        const users_array = res.sendCalledWith;
        expect(users_array).to.be.an('array');
        expect(users_array).to.satisfy(user => user.role = 'Cliente');
    })

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

    it('Should get new mocha client from database.', async() => {
        req.params = {
            id: created_user_id
        };

        await userController.getClientData(req, res);
        expect(res.statusCode).to.equal(200);
        mocha_user = res.sendCalledWith;
        expect(mocha_user.role.name).to.equal('Cliente');
        expect(mocha_user.username).to.equal('mocha');
        expect(mocha_user.phones).to.be.empty;
    })

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
})