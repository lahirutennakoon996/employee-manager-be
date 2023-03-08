const employeeService = require('./employee.service');
const {successWithData, customError} = require('../../services/response.service');

/**
 * Create new employee
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
module.exports.createEmployee = async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    return successWithData(employee, res);
  } catch (error) {
    return customError(`${error}`, res);
  }
};