'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class WorkshopSchema extends Schema {
  up() {
    this.create('workshops', (table) => {
      table.increments();
      table.string('name').index().notNullable();
      table.string('slug').index().notNullable();
      table.text('description').notNullable();
      table.text('address').notNullable();
      table.boolean('confirmed').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('workshops');
  }
}

module.exports = WorkshopSchema;
