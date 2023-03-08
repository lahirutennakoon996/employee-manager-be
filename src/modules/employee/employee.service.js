const EmployeeModel = require('./employee.model');
const repository = require('../../services/repository.service');

/**
 * Create new employee
 * @param body
 * @returns {Promise<*>}
 */
module.exports.createEmployee = async (body) => {
  const existingEmployee = await this.getEmployeeByEmail(body.email);

  // If employee already exists
  if (existingEmployee) {
    throw new Error('Email already exists.');
  }

  // Create new employee
  let newEmployee = new EmployeeModel(body);
  return repository.save(newEmployee);
};

/**
 * Get employee by email
 * @param email
 * @returns {Promise<*>}
 */
module.exports.getEmployeeByEmail = async (email) => repository.findOne(EmployeeModel, {
  email,
});