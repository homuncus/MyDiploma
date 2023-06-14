'use strict';

const Message = use('App/Models/Message');
const Database = use('Database');

const Notify = use('ADM/Notify');

class MessageController {
  async save({ params, request, response, auth }) {
    const input = request.all();
    const { userId, id } = params;

    let message = {};

    if (!input.id && !id) {
      message = new Message();
      const authUser = await auth.authenticator('jwt').getUser();
      message.receiever_id = userId;
      message.sender_id = authUser.id;
    } else {
      message = await Message.find(input.id || id);
      if (!message) {
        return response.notFound(Notify.error('Message not found', {}));
      }
    }

    message.merge(input);

    if (!await message.save()) {
      return response.status(500).json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }
}

module.exports = MessageController;
