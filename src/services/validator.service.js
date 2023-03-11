const response = require('./response.service');

/**
 * Validate http request parameters according to the defined schema
 * @param requestParametersType
 * @param schema
 * @returns {Function}
 */
module.exports.validateRequestParameters = function (requestParametersType, schema) {
  return (req, res, next) => {
    const result = schema.validate(req[requestParametersType]);

    if (result.error) {
      return response.customError(result.error.details[0].message, res);
    }
    next();
  };
};
