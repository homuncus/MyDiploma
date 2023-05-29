'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MessageReportSchema extends Schema {
  up() {
    this.create('message_reports', (table) => {
      table.increments();
      table.text('description').nullable();
      table.integer('user_id').unsigned().references('id').inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('message_id').unsigned().references('id').inTable('messages')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.boolean('solved').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('message_reports');
  }
}

module.exports = MessageReportSchema;
