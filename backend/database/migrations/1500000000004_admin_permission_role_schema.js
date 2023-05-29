'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AdminPermissionSchema extends Schema {
  up() {
    this.create('admin_permission_role', (table) => {
      table.increments();
      table.integer('admin_permission_id').unsigned().references('id').inTable('admin_permissions')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('admin_role_id').unsigned().references('id').inTable('admin_roles')
        .onDelete('cascade')
        .onUpdate('cascade');
    });
  }

  down() {
    this.drop('admin_permission_role');
  }
}

module.exports = AdminPermissionSchema;
