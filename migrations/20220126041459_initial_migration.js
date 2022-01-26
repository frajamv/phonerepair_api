// INITIAL MIGRATION.

exports.up = (knex) => {
    return knex.schema.createTable('roles', table => {
        table.increments('role_id').primary();
        table.string('name');
        table.enum('status', ['1', '0']).notNullable().defaultTo('1');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    }).createTable('users', table => {
        table.increments('user_id').primary();
        table.string('full_name');
        table.string('username');
        table.string('password');
        table.integer('role_id').unsigned().references('roles.role_id');
        table.enum('status', ['1', '0']).notNullable().defaultTo('1');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    }).createTable('phones', table => {
        table.increments('phone_id').primary();
        table.string('brand');
        table.string('reference');
        table.integer('purchase_year', 5);
        table.integer('user_id').unsigned().references('users.user_id');
        table.enum('status', ['1', '0']).notNullable().defaultTo('1');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    }).createTable('phone_repairings', table => {
        table.increments('phone_repairing_id').primary();
        table.string('phone_entrance_status');
        table.string('phone_exit_status');
        table.decimal('repairing_cost', 20, 2);
        table.integer('phone_id').unsigned().references('phones.phone_id');
        table.enum('status', ['1', '0']).notNullable().defaultTo('1');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('phone_repairings')
        .dropTable('phones')
        .dropTable('users')
        .dropTable('roles')
};