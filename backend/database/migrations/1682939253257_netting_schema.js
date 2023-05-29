'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class NettingSchema extends Schema {
  up() {
    this.create('nettings', (table) => {
      table.increments();
      table.integer('type_id').unsigned().references('id').inTable('netting_types')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.string('size').notNullable();
      table.string('color').notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('nettings');
  }
}

module.exports = NettingSchema;
