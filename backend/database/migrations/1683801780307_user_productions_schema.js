'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserProductionsSchema extends Schema {
  up() {
    this.create('user_productions', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('production_id').unsigned().references('id').inTable('productions')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('user_productions');
  }
}

module.exports = UserProductionsSchema;
