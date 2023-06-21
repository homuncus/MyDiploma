'use strict';

const Workshop = use('Workshops/Models/Workshop');
const UserWorkshop = use('Workshops/Models/UserWorkshop');

class WorkshopSeeder {
  async run() {
    const { id: workshop_id } = await Workshop.findOrCreate(
      {
        slug: 'hpfk-nu-lp'
      },
      {
        name: 'ХПФК НУ "ЛП"',
        slug: 'hpfk-nu-lp',
        address: 'м. Хмельницький, вул. Зарічанська 10',
        description: 'Хмельницький політехнічний колеж',
        confirmed: true
      }
    );

    await UserWorkshop.findOrCreate(
      {
        id: 1
      },
      {
        user_id: 1,
        workshop_id,
        is_manager: true
      }
    );
  }
}

module.exports = WorkshopSeeder;
