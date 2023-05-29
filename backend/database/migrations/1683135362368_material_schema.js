'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MaterialSchema extends Schema {
  up() {
    this.create('materials', (table) => {
      table.increments();
      table.string('name').index().notNullable();
      table.text('description');
      table.integer('quantity').unsigned().notNullable();
      table.decimal('ppu', 2); // price per unit
      table.integer('workshop_id').unsigned().references('id').inTable('workshops')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('materials');
  }
}

module.exports = MaterialSchema;
