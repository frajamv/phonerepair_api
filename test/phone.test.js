const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');
const userController = require('../src/controllers/user.controller')
const phoneController = require('../src/controllers/phone.controller')
chai.should();
chai.use(chaiHttp);
const expect = chai.expect;

describe("Phone methods", () => {
    let created_user_id;
    let created_phone_id;
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

    it('Should insert a user with a phone.', async() => {
        req.body = {
            full_name: 'Lorem Ipsum Dolor Sit Amet',
            username: 'phoneowner',
            password: 'root123',
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

    it('Should get inserted user with phone.', async() => {
        req.params = {
            id: created_user_id
        }
        await userController.getClientData(req, res);
        expect(res.statusCode).to.equal(200);

        const client_user = res.sendCalledWith;
        expect(client_user.phones).not.to.be.empty;
        const test_phone = client_user.phones.filter(phone => phone.phone_id = created_phone_id)
        expect(test_phone).not.to.be.empty;
    })
})