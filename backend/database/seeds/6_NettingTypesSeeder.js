'use strict';

const NettingType = use('Nettings/Models/Type');

class NettingTypesSeeder {
  async run() {
    await NettingType.findOrCreate(
      {
        slug: 'kikimora'
      },
      {
        name: 'Кікімора',
        slug: 'kikimora',
        description: 'asd',
      }
    );

    await NettingType.findOrCreate(
      {
        slug: 'zvichajna-maskuvalna'
      },
      {
        name: 'Звичайна маскувальна',
        slug: 'zvichajna-maskuvalna',
        description: 'asd2',
      }
    );
  }
}

module.exports = NettingTypesSeeder;
