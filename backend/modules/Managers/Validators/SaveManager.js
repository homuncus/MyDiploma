const Manager = use('Managers/Models/Manager');
const Role = use('Managers/Models/AdminRole');

const Notify = use('ADM/Notify');

class SaveManager {
  get validateAll() {
    return false;
  }

  get sanitizationRules() {
    return {
      email: 'trim',
      password: 'trim',
      blocked: 'toBoolean',
    };
  }

  get rules() {
    const id = this.ctx.request.input('id', '');

    return {
      email: `required|email|unique:${Manager.table},email,id,${id}`,
      password: 'required_when:id,null|min:6|max:60',
      blocked: 'boolean',
      repassword: 'required_if:password|same:password',
      roles: 'array',
      'roles.*': `exists:${Role.table},id`,
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.json(Notify.error(errorMessages[0].message));
  }
}

module.exports = SaveManager;
