const response = require('./response.service');

/**
 * Validate API request body according to the defined schema
 * @param schema
 * @returns {Function}
 */
module.exports.validateBody = function (schema) {
  return (req, res, next) => {
    const result = schema.validate(req.body);

    if (result.error) {
      return response.customError(result.error.details[0].message, res);
    }
    next();
  };
};
