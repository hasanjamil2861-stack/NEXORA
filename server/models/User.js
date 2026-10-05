const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: String,

    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["Admin", "Employee"],
        default: "Employee",
    },
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }

    const salt =
        await bcrypt.genSalt(10)

    this.password =
        await bcrypt.hash(
            this.password,
            salt
        )
})

const User =
    mongoose.model(
        "User",
        userSchema
    )

module.exports = User