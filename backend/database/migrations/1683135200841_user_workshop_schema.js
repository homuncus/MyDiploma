'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserWorkshopSchema extends Schema {
  up() {
    this.create('user_workshops', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('workshop_id').unsigned().references('id').inTable('workshops')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.boolean('is_manager').defaultTo('false');
      table.timestamps();
    });
  }

  down() {
    this.drop('user_workshops');
  }
}

module.exports = UserWorkshopSchema;
