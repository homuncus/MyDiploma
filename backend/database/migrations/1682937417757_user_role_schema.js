'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserRoleSchema extends Schema {
  up() {
    this.create('user_roles', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('role_id').unsigned().references('id').inTable('roles')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('user_roles');
  }
}

module.exports = UserRoleSchema;
