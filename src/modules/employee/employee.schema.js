const joi = require('joi');

const employeeConfig = require('../../config/employee.config');

const {male, female} = employeeConfig.gender;

module.exports.createEmployee = joi.object().keys({
  first_name: joi.string().min(6).max(10).required(),
  last_name: joi.string().min(6).max(10).required(),
  email: joi.string().email().required(),
  phone: joi.string().length(12).required(),
  gender: joi.string().valid(male, female).required(),
});