const bodyParser = require('body-parser');
const router = require('express').Router();

router.use(bodyParser.json({ limit: '50mb' }));

router.use('/employee', require('./src/modules/employee/employee.router'));

module.exports = router;
