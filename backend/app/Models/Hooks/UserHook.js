'use strict';

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

// eslint-disable-next-line no-multi-assign
const UserHook = exports = module.exports = {};

UserHook.hashPassword = async (user) => {
  if (user.dirty.password) {
    Object.assign(user, { password: await Hash.make(user.password) });
  }
};
