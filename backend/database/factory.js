'use strict';

const Factory = use('Factory');

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

Factory.blueprint('App/Models/User', async (faker) => ({
  first_name: faker.first(),
  last_name: faker.last(),
  email: faker.email(),
  password: '123qqq',
  avatar: faker.avatar({ protocol: 'https', fileExtension: 'jpg' }),
  facebook_payload: {},
  data: {}
}));
