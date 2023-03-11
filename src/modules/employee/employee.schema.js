const joi = require('joi');

const employeeConfig = require('../../config/employee.config');

const {male, female} = employeeConfig.gender;

const employeeRequestSchema = {
  first_name: joi.string().min(6).max(10),
  last_name: joi.string().min(6).max(10),
  email: joi.string().email(),
  phone: joi.string().length(12),
  gender: joi.string().valid(male, female)
};

module.exports.createEmployee = joi.object().keys({
  first_name: employeeRequestSchema.first_name.required(),
  last_name: employeeRequestSchema.last_name.required(),
  email: employeeRequestSchema.email.required(),
  phone: employeeRequestSchema.phone.required(),
  gender:  employeeRequestSchema.gender.required(),
});

module.exports.updateEmployee = joi.object().keys(employeeRequestSchema);
