/* Contract schema */

const mongoose = require("mongoose")

const contractSchema = new mongoose.Schema({
  partyName: String,

  contractType: {
    type: String,
    enum: ["Employee", "Client"],
  },

  startDate: String,
  endDate: String,
  value: Number,

  status: {
    type: String,
    enum: ["Active", "Expired", "Pending"],
  },
})

const Contract = mongoose.model(
  "Contract",
  contractSchema
)

module.exports = Contract