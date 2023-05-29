'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AdminUserRoleSchema extends Schema {
  up() {
    this.create('admin_role_user', (table) => {
      table.increments();
      table.integer('admin_role_id').unsigned().references('id').inTable('admin_roles')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('admin_user_id').unsigned().references('id').inTable('admin_users')
        .onDelete('cascade')
        .onUpdate('cascade');
    });
  }

  down() {
    this.drop('admin_role_user');
  }
}

module.exports = AdminUserRoleSchema;
