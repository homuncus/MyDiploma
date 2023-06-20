const UserProduction = use('Productions/Models/UserProduction');
const Notify = use('ADM/Notify');

class UserProductionsController {
  async save({ params, response, auth }) {
    const { id } = params;
    const authUser = await auth.authenticator('jwt').getUser();

    const connection = await UserProduction.create({
      user_id: authUser.id,
      workshop_id: id
    });

    if (!connection) {
      return response.status(500).json(Notify.error('Not saved'));
    }

    return response.json(Notify.success('Saved'));
  }
}

module.exports = UserProductionsController;