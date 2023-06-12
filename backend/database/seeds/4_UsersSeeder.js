'use strict';

const User = use('Users/Models/User');

class UserSeeder {
  async run() {
    await User.findOrCreate(
      {
        email: 'cot.cotenov@gmail.com'
      },
      {
        email: 'cot.cotenov@gmail.com',
        username: 'marselopistola',
        password: '123123',
      }
    );
  }
}

module.exports = UserSeeder;
