const { Model } = require("objection");

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get relationMappings() {
        const Role = require('./role.model');
        const Phone = require("./phone.model");
        return {
            role: {
                relation: Model.HasOneRelation,
                modelClass: Role,
                join: {
                    from: 'users.role_id',
                    to: 'roles.role_id',
                }
            },
            phones: {
                relation: Model.HasManyRelation,
                modelClass: Phone,
                join: {
                    from: 'users.user_id',
                    to: 'phones.user_id',
                }
            }
        }
    }
}

module.exports = User;