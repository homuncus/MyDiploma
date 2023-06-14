'use strict';

const Workshop = use('Workshops/Models/Workshop');

class WorkshopSeeder {
  async run() {
    await Workshop.findOrCreate(
      {
        slug: 'hpfk-nu-lp'
      },
      {
        name: 'ХПФК НУ "ЛП"',
        slug: 'hpfk-nu-lp',
        address: 'м. Хмельницький, вул. Зарічанська 10',
        description: 'Хмельницький політехнічний колеж'
      }
    );
  }
}

module.exports = WorkshopSeeder;
