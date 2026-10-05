const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            sparse: true,
        },

        firstName: {
            type: String,
            trim: true,
        },

        lastName: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        position: {
            type: String,
            trim: true,
        },

        departmentId: {
            type: Number,
        },

        salary: {
            type: Number,
            min: 0,
        },

        hireDate: {
            type: String,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },

        profileImage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
)

const Employee = mongoose.model(
    "Employee",
    employeeSchema
)

module.exports = Employee