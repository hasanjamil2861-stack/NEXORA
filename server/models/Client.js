const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema({
  companyName: String,
  contactPerson: String,
  email: String,
  phone: String,
  address: String,

  status: {
    type: String,
    enum: ["Active", "Inactive"],
  },
})

const Client = mongoose.model(
  "Client",
  clientSchema
)

module.exports = Client