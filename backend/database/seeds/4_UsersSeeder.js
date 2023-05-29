'use strict';

const User = use('Adm/Models/User');

class AdminRoleUserSeeder {
  async run() {
    await User.findOrCreate(
      {
        email: 'cot.cotenov@gmail.com'
      },
      {
        email: 'cot.cotenov@gmail.com',
        password: '123123',
      }
    );
  }
}

module.exports = AdminRoleUserSeeder;
