'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments();
      table.string('username').unique().index().notNullable();
      table.string('email').unique();
      table.text('about').defaultTo('');
      table.string('password', 60).notNullable();
      table.boolean('blocked').defaultTo(false);
      table.json('data').nullable();
      table.timestamp('deleted_at').nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
