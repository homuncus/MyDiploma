const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const User = use('Users/Models/User');
const Production = use('Productions/Models/Production');
const Message = use('Reports/Models/Message');

class UsersController {
  async index({ view, auth, __ }) {
    const table = new TableBuilder('users');

    table.setName(__('Users.users.list'));

    if (auth.user.managerCan('users_create')) {
      table.setButtons([
        [`<a href="${Route.url('Users.users.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Users.users.username'), width: '' },
      { title: __('Users.users.email'), width: '' },
      { title: __('Users.users.created_at'), width: '10%' },
      { title: __('Users.users.updated_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Users.users.users'), url: Route.url('Users.users.index') },
    ]);

    return view.render('Users.users.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('users.id', 'users.username', 'users.email', 'users.created_at', 'users.updated_at')
      .from('users');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async scrollList({ request, response }) {
    const { search } = request.all();
    const limit = 8;
    let usersQuery = Database
      .select('users.id', 'users.username', 'users.email', 'users.created_at', 'users.updated_at')
      .from('users')
      .limit(limit);

    if (search) usersQuery = usersQuery.whereRaw('username LIKE ?', `%${search.toLowerCase()}%`);

    return response.json(await usersQuery);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await User.find(id);

    if (id && !data) {
      return response.notFound(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('Users.users.edit') : __('Users.users.create'),
        content: View.render('Users.users.form', { data }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ params, request, response }) {
    const { confirmPassword, ...input } = request.all();

    let user = {};

    if (!input.id && !params.id) {
      user = new User();
      if (input.password !== confirmPassword) {
        return response.status(400).json(Notify.error('Password confirmation failed'));
      }
    } else {
      user = await User.find(input.id || params.id);
      if (!user) {
        return response.notFound(Notify.error('User not found', {}));
      }
    }

    if (input.blocked && !user.deleted_at) {
      user.deleted_at = Date.now();
    } else if (!input.blocked && user.deleted_at) {
      user.deleted_at = null;
    }

    user.merge(input);

    if (!await user.save()) {
      return response.json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }

  async show({ request, response, params }) {
    const { id } = params;
    const user = await User.find(id);

    if (!user) {
      return response.notFound(Notify.error('User not found', {}));
    }

    return response.json(user.toJSON());
  }

  async findBy({ request, response, params }) {
    const { attr } = params;
    const { value } = request.all();

    const user = await User.findBy(attr, value);

    if (!user) {
      return response.notFound(Notify.error('User not found', {}));
    }

    return response.json(user.toJSON());
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const user = await User.find(id);

    if (!user) {
      return response.notFound().json(Notify.error('Something went wrong. user not found', {}));
    }

    if (await user.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }

  async friends({ params, response }) {
    const { id } = params;
    const user = await User.find(id);

    if (!user) {
      return response.notFound(Notify.error('Something went wrong. user not found', {}));
    }

    const friends = await user.friends().fetch();
    return response.json(friends);
  }

  async productions({ params, request, response, auth }) {
    const { completed } = request.all();
    const authUser = await auth.authenticator('jwt').getUser();

    let productions = Production.query()
      .with('netting.type')
      .with('chief')
      .with('material')
      .with('workshop')
      .with('users')
      .where('user_id', authUser.id)
      .orWhere((query) => {
        query.whereHas('users', (builder) => {
          builder.where('user_id', authUser.id);
        });
      })
      .orderBy('created_at', 'asc');

    if (completed !== undefined) {
      productions = productions.andWhere('completed', completed);
    }

    return response.json((await productions.fetch()).toJSON());
  }

  async messages({ params, response, auth }) {
    const { userId } = params;
    const authUser = await auth.authenticator('jwt').getUser();

    const messages = (await authUser.messagesWith(userId)).sort((a, b) => a < b);

    return response.json(messages);
  }

  async chats({ request, response, auth }) {
    const { limit, offset, search } = request.all();
    const authUser = await auth.authenticator('jwt').getUser();

    const conversations = await authUser.conversations();

    return response.json(conversations);
  }

}

module.exports = UsersController;
