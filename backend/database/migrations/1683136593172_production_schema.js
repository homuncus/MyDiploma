'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ProductionSchema extends Schema {
  up() {
    this.create('productions', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('material_id').unsigned().references('id').inTable('materials')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('workshop_id').unsigned().references('id').inTable('workshops')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('netting_id').unsigned().references('id').inTable('nettings')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.boolean('completed').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('productions');
  }
}

module.exports = ProductionSchema;
