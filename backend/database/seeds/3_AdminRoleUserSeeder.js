'use strict';

const Env = use('Env');

const AdminUser = use('Adm/Models/AdminUser');
const AdminRole = use('Adm/Models/AdminRole');

class AdminRoleUserSeeder {
  async run() {
    const role = await AdminRole.findBy({ slug: AdminRole.admin });
    const user = await AdminUser.findBy({ email: Env.get('ADMIN_EMAIL', 'admin@admin.com') });

    await role.users().attach([user.id]);
  }
}

module.exports = AdminRoleUserSeeder;
