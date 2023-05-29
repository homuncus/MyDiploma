'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MessageSchema extends Schema {
  up() {
    this.create('messages', (table) => {
      table.increments();
      table.integer('sender_id').unsigned().references('id').inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('receiver_id').unsigned().references('id').inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.string('message', 300).notNullable();
      table.boolean('read').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('messages');
  }
}

module.exports = MessageSchema;
