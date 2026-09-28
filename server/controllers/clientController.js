const Client = require("../models/Client")

// Get all clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find()

    res.json(clients)
  } catch (error) {
    console.error("Get clients error:", error)

    res.status(500).json({
      message: "Failed to get clients",
      error: error.message,
    })
  }
}

// Create a client
const postClient = async (req, res) => {
  try {
    const newClient = new Client(req.body)

    await newClient.save()

    res.status(201).json(newClient)
  } catch (error) {
    console.error("Save client error:", error)

    res.status(500).json({
      message: "Failed to save client",
      error: error.message,
    })
  }
}

// Update a client
const updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedClient)
  } catch (error) {
    console.error("Update client error:", error)

    res.status(500).json({
      message: "Failed to update client",
      error: error.message,
    })
  }
}

// Delete a client
const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(
      req.params.id
    )

    res.json(deletedClient)
  } catch (error) {
    console.error("Delete client error:", error)

    res.status(500).json({
      message: "Failed to delete client",
      error: error.message,
    })
  }
}

module.exports = {
  getClients,
  postClient,
  updateClient,
  deleteClient,
}