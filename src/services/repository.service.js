/**
 * Save new object
 * @param body
 * @returns {Promise<any>}
 */
module.exports.save = async (body) => {
  return await body.save();
};

/**
 * Find one object
 * @param model
 * @param query
 * @param projection
 * @returns {Promise<any>}
 */
module.exports.findOne = (model, query, projection) => new Promise((resolve, reject) => {
  model
    .findOne(query, projection)
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Find many objects
 * @param model
 * @param query
 * @param projection
 * @param options
 * @returns {Promise<[]>}
 */
module.exports.findMany = (model, query, projection, options) => new Promise((resolve, reject) => {
  model
    .find(query, projection, options)
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Update one object
 * @param model
 * @param query
 * @param body
 * @param options
 * @returns {Promise<unknown>}
 */
module.exports.updateOne = (model, query, body, options) => new Promise((resolve, reject) => {
  model
    .findOneAndUpdate(query, body, options)
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject(err);
    });
});
