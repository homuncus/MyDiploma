'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserConnectionSchema extends Schema {
  up() {
    this.create('user_connections', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('friend_id').unsigned().references('id').inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.boolean('accepted').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('user_connections');
  }
}

module.exports = UserConnectionSchema;
