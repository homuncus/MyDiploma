const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const View = use('View');
  const Config = use('Config');
  const Database = use('Database');
  const Validator = use('Validator');
  const Env = use('Env');

  View.global('config', (key, def) => Config.get(key, def));
  View.global('env', (key) => Env.get(key));
  View.global('currentYear', new Date().getFullYear());

  const existsFn = async (data, field, message, args, get) => {
    const value = get(data, field);
    if (!value) return;

    const [table, column] = args;
    const row = await Database.table(table).where(column, value).first();

    if (!row) {
      throw message;
    }
  };

  const notExistsFn = async (data, field, message, args, get) => {
    const value = get(data, field);
    if (!value) return;

    const [table, column] = args;
    const row = await Database.table(table).where(column, value).first();
    if (row !== undefined) {
      throw message;
    }
  };

  const fileMaxSize = async (data, field, message, args, get) => {
    const value = get(data, field);
    if (!value) return;

    const [size] = args;
    const maxSize = parseInt(size.replace('mb', ''), 10);
    const fileSize = value.size / 1e6;

    if (fileSize > maxSize) {
      throw `${message}, max:${size}, file:${fileSize.toFixed(2)}mb`;
    }
  };

  Validator.extend('fileMaxSize', fileMaxSize);
  Validator.extend('exists', existsFn);
  Validator.extend('notExists', notExistsFn);
});
