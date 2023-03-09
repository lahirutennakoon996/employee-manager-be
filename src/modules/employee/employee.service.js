const { pathOr } = require("ramda");

const EmployeeModel = require('./employee.model');
const sortingConfig = require("../../config/sort.config");
const repository = require('../../services/repository.service');
const { setLimitToPositiveValue } = require("../../services/common.service");

/**
 * Create new employee
 * @param body
 * @returns {Promise<*>}
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

  return repository.save(newEmployee);
};

/**
 * Get employee with the maximum _id
 * @returns {Promise<[]>}
 */
module.exports.getMaxId = async () => repository.findMany(EmployeeModel, {}, {
  _id: 1,
  }, {
  sort: { _id: -1},
  limit: 1,
});

/**
 * Get all employees with pagination and filters
 * @param body
 * @returns {Promise<void>}
 */
module.exports.getEmployees = async (body) => {
  const {
    limit,
    order,
    page,
    _id: employeeId,
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

  if (employeeId) {
    matchQuery = {
      _id: +employeeId,
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

  recordsTotal = await repository.findByAggregateQuery(EmployeeModel, [
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
    employees = await repository.findByAggregateQuery(EmployeeModel, [
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

    const data = await repository.findByAggregateQuery(EmployeeModel, [
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