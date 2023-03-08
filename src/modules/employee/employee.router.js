const express = require('express');

const { validateBody } = require('../../services/validator.service');
const employeeController = require('./employee.controller');
const employeeSchema = require('./employee.schema');
const { permissions } = require('./employee.permission');

const router = express.Router();

router
  .route(permissions.createEmployee.path)
  .post(
    validateBody(employeeSchema.createEmployee),
    employeeController.createEmployee,
  );

module.exports = router;
