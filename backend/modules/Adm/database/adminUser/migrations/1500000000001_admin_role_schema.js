'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RolesTableSchema extends Schema {
  up() {
    this.create('admin_roles', (table) => {
      table.increments();
      table.string('slug').notNullable().unique();
      table.string('name').notNullable().unique();
      table.text('description').nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('admin_roles');
  }
}

module.exports = RolesTableSchema;
