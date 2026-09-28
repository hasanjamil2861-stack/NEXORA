const Contract = require("../models/Contract")

// Get all contracts
const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find()

    res.json(contracts)
  } catch (error) {
    console.error("Get contracts error:", error)

    res.status(500).json({
      message: "Failed to get contracts",
      error: error.message,
    })
  }
}

// Create a contract
const postContract = async (req, res) => {
  try {
    const newContract = new Contract(req.body)

    await newContract.save()

    res.status(201).json(newContract)
  } catch (error) {
    console.error("Save contract error:", error)

    res.status(500).json({
      message: "Failed to save contract",
      error: error.message,
    })
  }
}

// Update a contract
const updateContract = async (req, res) => {
  try {
    const updatedContract =
      await Contract.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )

    res.json(updatedContract)
  } catch (error) {
    console.error("Update contract error:", error)

    res.status(500).json({
      message: "Failed to update contract",
      error: error.message,
    })
  }
}

// Delete a contract
const deleteContract = async (req, res) => {
  try {
    const deletedContract =
      await Contract.findByIdAndDelete(
        req.params.id
      )

    res.json(deletedContract)
  } catch (error) {
    console.error("Delete contract error:", error)

    res.status(500).json({
      message: "Failed to delete contract",
      error: error.message,
    })
  }
}

module.exports = {
  getContracts,
  postContract,
  updateContract,
  deleteContract,
}