const { Model } = require("objection");

class Role extends Model {
    static get tableName() {
        return 'roles';
    }

    static get relationMappings() {
        const User = require('./user.model');
        return {
            user: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'users.role_id',
                    to: 'roles.role_id',
                }
            }
        }
    }
}

module.exports = Role;