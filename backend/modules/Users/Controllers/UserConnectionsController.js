const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const UserConnection = use('Users/Models/UserConnection');

class UserConnectionsController {
  async index({ view, auth, __ }) {
    const table = new TableBuilder('userConnections');

    table.setName(__('Users.userConnections.list'));

    if (auth.user.managerCan('userConnections_create')) {
      table.setButtons([
        [`<a href="${Route.url('Users.userConnections.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Users.userConnections.user_id'), width: '' },
      { title: __('Users.userConnections.friend_id'), width: '' },
      { title: __('Users.userConnections.accepted'), width: '' },
      { title: __('Users.userConnections.created_at'), width: '10%' },
      { title: __('Users.userConnections.updated_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Users.userConnections.userConnections'), url: Route.url('Users.userConnections.index') },
    ]);

    return view.render('Users.userConnections.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('user_connections.id',
        'u1.username',
        'u2.username',
        'user_connections.accepted',
        'user_connections.created_at',
        'user_connections.updated_at')
      .from('user_connections')
      .joinRaw('JOIN users u1 ON user_connections.user_id = u1.id')
      .joinRaw('JOIN users u2 ON user_connections.friend_id = u2.id');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await UserConnection.find(id);

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('Users.userConnections.edit') : __('Users.userConnections.create'),
        content: View.render('Users.userConnections.form', { data }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ request, response }) {
    const input = request.all();

    let userConnection = {};

    if (!input.id) {
      userConnection = new UserConnection();
    } else {
      userConnection = await UserConnection.find(input.id);
      if (!userConnection) {
        return response.json(Notify.error('UserConnection not found', {}));
      }
    }

    userConnection.merge(input);

    if (!await userConnection.save()) {
      return response.json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const userConnection = await UserConnection.find(id);
    const mirrorUserConnection = await UserConnection.query()
      .where('user_id', userConnection.friend_id)
      .andWhere('friend_id', userConnection.user_id)
      .fetch();

    if (!userConnection) {
      return response.json(Notify.error('Something went wrong. userConnection not found', {}));
    }

    if (mirrorUserConnection) {
      await mirrorUserConnection.delete();
    }
    if (await userConnection.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }

  async accept({ params, response, auth }) {
    const { id } = params; // friend request id
    if (!id) {
      return response.json(Notify.error('Something went wrong. Request id not found', {}));
    }

    const incomingConnection = await UserConnection.find(id);

    if (!incomingConnection) {
      return response.notFound(Notify.error('Couldnt find a friend request', {}));
    }

    if (incomingConnection.friend_id !== auth.user.id) {
      return response.forbidden(Notify.error('You cannot accept this friend request', {}));
    }

    incomingConnection.accepted = true;

    if (await incomingConnection.save()
      && await UserConnection.create({
        user_id: auth.user.id,
        friend_id: incomingConnection.user_id,
        accepted: true
      })
        .returning('id')) {
      return response.json(Notify.success('Friend aquired!', {}));
    }

    return response.status(500).json(Notify.error('Couldn`t accept a friend request', {}));
  }

  async decline({ params, response, auth }) {
    const { id } = params; // friend request id

    if (!id) {
      return response.notFound().json(Notify.error('Something went wrong. Request id not found', {}));
    }

    if (await UserConnection.query()
      .where('id', id)
      .delete()) {
      return response.json(Notify.success('Friend declined!', {}));
    }

    return response.status(500).json(Notify.error('Couldn`t decline a friend request', {}));
  }

  async send({ params, response, auth }) {
    const { id } = params;

    const friendRequest = await UserConnection.create({
      user_id: auth.user.id,
      friend_id: id,
    });

    if (!friendRequest) {
      return response.status(500).json(Notify.error('Couldn`t create a friend request', {}));
    }

    return response.json(Notify.success('Successfully created a friend request', { friendRequest }));
  }
}

module.exports = UserConnectionsController;
