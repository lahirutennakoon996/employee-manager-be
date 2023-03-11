const { pathOr } = require("ramda");

const EmployeeModel = require('./employee.model');
const sortingConfig = require("../../config/sort.config");
const { save, findMany, findByAggregateQuery, updateOne, deleteOne } = require('../../services/repository.service');
const { setLimitToPositiveValue } = require("../../services/common.service");

/**
 * Create new employee
 * @param body
 * @returns {Promise<Mongoose.Document>}
 */
module.exports.createEmployee = async (body) => {
  const existingEmployee = await this.getEmployees({
    limit: 1,
    page: 1,
    email: body.email,
  });

  // If employee already exists
  if (existingEmployee.recordsFiltered > 0) {
    throw new Error('Email already exists.');
  }

  // Get employee details with maximum _id
  const maxEmployee = await this.getMaxId();

  // Create new employee
  let newEmployee = new EmployeeModel({
    _id: maxEmployee[0] ? maxEmployee[0]._id + 1 : 1,
    ...body,
  });

  return save(newEmployee);
};

/**
 * Get employee with the maximum _id
 * @returns {Promise<[]>}
 */
module.exports.getMaxId = async () => findMany(EmployeeModel, {}, {
  _id: 1,
  }, {
  sort: { _id: -1},
  limit: 1,
});

/**
 * Get employees with pagination, filters, search, sort
 * @param body
 * @returns {Promise<{employees: ([Mongoose.Document]), recordsFiltered: (number), recordsTotal: (number)}>}
 */
module.exports.getEmployees = async (body) => {
  const {
    limit,
    order,
    page,
    id,
    email,
    search
  } = body;
  const column = body.column || -1;
  const sortingOrder = order === sortingConfig.sortingOrder.descending || !order ? -1 : 1;
  const sortingColumn = sortingConfig.sortingColumn.employees[column];
  let matchQuery = {};
  let projectQuery = [];
  let recordsTotal;
  let employees;
  const sortQuery = {
    [sortingColumn]: sortingOrder,
    updated_at: -1,
  };

  if (id) {
    matchQuery = {
      _id: +id,
    };
  }

  if (email) {
    matchQuery = {
      ...matchQuery,
      email,
    };
  }

  const prePaginationQuery = [
    {
      $match: matchQuery,
    },
  ];

  recordsTotal = await findByAggregateQuery(EmployeeModel, [
    ...prePaginationQuery,
    { $count: "count" },
  ]);

  recordsTotal = pathOr(0, [0, "count"], recordsTotal);

  const pageLimit = setLimitToPositiveValue(limit, recordsTotal);

  const paginationQuery = [
    ...projectQuery,
    { $sort: sortQuery },
    { $skip: page ? pageLimit * (page - 1) : 0 },
    { $limit: +pageLimit || +recordsTotal },
  ];

  if (!search) {
    employees = await findByAggregateQuery(EmployeeModel, [
      ...prePaginationQuery,
      ...paginationQuery,
    ]);
  } else {
    const searchQuery = [
      ...prePaginationQuery,
      {
        $match: {
          $or: [
            { first_name: { $regex: search, $options: "i" } },
            { last_name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        },
      },
    ];

    const data = await findByAggregateQuery(EmployeeModel, [
      {
        $facet: {
          employees: [...searchQuery, ...paginationQuery],
          recordsTotal: [...searchQuery, { $count: "count" }],
        },
      },
    ]);

    employees = pathOr([], [0, "employees"], data);
    recordsTotal = pathOr(0, [0, "recordsTotal", 0, "count"], data);
  }

  const recordsFiltered = employees ? employees.length : 0;

  return {
    employees,
    recordsTotal,
    recordsFiltered,
  };
}

/**
 * Update employee
 * @param body
 * @returns {Promise<Mongoose.Document>}
 */
module.exports.updateEmployee = async (body) => {
  const { id, email } = body;

  const employeeIdFilter = await this.getEmployees({
    limit: 1,
    page: 1,
    id,
  });

  // If invalid id
  if (employeeIdFilter.recordsFiltered === 0) {
    throw new Error('Invalid employee id.');
  }
  
  // Check if updated email is already taken by another employee
  if (email) {
    const employeesEmailFilter = await this.getEmployees({
      limit: 1,
      page: 1,
      email,
    });
    
    if (employeesEmailFilter.recordsFiltered > 0 && +employeesEmailFilter.employees?.[0]?._id !== +id) {
      throw new Error('Email is already taken.');
    }
  }

  return await updateOne(EmployeeModel, {
    _id: id,
  }, body, {
    new: true,
  });
}

/**
 * Delete employee
 * @param employeeId
 * @returns {Promise<Mongoose.Document>}
 */
module.exports.deleteEmployee = async (employeeId) => {
  const employee = await deleteOne(EmployeeModel, {
    _id: employeeId,
  });

  if (!employee) {
    throw new Error('Invalid employee id.');
  }
}