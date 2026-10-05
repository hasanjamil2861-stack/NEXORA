const mongoose = require("mongoose")

const departmentSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true,
            sparse: true,
        },

        name: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        manager: {
            type: String,
            trim: true,
        },

        employeeCount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
        },
    },
    {
        timestamps: true,
    }
)

const Department = mongoose.model(
    "Department",
    departmentSchema
)

module.exports = Department