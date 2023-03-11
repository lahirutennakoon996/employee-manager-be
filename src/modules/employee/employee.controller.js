const employeeService = require('./employee.service');
const { successWithData, customError, successWithMessage } = require('../../services/response.service');

/**
 * Create new employee
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
module.exports.createEmployee = async (req, res) => {
  try {
    const data = await employeeService.createEmployee(req.body);
    return successWithData(data, res);
  } catch (error) {
    return customError(`${error}`, res);
  }
};

/**
 * Get employees with pagination, filters, search, sort
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
module.exports.getEmployees = async (req, res) => {
  try {
    const data = await employeeService.getEmployees(req.query);
    return successWithData(data, res);
  } catch (error) {
    return customError(`${error}`, res);
  }
};

/**
 * Update employee
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
module.exports.updateEmployee = async (req, res) => {
  try {
    const data = await employeeService.updateEmployee({
      id: req.params.id,
      ...req.body
    });
    return successWithData(data, res);
  } catch (error) {
    return customError(`${error}`, res);
  }
};

/**
 * Delete employee
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
module.exports.deleteEmployee = async (req, res) => {
  try {
    await employeeService.deleteEmployee(req.params.id);
    return successWithMessage("Delete success.", res);
  } catch (error) {
    return customError(`${error}`, res);
  }
};