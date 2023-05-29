'use strict';

const Env = use('Env');

const AdminUser = use('Adm/Models/AdminUser');

class AdminUsersSeeder {
  async run() {
    await AdminUser.findOrCreate(
      {
        email: Env.get('ADMIN_EMAIL', 'admin@admin.com')
      },
      {
        email: Env.get('ADMIN_EMAIL', 'admin@admin.com'),
        password: Env.get('ADMIN_PASSWORD', '123123'),
      }
    );
  }
}

module.exports = AdminUsersSeeder;
