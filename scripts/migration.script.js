const { createDBConnection } = require("../src/services/db-connection.service");
const {insertMany} = require('../src/services/repository.service');
const EmployeeModel = require('../src/modules/employee/employee.model');
const initialData = require('../data/employees.json');

createDBConnection();

const populateInitialData = async () => {
  try {
    // Format json data to match database schema
    const employees = initialData.map((obj) => {
      return {
        _id: obj.id,
        first_name: obj.first_name,
        last_name: obj.last_name,
        email: obj.email,
        phone: obj.number,
        gender: obj.gender,
        photo: obj.photo,
      }
    });

    // Insert all to db
    await insertMany(EmployeeModel, employees);
  }
  catch (error) {
    console.error(error);
  }
}

populateInitialData();