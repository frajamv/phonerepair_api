const { Model } = require("objection");

class Phone_repairing extends Model {
    static get tableName() {
        return 'phone_repairings';
    }

    static get relationMappings() {
        const Phone = require('./phone.model');
        return {
            role: {
                relation: Model.HasOneRelation,
                modelClass: Phone,
                join: {
                    from: 'phone_repairings.phone_id',
                    to: 'phones.phone_id',
                }
            }
        }
    }
}

module.exports = Phone_repairing;