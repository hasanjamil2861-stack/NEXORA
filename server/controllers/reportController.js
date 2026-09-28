const Employee = require("../models/Employee")
const Client = require("../models/Client")
const Project = require("../models/Project")
const Task = require("../models/Task")
const LeaveRequest = require("../models/LeaveRequest")
const Contract = require("../models/Contract")
const Invoice = require("../models/Invoice")

// Get report overview
const getReportOverview = async (req, res) => {
  try {
    // Fetch all report data in parallel
    const [
      employees,
      clients,
      projects,
      tasks,
      leaveRequests,
      contracts,
      invoices,
    ] = await Promise.all([
      Employee.find(),
      Client.find(),
      Project.find(),
      Task.find(),
      LeaveRequest.find(),
      Contract.find(),
      Invoice.find(),
    ])

    // Basic totals
    const totalEmployees = employees.length
    const totalClients = clients.length
    const totalProjects = projects.length
    const totalTasks = tasks.length
    const totalLeaveRequests = leaveRequests.length
    const totalContracts = contracts.length
    const totalInvoices = invoices.length

    // Leave request metrics
    const pendingLeaveRequests =
      leaveRequests.filter(
        (leave) => leave.status === "Pending"
      ).length

    // Contract metrics
    const activeContracts =
      contracts.filter(
        (contract) => contract.status === "Active"
      ).length

    // Invoice metrics
    const paidInvoices =
      invoices.filter(
        (invoice) => invoice.status === "Paid"
      ).length

    const pendingInvoices =
      invoices.filter(
        (invoice) => invoice.status === "Pending"
      ).length

    const overdueInvoices =
      invoices.filter(
        (invoice) => invoice.status === "Overdue"
      ).length

    // Task metrics
    const completedTasks =
      tasks.filter(
        (task) => task.status === "Completed"
      ).length

    const inProgressTasks =
      tasks.filter(
        (task) => task.status === "In Progress"
      ).length

    const pendingTasks =
      tasks.filter(
        (task) => task.status === "Pending"
      ).length

    // Project metrics
    const completedProjects =
      projects.filter(
        (project) => project.status === "Completed"
      ).length

    // Calculate rates
    const taskCompletionRate =
      totalTasks > 0
        ? Math.round(
            (completedTasks / totalTasks) * 100
          )
        : 0

    const invoiceCollectionRate =
      totalInvoices > 0
        ? Math.round(
            (paidInvoices / totalInvoices) * 100
          )
        : 0

    const activeContractRate =
      totalContracts > 0
        ? Math.round(
            (activeContracts / totalContracts) * 100
          )
        : 0

    const projectDeliveryRate =
      totalProjects > 0
        ? Math.round(
            (completedProjects / totalProjects) * 100
          )
        : 0

    // Return report data
    res.json({
      employees: {
        total: totalEmployees,
      },

      clients: {
        total: totalClients,
      },

      projects: {
        total: totalProjects,
        completed: completedProjects,
        deliveryRate: projectDeliveryRate,
      },

      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: pendingTasks,
        completionRate: taskCompletionRate,
      },

      leaveRequests: {
        total: totalLeaveRequests,
        pending: pendingLeaveRequests,
      },

      contracts: {
        total: totalContracts,
        active: activeContracts,
        activeRate: activeContractRate,
      },

      invoices: {
        total: totalInvoices,
        paid: paidInvoices,
        pending: pendingInvoices,
        overdue: overdueInvoices,
        collectionRate: invoiceCollectionRate,
      },
    })
  } catch (error) {
    console.error(
      "Get report overview error:",
      error
    )

    res.status(500).json({
      message: "Failed to get report overview",
      error: error.message,
    })
  }
}

module.exports = {
  getReportOverview,
}