/**
 * Save new object
 * @param body
 * @returns {Promise<any>}
 */
module.exports.save = async (body) => {
  return body.save();
};

/**
 * insert many objects
 * @param model
 * @param body
 * @returns {Promise<unknown>}
 */
module.exports.insertMany = async (model, body) => {
  return model.insertMany(body);
}

/**
 * Find one object
 * @param model
 * @param query
 * @param projection
 * @returns {Promise<any>}
 */
module.exports.findOne = async (model, query, projection) => {
  return model.findOne(query, projection);
}

/**
 * Find many objects
 * @param model
 * @param query
 * @param projection
 * @param options
 * @returns {Promise<[]>}
 */
module.exports.findMany = async (model, query, projection, options) => {
  return model.find(query, projection, options);
}

/**
 * Find objects by aggregate query
 * @param model
 * @param query
 * @returns {Promise<unknown>}
 */
module.exports.findByAggregateQuery = async (model, query) => {
  return model
    .aggregate(query)
    .allowDiskUse(true)
};

/**
 * Update one object
 * @param model
 * @param query
 * @param body
 * @param options
 * @returns {Promise<unknown>}
 */
module.exports.updateOne = async (model, query, body, options) => {
  return model.findOneAndUpdate(query, body, options);
}

/**
 * Delete single object
 * @param {*} model
 * @param {*} query
 * @returns
 */
module.exports.deleteOne = async (model, query) => {
  return model.findOneAndDelete(query);
}