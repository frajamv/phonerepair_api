// Update with your config settings.
require('dotenv').config();
const env = process.env
    /**
     * @type { Object.<string, import("knex").Knex.Config> }
     */
module.exports = {
    client: 'mysql',
    connection: {
        host: env.DB_HOST,
        user: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME
    },
    // debug: true // Poner en 'false' al desplegar.
};