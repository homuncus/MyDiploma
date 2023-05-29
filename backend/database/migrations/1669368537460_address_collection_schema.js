'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressCollectionSchema extends Schema {
  up () {
    this.create('address_collections', (table) => {
      table.increments();
      table.string('email').unique();
      table.string('uuid').notNullable().unique().index();
      table.json('data');
      table.timestamps();
    })
  }

  down () {
    this.drop('address_collections')
  }
}

module.exports = AddressCollectionSchema
