import { useEffect, useState } from "react"

import {
  Users,
  UserRoundCheck,
  FolderKanban,
  ListTodo,
  CalendarDays,
  FileText,
  Receipt,
  TrendingUp,
  Activity,
  ArrowUpRight,
  CircleCheck,
  Clock3,
  CircleAlert,
  Briefcase,
  Target,
  BarChart3,
  PieChart,
  Gauge,
  Sparkles,
  Wallet,
  UserCheck,
} from "lucide-react"

import { getReportOverview } from "../../services/api/reportApi"

type ReportData = {
  employees: {
    total: number
  }

  clients: {
    total: number
  }

  projects: {
    total: number
    completed: number
    deliveryRate: number
  }

  tasks: {
    total: number
    completed: number
    inProgress: number
    pending: number
    completionRate: number
  }

  leaveRequests: {
    total: number
    pending: number
  }

  contracts: {
    total: number
    active: number
    activeRate: number
  }

  invoices: {
    total: number
    paid: number
    pending: number
    overdue: number
    collectionRate: number
  }
}

export default function Reports() {
  const [reportData, setReportData] =
    useState<ReportData | null>(null)

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const data: ReportData =
          await getReportOverview()

        console.log(
          "REPORT DATA:",
          data
        )

        setReportData(data)
      } catch (error) {
        console.log(
          "Reports fetch error:",
          error
        )
      }
    }

    fetchReportData()
  }, [])

  if (!reportData) {
    return (
      <main className="reports-page">
        Loading reports...
      </main>
    )
  }

  /* =========================================================
     BACKEND DATA
  ========================================================= */

  const totalEmployees =
    reportData.employees.total

  const totalClients =
    reportData.clients.total

  const totalProjects =
    reportData.projects.total

  const completedProjects =
    reportData.projects.completed

  const projectDeliveryRate =
    reportData.projects.deliveryRate

  const totalTasks =
    reportData.tasks.total

  const completedTasks =
    reportData.tasks.completed

  const inProgressTasks =
    reportData.tasks.inProgress

  const pendingTasks =
    reportData.tasks.pending

  const completedTaskPercentage =
    reportData.tasks.completionRate

  const totalLeaveRequests =
    reportData.leaveRequests.total

  const pendingLeaveRequests =
    reportData.leaveRequests.pending

  const activeContracts =
    reportData.contracts.active

  const activeContractRate =
    reportData.contracts.activeRate

  const totalInvoices =
    reportData.invoices.total

  const paidInvoices =
    reportData.invoices.paid

  const pendingInvoices =
    reportData.invoices.pending

  const overdueInvoices =
    reportData.invoices.overdue

  const paidInvoicePercentage =
    reportData.invoices.collectionRate

  /* =========================================================
     MAIN STATISTICS
  ========================================================= */

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      trend: "Current",
      trendText: "workforce total",
      className: "reports-blue",
    },
    {
      title: "Total Clients",
      value: totalClients,
      icon: UserRoundCheck,
      trend: "Current",
      trendText: "client portfolio",
      className: "reports-green",
    },
    {
      title: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      trend: `${projectDeliveryRate}%`,
      trendText: "delivery rate",
      className: "reports-purple",
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      trend: `${completedTaskPercentage}%`,
      trendText: "completion rate",
      className: "reports-orange",
    },
    {
      title: "Leave Requests",
      value: totalLeaveRequests,
      icon: CalendarDays,
      trend: `${pendingLeaveRequests} pending`,
      trendText: "awaiting review",
      className: "reports-cyan",
    },
    {
      title: "Active Contracts",
      value: activeContracts,
      icon: FileText,
      trend: `${activeContractRate}%`,
      trendText: "currently active",
      className: "reports-indigo",
    },
    {
      title: "Total Invoices",
      value: totalInvoices,
      icon: Receipt,
      trend: `${paidInvoices} paid`,
      trendText: `${paidInvoicePercentage}% collected`,
      className: "reports-rose",
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: TrendingUp,
      trend: `${completedTaskPercentage}%`,
      trendText: "completion rate",
      className: "reports-emerald",
    },
  ]

  /* =========================================================
     TASK PERCENTAGES
  ========================================================= */

  const inProgressTaskPercentage =
    totalTasks > 0
      ? Math.round(
          (inProgressTasks / totalTasks) * 100
        )
      : 0

  const pendingTaskPercentage =
    totalTasks > 0
      ? Math.round(
          (pendingTasks / totalTasks) * 100
        )
      : 0

  /* =========================================================
     PERFORMANCE DATA
  ========================================================= */

  const performanceData = [
    {
      title: "Active Contracts",
      value: activeContractRate,
      icon: FileText,
      description: "Active contract health",
      className: "performance-blue",
    },
    {
      title: "Project Delivery",
      value: projectDeliveryRate,
      icon: FolderKanban,
      description: "Project completion health",
      className: "performance-purple",
    },
    {
      title: "Task Completion",
      value: completedTaskPercentage,
      icon: ListTodo,
      description: "Overall execution rate",
      className: "performance-orange",
    },
    {
      title: "Invoice Collection",
      value: paidInvoicePercentage,
      icon: Receipt,
      description: "Financial collection health",
      className: "performance-green",
    },
  ]

  /* =========================================================
     BUSINESS HEALTH
  ========================================================= */

  const businessHealth = Math.round(
    (
      activeContractRate +
      projectDeliveryRate +
      completedTaskPercentage +
      paidInvoicePercentage
    ) / 4
  )

  return (
    <main className="reports-page">

      {/* =====================================================
          HERO HEADER
      ===================================================== */}

      <section className="reports-hero">

        <div className="reports-hero-background" />

        <div className="reports-hero-content">

          <div className="reports-eyebrow">
            <span className="reports-live-dot" />
            NEXORA BUSINESS INTELLIGENCE
          </div>

          <div className="reports-title-row">

            <div className="reports-title-icon">
              <BarChart3 size={31} />

              <span className="reports-title-status">
                <Activity size={11} />
              </span>
            </div>

            <div className="reports-title-content">

              <h1>
                Reports & Analytics
              </h1>

              <p>
                Monitor business performance, operational
                activity and financial health from one
                centralized dashboard.
              </p>

            </div>

          </div>

        </div>

        <div className="reports-hero-right">

          <div className="reports-health">

            <div className="reports-health-icon">
              <Gauge size={19} />
            </div>

            <div>
              <span>
                BUSINESS HEALTH
              </span>

              <strong>
                {businessHealth >= 70
                  ? "Strong Performance"
                  : businessHealth >= 50
                  ? "Moderate Performance"
                  : "Needs Attention"}
              </strong>
            </div>

            <div className="reports-health-score">
              {businessHealth}%
            </div>

          </div>

          <div className="reports-period">
            <Clock3 size={15} />
            <span>
              Current Overview
            </span>
          </div>

        </div>

      </section>

      {/* =====================================================
          KPI STATISTICS
      ===================================================== */}

      <section className="reports-stats">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <article
              className={`report-stat-card ${stat.className}`}
              key={stat.title}
            >

              <div className="report-stat-top">

                <div className="report-stat-icon">
                  <Icon size={21} />
                </div>

                <ArrowUpRight
                  size={17}
                  className="report-stat-arrow"
                />

              </div>

              <div className="report-stat-info">

                <p>
                  {stat.title}
                </p>

                <h2>
                  {stat.value}
                </h2>

                <div className="report-stat-trend">

                  <span>
                    {stat.trend}
                  </span>

                  <small>
                    {stat.trendText}
                  </small>

                </div>

              </div>

            </article>
          )
        })}

      </section>

      {/* =====================================================
          EXECUTIVE SUMMARY
      ===================================================== */}

      <section className="reports-summary-grid">

        <article className="reports-summary-card reports-summary-primary">

          <div className="reports-summary-decoration" />

          <div className="reports-summary-content">

            <div className="reports-summary-icon">
              <Sparkles size={20} />
            </div>

            <span>
              EXECUTIVE SUMMARY
            </span>

            <h2>
              Your business is operating at a healthy
              performance level.
            </h2>

            <p>
              Operations show solid employee activity,
              growing client engagement and a strong task
              completion rate.
            </p>

          </div>

          <div className="reports-summary-score">

            <strong>
              {businessHealth}%
            </strong>

            <span>
              Overall Health
            </span>

          </div>

        </article>

        <article className="reports-summary-card">

          <div className="reports-summary-small-header">

            <div className="reports-summary-small-icon">
              <Target size={18} />
            </div>

            <div>

              <span>
                EXECUTION
              </span>

              <h3>
                Task Progress
              </h3>

            </div>

          </div>

          <div className="reports-circle-progress">

            <div className="reports-circle-inner">

              <strong>
                {completedTaskPercentage}%
              </strong>

              <span>
                Complete
              </span>

            </div>

          </div>

          <div className="reports-mini-stats">

            <div>

              <strong>
                {completedTasks}
              </strong>

              <span>
                Completed
              </span>

            </div>

            <div>

              <strong>
                {inProgressTasks}
              </strong>

              <span>
                In Progress
              </span>

            </div>

            <div>

              <strong>
                {pendingTasks}
              </strong>

              <span>
                Pending
              </span>

            </div>

          </div>

        </article>

        <article className="reports-summary-card">

          <div className="reports-summary-small-header">

            <div className="reports-summary-small-icon reports-money-icon">
              <Wallet size={18} />
            </div>

            <div>

              <span>
                FINANCE
              </span>

              <h3>
                Invoice Collection
              </h3>

            </div>

          </div>

          <div className="reports-finance-score">

            <div className="reports-finance-value">

              <strong>
                {paidInvoicePercentage}%
              </strong>

              <span>
                Paid Invoices
              </span>

            </div>

            <div className="reports-finance-ring">
              <CircleCheck size={26} />
            </div>

          </div>

          <div className="reports-finance-list">

            <div>

              <span>
                <CircleCheck size={13} />
                Paid
              </span>

              <strong>
                {paidInvoices}
              </strong>

            </div>

            <div>

              <span>
                <Clock3 size={13} />
                Pending
              </span>

              <strong>
                {pendingInvoices}
              </strong>

            </div>

            <div>

              <span>
                <CircleAlert size={13} />
                Overdue
              </span>

              <strong>
                {overdueInvoices}
              </strong>

            </div>

          </div>

        </article>

      </section>

      {/* =====================================================
          TASK + FINANCIAL OVERVIEW
      ===================================================== */}

      <section className="reports-grid">

        {/* Task Overview */}

        <article className="report-panel">

          <div className="report-panel-header">

            <div className="report-panel-title">

              <div className="report-panel-icon reports-task-icon">
                <ListTodo size={18} />
              </div>

              <div>

                <h2>
                  Task Overview
                </h2>

                <p>
                  Current task distribution
                </p>

              </div>

            </div>

            <span className="report-panel-badge">
              Current
            </span>

          </div>

          <div className="task-overview">

            <div className="overview-item overview-completed">

              <div className="overview-item-top">

                <span>
                  <CircleCheck size={14} />
                  Completed
                </span>

                <strong>
                  {completedTasks}
                </strong>

              </div>

              <div className="overview-mini-bar">

                <span
                  style={{
                    width: `${completedTaskPercentage}%`,
                  }}
                />

              </div>

              <small>
                {completedTaskPercentage}% of all tasks
              </small>

            </div>

            <div className="overview-item overview-progress">

              <div className="overview-item-top">

                <span>
                  <Activity size={14} />
                  In Progress
                </span>

                <strong>
                  {inProgressTasks}
                </strong>

              </div>

              <div className="overview-mini-bar">

                <span
                  style={{
                    width: `${inProgressTaskPercentage}%`,
                  }}
                />

              </div>

              <small>
                {inProgressTaskPercentage}% of all tasks
              </small>

            </div>

            <div className="overview-item overview-pending">

              <div className="overview-item-top">

                <span>
                  <Clock3 size={14} />
                  Pending
                </span>

                <strong>
                  {pendingTasks}
                </strong>

              </div>

              <div className="overview-mini-bar">

                <span
                  style={{
                    width: `${pendingTaskPercentage}%`,
                  }}
                />

              </div>

              <small>
                {pendingTaskPercentage}% of all tasks
              </small>

            </div>

          </div>

        </article>

        {/* Financial Overview */}

        <article className="report-panel">

          <div className="report-panel-header">

            <div className="report-panel-title">

              <div className="report-panel-icon reports-finance-panel-icon">
                <Receipt size={18} />
              </div>

              <div>

                <h2>
                  Financial Overview
                </h2>

                <p>
                  Invoice status summary
                </p>

              </div>

            </div>

            <span className="report-panel-badge">
              Current
            </span>

          </div>

          <div className="financial-overview">

            <div className="financial-item">

              <div>

                <span>
                  <Receipt size={14} />
                  Total Invoices
                </span>

              </div>

              <strong>
                {totalInvoices}
              </strong>

            </div>

            <div className="financial-item financial-paid">

              <div>

                <span>
                  <CircleCheck size={14} />
                  Paid Invoices
                </span>

              </div>

              <strong>
                {paidInvoices}
              </strong>

            </div>

            <div className="financial-item financial-pending">

              <div>

                <span>
                  <Clock3 size={14} />
                  Pending Invoices
                </span>

              </div>

              <strong>
                {pendingInvoices}
              </strong>

            </div>

            <div className="financial-item financial-overdue">

              <div>

                <span>
                  <CircleAlert size={14} />
                  Overdue Invoices
                </span>

              </div>

              <strong>
                {overdueInvoices}
              </strong>

            </div>

          </div>

        </article>

      </section>

      {/* =====================================================
          BUSINESS PERFORMANCE
      ===================================================== */}

      <section className="report-panel report-performance">

        <div className="report-panel-header">

          <div className="report-panel-title">

            <div className="report-panel-icon reports-performance-icon">
              <TrendingUp size={18} />
            </div>

            <div>

              <h2>
                Business Performance
              </h2>

              <p>
                Overall performance indicators
              </p>

            </div>

          </div>

          <span className="report-panel-badge">
            Overview
          </span>

        </div>

        <div className="performance-list">

          {performanceData.map((item) => {
            const Icon = item.icon

            return (
              <div
                className={`performance-row ${item.className}`}
                key={item.title}
              >

                <div className="performance-label">

                  <div className="performance-icon">
                    <Icon size={16} />
                  </div>

                  <div>

                    <span>
                      {item.title}
                    </span>

                    <small>
                      {item.description}
                    </small>

                  </div>

                </div>

                <div className="performance-bar">

                  <div
                    className="performance-progress"
                    style={{
                      width: `${item.value}%`,
                    }}
                  />

                </div>

                <strong>
                  {item.value}%
                </strong>

              </div>
            )
          })}

        </div>

      </section>

      {/* =====================================================
          OPERATIONAL SNAPSHOT
      ===================================================== */}

      <section className="reports-bottom-grid">

        <article className="reports-insight-card">

          <div className="reports-insight-icon reports-insight-green">
            <UserCheck size={20} />
          </div>

          <div>

            <span>
              WORKFORCE
            </span>

            <h3>
              {totalEmployees} Employees
            </h3>

            <p>
              Your current workforce remains actively
              engaged across the organization.
            </p>

          </div>

          <ArrowUpRight size={17} />

        </article>

        <article className="reports-insight-card">

          <div className="reports-insight-icon reports-insight-purple">
            <Briefcase size={20} />
          </div>

          <div>

            <span>
              PROJECT PORTFOLIO
            </span>

            <h3>
              {totalProjects} Projects
            </h3>

            <p>
              {completedProjects} projects currently show
              completed status in the portfolio.
            </p>

          </div>

          <ArrowUpRight size={17} />

        </article>

        <article className="reports-insight-card">

          <div className="reports-insight-icon reports-insight-blue">
            <PieChart size={20} />
          </div>

          <div>

            <span>
              BUSINESS ACTIVITY
            </span>

            <h3>
              {businessHealth >= 70
                ? "Strong Activity"
                : businessHealth >= 50
                ? "Stable Activity"
                : "Needs Attention"}
            </h3>

            <p>
              Overall activity is calculated from current
              operational and financial metrics.
            </p>

          </div>

          <ArrowUpRight size={17}/>

        </article>

      </section>

    </main>
  )
}