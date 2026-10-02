const mongoose = require("mongoose")

const contractSchema =
  new mongoose.Schema(
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null,
      },

      partyName: {
        type: String,
        required: true,
      },

      contractType: {
        type: String,
        enum: [
          "Employee",
          "Client",
        ],
        required: true,
      },

      startDate: {
        type: String,
        required: true,
      },

      endDate: {
        type: String,
        required: true,
      },

      value: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Active",
          "Expired",
          "Pending",
        ],
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )

const Contract =
  mongoose.model(
    "Contract",
    contractSchema
  )

module.exports = Contract