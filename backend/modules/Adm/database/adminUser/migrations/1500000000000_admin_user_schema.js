'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AdminUserSchema extends Schema {
  up() {
    this.create('admin_users', (table) => {
      table.increments();
      table.string('email').unique();
      table.string('password', 60).notNullable();
      table.boolean('blocked').defaultTo(false);
      table.json('data').nullable();
      table.timestamp('deleted_at').nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('admin_users');
  }
}

module.exports = AdminUserSchema;
