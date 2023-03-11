const express = require('express');

const config = require('../../config/config');
const joiConfig = require('../../config/joi.config');
const { validateRequestParameters } = require('../../services/validator.service');
const controller = require('./employee.controller');
const schema = require('./employee.schema');
const { permissions } = require('./employee.permission');

const router = express.Router();
const { requestParameter } = config;

router
  .route(permissions.createEmployee.path)
  .post(
    validateRequestParameters(requestParameter.body, schema.createEmployee),
    controller.createEmployee,
  );

router
  .route(permissions.getEmployees.path)
  .get(
    validateRequestParameters(requestParameter.query, joiConfig.paginationSchema),
    controller.getEmployees,
  );

router
  .route(permissions.updateEmployee.path)
  .put(
    validateRequestParameters(requestParameter.params, joiConfig.id),
    validateRequestParameters(requestParameter.body, schema.updateEmployee),
    controller.updateEmployee,
  );

router
  .route(permissions.deleteEmployee.path)
  .delete(
    validateRequestParameters(requestParameter.params, joiConfig.id),
    controller.deleteEmployee,
  );

module.exports = router;
