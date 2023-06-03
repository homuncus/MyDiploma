'use strict'

const _ = require('lodash')
const slugify = require('slugify').default;

// eslint-disable-next-line no-multi-assign
const SlugifyHook = exports = module.exports = {};

SlugifyHook.Slugify = async (modelInstance) => {
  // eslint-disable-next-line no-param-reassign
  modelInstance.slug = slugify(modelInstance.name, { lower: true });
};
