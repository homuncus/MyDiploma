'use strict';

const Route = use('Route');
const Database = use('Database');
const View = use('View');
const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

const Manager = use('Managers/Models/Manager')
const Role = use('Managers/Models/AdminRole');

class ManagersController {
  async index({ view, auth, __ }) {
    const table = new TableBuilder('admin_users');

    table.setName(__('Managers.user.list'));

    if (auth.user.managerCan('admin_users_create')) {
      table.setButtons([
        [`<a href="${Route.url('admin.user.edit')}" class="no-history pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Managers.user.email'), width: '' },
      { title: __('Managers.user.created_at'), width: '10%' },
      { title: __('Managers.user.updated_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Managers.user.list'), url: Route.url('admin.user.index') },
    ]);

    return view.render('Managers.user.index', {
      table: table.build()
    });
  }

  async list({ request, response }) {
    const query = Database.select(['admin_users.id', 'admin_users.email', 'admin_users.blocked',
      'admin_users.blocked', 'admin_users.created_at', 'admin_users.updated_at', 'admin_users.deleted_at'])
      .from('admin_users');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    let data = await Manager.find(id);

    const roles = (await Role.query().orderBy('id', 'asc').fetch()).toJSON();

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    if (data) {
      await data.load('roles');
      data = data.toJSON();
      data.roles = data.roles.map(el => el.id);
    }

    return response.json({
      modal: {
        title: id ? __('Managers.user.edit') : __('Managers.user.create'),
        content: View.render('Managers.user.form', { data, roles }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ request, response }) {
    const input = request.only(['email', 'password']);
    const id = request.input('id');
    const roles = request.input('roles', []);
    input.blocked = request.input('blocked', false);

    let manager = {};

    if (!id) {
      manager = new Manager();
    } else {
      manager = await Manager.find(id);
      if (!manager) {
        return response.json(Notify.error('Manager not found', {}));
      }
    }

    if (!input.password) {
      input.password = manager.password;
    }

    manager.merge(input);
    await manager.save();

    await manager.roles().detach();
    await manager.roles().attach(roles);

    return response.json(Notify.success('Saved', {}));
  }

  async delete({ response, params }) {
    const { id } = params;
    const manager = await Manager.find(id);

    if (!manager) {
      return response.json(Notify.error('Something went wrong. Manager not found', {}));
    }

    if (await manager.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = ManagersController;
