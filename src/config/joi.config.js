const joi = require('joi');

const sortConfig = require('./sort.config');

module.exports.id = joi.object().keys({
  id: joi.number().integer().min(1).required(),
});

module.exports.pagination = {
  limit: joi.number().integer().min(0).required(),
  page: joi.number().integer().min(1).required(),
  column: joi.number().integer().min(-1),
  order: joi.string().valid(sortConfig.sortingOrder.ascending, sortConfig.sortingOrder.descending, ''),
  search: joi.string().allow(''),
};

module.exports.paginationSchema = joi.object().keys({
  ...this.pagination,
});
