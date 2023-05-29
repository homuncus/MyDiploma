const Role = use('Managers/Models/AdminRole');
const Permission = use('Managers/Models/AdminPermission');

const Notify = use('ADM/Notify');

class SaveRole {
  get validateAll() {
    return false;
  }

  get sanitizationRules() {
    return {
      description: 'trim|strip_tags|to_null'
    };
  }

  get rules() {
    const id = this.ctx.request.input('id', '');

    return {
      name: `required|min:3|max:255|regex:^[a-zA-Z0-9_-]+$|unique:${Role.table},name,id,${id}`,
      slug: `required|min:3|max:255|regex:^[a-zA-Z0-9_-]+$|unique:${Role.table},slug,id,${id}`,
      description: 'min:3|max:1000',
      permissions: 'array',
      'permissions.*': `exists:${Permission.table},slug`,
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.json(Notify.error(errorMessages[0].message));
  }
}

module.exports = SaveRole;
