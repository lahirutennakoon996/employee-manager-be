const mongoose = require('mongoose');

const employeeConfig = require('../../config/employee.config');

const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: Object.values(employeeConfig.gender),
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at,'
    },
  },
);

module.exports = mongoose.model('employee', employeeSchema);
