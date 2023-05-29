'use strict';

const AdminRole = use('Adm/Models/AdminRole');

class AdminRolesSeeder {
  async run() {
    await AdminRole.findOrCreate(
      { slug: AdminRole.admin },
      {
        slug: AdminRole.admin,
        name: AdminRole.admin,
        description: 'Admin',
      }
    );
    await AdminRole.findOrCreate(
      { slug: AdminRole.manager },
      {
        slug: AdminRole.manager,
        name: AdminRole.manager,
        description: 'Manager',
      }
    );
  }
}

module.exports = AdminRolesSeeder;
