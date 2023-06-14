const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const User = use('Users/Models/User');
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

  async save({ request, response }) {
    const { confirmPassword, ...input } = request.all();

    let user = {};

    if (!input.id) {
      user = new User();
    } else {
      user = await User.find(input.id);
      if (!user) {
        return response.notFound(Notify.error('User not found', {}));
      }
    }

    if (input.password !== confirmPassword) {
      return response.status(400).json(Notify.error('Password confirmation failed'));
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

  async productions({ params, response }) {
    const { id } = params;
    const user = await User.find(id);

    if (!user) {
      return response.notFound(Notify.error('Something went wrong. user not found', {}));
    }

    const productions = {
      chief: await user.productions().whereChief().fetch(),
      member: await user.productions().whereMember().fetch()
    };
    return response.json(productions);
  }

  async messages({ params, response, auth }) {
    const { id, userId } = params;
    const authUser = await auth.authenticator('jwt').getUser();
    if (id !== authUser.id) return response.forbidden(Notify.error('No access'));
    const user = await User.find(id);

    const messages = await user.messagesWith(userId).fetch();

    return response.json(messages.toJSON());
  }

  async chats({ params, request, response, auth }) {
    const { id } = params;
    const { limit, offset, search } = request.all();
    const authUser = await auth.authenticator('jwt').getUser();

    if (id !== authUser.id) return response.forbidden(Notify.error('No access'));

    const conversations = await Message.query()
      .select('receiver_id', 'sender_id')
      .select(Database.raw('MAX(id) AS last_message_id'))
      .where('receiver_id', id)
      .orWhere('sender_id', id)
      .groupBy('receiver_id', 'sender_id')
      .havingRaw('count(*) > 0')
      .with('interlocutor', (builder) => {
        builder.where('users.id', '!=', id);
      })
      .with('lastMessage', (builder) => {
        builder.whereRaw('messages.id = last_message_id');
      })
      .fetch();

    const chats = conversations.toJSON().map((conversation) => {
      const { interlocutor, last_message: lastMessage } = conversation;
      console.log(conversation);
      return {
        id: interlocutor.id,
        interlocutor,
        lastMessage,
      };
    });

    return response.json(chats);
  }
}

module.exports = UsersController;
