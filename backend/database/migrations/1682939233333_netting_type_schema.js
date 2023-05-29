'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class NettingTypeSchema extends Schema {
  up() {
    this.create('netting_types', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.text('description');
      table.timestamps();
    });
  }

  down() {
    this.drop('netting_types');
  }
}

module.exports = NettingTypeSchema;
