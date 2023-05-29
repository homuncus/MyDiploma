const Notify = use('ADM/Notify');

class Signup {
  get validateAll() {
    return false;
  }

  get rules() {
    return {
      username: 'required|min:4|max:36',
      email: 'required|min:5|max:255',
      password: 'required|min:6|max:60',
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(Notify.error(errorMessages[0].message));
  }
}

module.exports = Signup;
