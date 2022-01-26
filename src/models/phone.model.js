const { Model } = require("objection");

class Phone extends Model {
    static get tableName() {
        return 'phones';
    }

    static get relationMappings() {
        const Phone_repairing = require('./phone_repairing.model');
        const User = require("./user.model");
        return {
            repairings: {
                relation: Model.HasManyRelation,
                modelClass: Phone_repairing,
                join: {
                    from: 'phones.phone_id',
                    to: 'phone_repairings.phone_id',
                }
            },
            user: {
                relation: Model.HasOneRelation,
                modelClass: User,
                join: {
                    from: 'phones.user_id',
                    to: 'users.user_id',
                }
            }
        }
    }
}

module.exports = Phone;