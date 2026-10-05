import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import {
  Users,
  UserCheck,
  Building2,
  FolderKanban,
  Clock3,
  CheckCircle,
  BarChart3,
  ClipboardList,
  BriefcaseBusiness,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CircleDot,
  Activity,
  LayoutDashboard,
} from "lucide-react"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts"

import type { Employee } from "../types/Employee"
import type { Department } from "../types/Department"
import type { Project } from "../types/Project"
import type { Task } from "../types/Task"

import { getEmployees } from "../services/api/employeeApi"
import { getDepartments } from "../services/api/departmentApi"
import { getProjects } from "../services/api/projectApi"
import { getTasks } from "../services/api/taskApi"

type EmployeeApiRecord =
  Omit<Employee, "id"> & {
    _id: string
  }

type DepartmentApiRecord =
  Omit<Department, "id"> & {
    _id: string
  }

type ProjectApiRecord =
  Omit<Project, "id"> & {
    _id: string
  }

type TaskApiRecord =
  Omit<Task, "id"> & {
    _id: string
  }

export default function Dashboard() {
  const location = useLocation()

  const [employees, setEmployees] =
    useState<Employee[]>([])

  const [departments, setDepartments] =
    useState<Department[]>([])

  const [projects, setProjects] =
    useState<Project[]>([])

  const [tasks, setTasks] =
    useState<Task[]>([])

  // Fetch dashboard data from the backend
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [
          employeesData,
          departmentsData,
          projectsData,
          tasksData,
        ] = await Promise.all([
          getEmployees(),
          getDepartments(),
          getProjects(),
          getTasks(),
        ])

        const formattedEmployees =
          employeesData.map(
            (employee: EmployeeApiRecord) => ({
              id: employee._id,
              firstName: employee.firstName,
              lastName: employee.lastName,
              email: employee.email,
              phone: employee.phone,
              position: employee.position,
              departmentId: employee.departmentId,
              salary: employee.salary,
              hireDate: employee.hireDate,
              status: employee.status,
            })
          )

        const formattedDepartments =
          departmentsData.map(
            (department: DepartmentApiRecord) => ({
              id: department._id,
              name: department.name,
              description: department.description,
              manager: department.manager,
              employeeCount:
                department.employeeCount,
              status: department.status,
            })
          )

        const formattedProjects =
          projectsData.map(
            (project: ProjectApiRecord) => ({
              id: project._id,
              name: project.name,
              description: project.description,
              client: project.client,
              manager: project.manager,
              startDate: project.startDate,
              endDate: project.endDate,
              budget: project.budget,
              status: project.status,
            })
          )

        const formattedTasks =
          tasksData.map(
            (task: TaskApiRecord) => ({
              id: task._id,
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              assignedTo: task.assignedTo,
              dueDate: task.dueDate,
            })
          )

        setEmployees(formattedEmployees)
        setDepartments(formattedDepartments)
        setProjects(formattedProjects)
        setTasks(formattedTasks)
      } catch (error) {
        console.error(
          "Fetch dashboard data error:",
          error
        )
      }
    }

    fetchDashboardData()
  }, [location.pathname])

  // Employee and project statistics
  const totalEmployees = employees.length

  const activeEmployees = employees.filter(
    (employee) =>
      employee.status === "Active"
  ).length

  const totalDepartments =
    departments.length

  const totalProjects = projects.length

  const projectsInProgress =
    projects.filter(
      (project) =>
        project.status === "In Progress"
    ).length

  const projectsCompleted =
    projects.filter(
      (project) =>
        project.status === "Completed"
    ).length

  const projectsCompletionRate =
    totalProjects > 0
      ? Math.round(
          (projectsCompleted /
            totalProjects) *
            100
        )
      : 0

  const projectsChartData = [
    {
      name: "In Progress",
      value: projectsInProgress,
      color: "#f59e0b",
    },
    {
      name: "Completed",
      value: projectsCompleted,
      color: "#2563eb",
    },
  ]

  // Task statistics
  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "Completed"
  ).length

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status === "In Progress"
  ).length

  const pendingTasks = tasks.filter(
    (task) =>
      task.status === "Pending"
  ).length

  const openTasks =
    inProgressTasks + pendingTasks

  const completedPercentage =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100
        )
      : 0

  const inProgressPercentage =
    totalTasks > 0
      ? Math.round(
          (inProgressTasks /
            totalTasks) *
            100
        )
      : 0

  const pendingPercentage =
    totalTasks > 0
      ? Math.round(
          (pendingTasks /
            totalTasks) *
            100
        )
      : 0

  const openTasksPercentage =
    totalTasks > 0
      ? Math.round(
          (openTasks /
            totalTasks) *
            100
        )
      : 0

  const taskStatusData = [
    {
      name: "Completed",
      value: completedTasks,
      color: "#2563eb",
    },
    {
      name: "In Progress",
      value: inProgressTasks,
      color: "#f59e0b",
    },
    {
      name: "Pending",
      value: pendingTasks,
      color: "#94a3b8",
    },
  ]

  return (
    <main className="dashboard-page">
      {/* Dashboard header */}
      <header className="dashboard-header">
        <div className="dashboard-header-main">
          <div className="dashboard-title-content">
            <span className="dashboard-eyebrow">
              BUSINESS MANAGEMENT
            </span>

            <div className="dashboard-title-row">
              <span className="dashboard-title-icon">
                <LayoutDashboard size={24} />
              </span>

              <div>
                <h1>Dashboard</h1>

                <p>
                  Monitor your business operations,
                  workforce, projects, and task
                  performance from one central
                  workspace.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-header-right">
          <div className="dashboard-header-summary">
            <div className="dashboard-summary-icon">
              <Activity size={19} />
            </div>

            <div>
              <span>Active Operations</span>

              <strong>
                {activeEmployees}
              </strong>

              <small>
                active employees
              </small>
            </div>
          </div>

          <div className="dashboard-live-badge">
            <CircleDot size={13} />

            <span>Live Overview</span>
          </div>
        </div>
      </header>

      {/* Main statistics */}
      <section className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon employees-icon">
            <Users size={21} />
          </div>

          <div className="dashboard-stat-content">
            <span>Total Employees</span>
            <h2>{totalEmployees}</h2>
            <p>Employees in the system</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon active-icon">
            <UserCheck size={21} />
          </div>

          <div className="dashboard-stat-content">
            <span>Active Employees</span>
            <h2>{activeEmployees}</h2>
            <p>Currently active</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon departments-icon">
            <Building2 size={21} />
          </div>

          <div className="dashboard-stat-content">
            <span>Total Departments</span>
            <h2>{totalDepartments}</h2>
            <p>Business departments</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon projects-icon">
            <FolderKanban size={21} />
          </div>

          <div className="dashboard-stat-content">
            <span>Total Projects</span>
            <h2>{totalProjects}</h2>
            <p>Registered projects</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon progress-icon">
            <Clock3 size={21} />
          </div>

          <div className="dashboard-stat-content">
            <span>Projects In Progress</span>
            <h2>{projectsInProgress}</h2>
            <p>Currently running</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon completed-icon">
            <CheckCircle size={21} />
          </div>

          <div className="dashboard-stat-content">
            <span>Projects Completed</span>
            <h2>{projectsCompleted}</h2>
            <p>Successfully completed</p>
          </div>
        </div>
      </section>

      {/* Project management statistics */}
      <section className="dashboard-projects-statistics">
        <div className="dashboard-chart-header">
          <div>
            <span className="section-eyebrow">
              PROJECT MANAGEMENT
            </span>

            <div className="dashboard-section-title">
              <span className="dashboard-responsive-icon">
                <BriefcaseBusiness size={16} />
              </span>

              <h2>Projects Statistics</h2>
            </div>

            <p>
              Overview of project activity,
              completion and current progress.
            </p>
          </div>

          <div className="dashboard-statistics-period">
            <TrendingUp size={14} />
            <span>Live Statistics</span>
          </div>
        </div>

        {/* Project KPI statistics */}
        <div className="project-statistics-grid">
          <div className="project-stat-box">
            <div className="project-stat-box-top">
              <span>Total Projects</span>

              <div className="project-stat-icon project-total-icon">
                <FolderKanban size={17} />
              </div>
            </div>

            <div className="project-stat-value-row">
              <strong>{totalProjects}</strong>

              <span className="project-trend positive">
                <ArrowUpRight size={13} />
                <span>Active</span>
              </span>
            </div>

            <p>All registered projects</p>
          </div>

          <div className="project-stat-box">
            <div className="project-stat-box-top">
              <span>In Progress</span>

              <div className="project-stat-icon project-progress-icon">
                <Clock3 size={17} />
              </div>
            </div>

            <div className="project-stat-value-row">
              <strong>
                {projectsInProgress}
              </strong>

              <span className="project-trend warning">
                <ArrowUpRight size={13} />
                <span>Running</span>
              </span>
            </div>

            <p>Projects currently running</p>
          </div>

          <div className="project-stat-box">
            <div className="project-stat-box-top">
              <span>Completed</span>

              <div className="project-stat-icon project-completed-icon">
                <CheckCircle size={17} />
              </div>
            </div>

            <div className="project-stat-value-row">
              <strong>
                {projectsCompleted}
              </strong>

              <span className="project-trend positive">
                <ArrowUpRight size={13} />
                <span>Done</span>
              </span>
            </div>

            <p>Successfully completed</p>
          </div>

          <div className="project-stat-box">
            <div className="project-stat-box-top">
              <span>Completion Rate</span>

              <div className="project-stat-icon project-rate-icon">
                <BarChart3 size={17} />
              </div>
            </div>

            <div className="project-stat-value-row">
              <strong>
                {projectsCompletionRate}%
              </strong>

              <span className="project-trend neutral">
                {projectsCompletionRate >= 50 ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}

                <span>Rate</span>
              </span>
            </div>

            <p>
              Projects successfully completed
            </p>
          </div>
        </div>

        {/* Project status chart */}
        <div className="dashboard-project-chart-wrapper">
          <div className="dashboard-project-chart-title">
            <div>
              <strong>Project Status</strong>
              <span>
                Current distribution by status
              </span>
            </div>

            <div className="dashboard-chart-legend">
              <span>
                <i className="legend-progress" />
                In Progress
              </span>

              <span>
                <i className="legend-completed" />
                Completed
              </span>
            </div>
          </div>

          <div className="dashboard-chart">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={projectsChartData}
                barCategoryGap="28%"
                margin={{
                  top: 35,
                  right: 20,
                  left: 5,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#475569",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                  tickMargin={10}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  width={30}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(99, 102, 241, 0.04)",
                  }}
                  contentStyle={{
                    border: "1px solid #e8ebf2",
                    borderRadius: "10px",
                    boxShadow:
                      "0 8px 24px rgba(15, 23, 42, 0.08)",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="value"
                  barSize={58}
                  radius={[8, 8, 0, 0]}
                >
                  {projectsChartData.map(
                    (project) => (
                      <Cell
                        key={project.name}
                        fill={project.color}
                      />
                    )
                  )}

                  <LabelList
                    dataKey="value"
                    position="top"
                    offset={8}
                    fontSize={14}
                    fontWeight={700}
                    fill="#1e293b"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Task performance */}
      <section className="dashboard-task-performance">
        <div className="dashboard-chart-header">
          <div>
            <span className="section-eyebrow">
              TASK MANAGEMENT
            </span>

            <div className="dashboard-section-title">
              <span className="dashboard-responsive-icon">
                <ClipboardList size={16} />
              </span>

              <h2>Task Performance</h2>
            </div>

            <p>
              Current task completion and workload
              overview.
            </p>
          </div>

          <div className="task-performance-badge">
            <CircleDot size={13} />
            <span>Performance</span>
          </div>
        </div>

        {/* Task KPI */}
        <div className="task-management-kpis">
          <div className="task-management-kpi">
            <div className="task-kpi-header">
              <span>Total Tasks</span>

              <div className="task-kpi-icon total-task-icon">
                <ClipboardList size={17} />
              </div>
            </div>

            <strong>{totalTasks}</strong>

            <small>
              All registered tasks
            </small>
          </div>

          <div className="task-management-kpi">
            <div className="task-kpi-header">
              <span>Completed</span>

              <div className="task-kpi-icon completed-task-icon">
                <CheckCircle size={17} />
              </div>
            </div>

            <strong>{completedTasks}</strong>

            <small>
              Successfully completed
            </small>
          </div>

          <div className="task-management-kpi">
            <div className="task-kpi-header">
              <span>In Progress</span>

              <div className="task-kpi-icon progress-task-icon">
                <Clock3 size={17} />
              </div>
            </div>

            <strong>{inProgressTasks}</strong>

            <small>
              Currently being worked on
            </small>
          </div>

          <div className="task-management-kpi">
            <div className="task-kpi-header">
              <span>Pending</span>

              <div className="task-kpi-icon pending-task-icon">
                <CircleDot size={17} />
              </div>
            </div>

            <strong>{pendingTasks}</strong>

            <small>
              Waiting for action
            </small>
          </div>
        </div>

        {/* Task performance content */}
        <div className="task-performance-content">
          <div className="task-progress">
            <div className="task-progress-header">
              <div>
                <span>Completion Rate</span>

                <small>
                  Completed tasks compared to all tasks
                </small>
              </div>

              <strong>
                {completedPercentage}%
              </strong>
            </div>

            <div className="task-progress-bar">
              <div
                className="task-progress-fill"
                style={{
                  width: `${completedPercentage}%`,
                }}
              />
            </div>

            {/* Task distribution */}
            <div className="task-distribution">
              <div className="task-distribution-header">
                <span>Task Distribution</span>

                <small>
                  Current status breakdown
                </small>
              </div>

              <div className="task-distribution-bar">
                <div
                  className="distribution-completed"
                  style={{
                    width: `${completedPercentage}%`,
                  }}
                />

                <div
                  className="distribution-progress"
                  style={{
                    width: `${inProgressPercentage}%`,
                  }}
                />

                <div
                  className="distribution-pending"
                  style={{
                    width: `${pendingPercentage}%`,
                  }}
                />
              </div>

              <div className="task-distribution-legend">
                <span>
                  <i className="distribution-dot completed-distribution-dot" />
                  Completed {completedPercentage}%
                </span>

                <span>
                  <i className="distribution-dot progress-distribution-dot" />
                  In Progress {inProgressPercentage}%
                </span>

                <span>
                  <i className="distribution-dot pending-distribution-dot" />
                  Pending {pendingPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Task statistics */}
          <div className="task-performance-stats">
            <div className="task-performance-stat">
              <span>Total</span>
              <strong>{totalTasks}</strong>
            </div>

            <div className="task-performance-stat">
              <span>Completed</span>
              <strong>{completedTasks}</strong>
            </div>

            <div className="task-performance-stat">
              <span>In Progress</span>
              <strong>{inProgressTasks}</strong>
            </div>

            <div className="task-performance-stat">
              <span>Pending</span>
              <strong>{pendingTasks}</strong>
            </div>
          </div>
        </div>

        {/* Task management summary */}
        <div className="task-management-summary">
          <div className="task-management-summary-card">
            <div className="task-summary-top">
              <div>
                <span>Open Workload</span>

                <small>
                  Tasks that still require attention
                </small>
              </div>

              <div className="task-summary-icon open-task-summary-icon">
                <Activity size={16} />
              </div>
            </div>

            <div className="task-summary-value">
              <strong>{openTasks}</strong>

              <span>
                {openTasksPercentage}% of all tasks
              </span>
            </div>

            <div className="task-summary-bar">
              <div
                style={{
                  width: `${openTasksPercentage}%`,
                }}
              />
            </div>
          </div>

          <div className="task-management-summary-card">
            <div className="task-summary-top">
              <div>
                <span>Completed Work</span>

                <small>
                  Tasks successfully finished
                </small>
              </div>

              <div className="task-summary-icon completed-summary-icon">
                <CheckCircle size={16} />
              </div>
            </div>

            <div className="task-summary-value">
              <strong>{completedTasks}</strong>

              <span>
                {completedPercentage}% of all tasks
              </span>
            </div>

            <div className="task-summary-bar">
              <div
                style={{
                  width: `${completedPercentage}%`,
                }}
              />
            </div>
          </div>

          <div className="task-management-insight">
            <div className="task-insight-icon">
              <ArrowUpRight size={15} />
            </div>

            <div>
              <strong>
                Task Management Insight
              </strong>

              <span>
                {openTasks} tasks still require
                attention, while {completedTasks}{" "}
                tasks are completed.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Task status statistics */}
      <section className="dashboard-chart-section task-status-statistics">
        <div className="dashboard-chart-header">
          <div>
            <span className="section-eyebrow">
              TASK ANALYTICS
            </span>

            <div className="dashboard-section-title">
              <span className="dashboard-responsive-icon">
                <BarChart3 size={16} />
              </span>

              <h2>Task Status Statistics</h2>
            </div>

            <p>
              Detailed distribution of current task
              statuses.
            </p>
          </div>

          <div className="task-status-total">
            <ClipboardList size={13} />

            <span>{totalTasks} Tasks</span>
          </div>
        </div>

        <div className="task-status-layout">
          {/* Task pie chart */}
          <div className="dashboard-task-chart">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={taskStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  innerRadius={72}
                  outerRadius={112}
                  paddingAngle={4}
                  stroke="none"
                >
                  {taskStatusData.map(
                    (task) => (
                      <Cell
                        key={task.name}
                        fill={task.color}
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    border: "1px solid #e8ebf2",
                    borderRadius: "10px",
                    boxShadow:
                      "0 8px 24px rgba(15, 23, 42, 0.08)",
                    fontSize: "12px",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={35}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="task-pie-center">
              <strong>{totalTasks}</strong>

              <span>Total Tasks</span>
            </div>
          </div>

          {/* Task status details */}
          <div className="task-status-details">
            <div className="task-status-summary">
              <div>
                <span>Overall Completion</span>

                <strong>
                  {completedPercentage}%
                </strong>
              </div>

              <div className="task-status-summary-icon">
                <TrendingUp size={18} />
              </div>
            </div>

            <div className="task-status-detail-grid">
              <div className="task-status-detail completed-detail">
                <div className="task-status-detail-header">
                  <span className="task-detail-dot completed-dot" />
                  <span>Completed</span>
                </div>

                <div className="task-status-detail-value">
                  <strong>
                    {completedTasks}
                  </strong>

                  <span>
                    {completedPercentage}%
                  </span>
                </div>

                <div className="task-detail-bar">
                  <div
                    style={{
                      width: `${completedPercentage}%`,
                    }}
                  />
                </div>
              </div>

              <div className="task-status-detail progress-detail">
                <div className="task-status-detail-header">
                  <span className="task-detail-dot progress-dot" />
                  <span>In Progress</span>
                </div>

                <div className="task-status-detail-value">
                  <strong>
                    {inProgressTasks}
                  </strong>

                  <span>
                    {inProgressPercentage}%
                  </span>
                </div>

                <div className="task-detail-bar">
                  <div
                    style={{
                      width: `${inProgressPercentage}%`,
                    }}
                  />
                </div>
              </div>

              <div className="task-status-detail pending-detail">
                <div className="task-status-detail-header">
                  <span className="task-detail-dot pending-dot" />
                  <span>Pending</span>
                </div>

                <div className="task-status-detail-value">
                  <strong>
                    {pendingTasks}
                  </strong>

                  <span>
                    {pendingPercentage}%
                  </span>
                </div>

                <div className="task-detail-bar">
                  <div
                    style={{
                      width: `${pendingPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="task-status-insight">
              <div className="task-insight-icon">
                <ArrowUpRight size={15} />
              </div>

              <div>
                <strong>Task Overview</strong>

                <span>
                  {completedTasks} of {totalTasks}{" "}
                  tasks are currently completed.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent projects and tasks */}
      <div className="dashboard-sections">
        {/* Recent projects */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <span className="section-eyebrow">
                PROJECTS
              </span>

              <div className="dashboard-section-title">
                <span className="dashboard-responsive-icon">
                  <FolderKanban size={16} />
                </span>

                <h2>Recent Projects</h2>
              </div>
            </div>

            <span className="dashboard-section-count">
              {projects.length}
            </span>
          </div>

          <div className="dashboard-items">
            {projects.slice(-3).map(
              (project) => (
                <div
                  key={project.id}
                  className="dashboard-item"
                >
                  <div className="dashboard-item-info">
                    <strong>
                      {project.name}
                    </strong>
                  </div>

                  <span
                    className={`dashboard-status status-${project.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {project.status}
                  </span>
                </div>
              )
            )}
          </div>
        </section>

        {/* Recent tasks */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <span className="section-eyebrow">
                TASKS
              </span>

              <div className="dashboard-section-title">
                <span className="dashboard-responsive-icon">
                  <ClipboardList size={16} />
                </span>

                <h2>Recent Tasks</h2>
              </div>
            </div>

            <span className="dashboard-section-count">
              {tasks.length}
            </span>
          </div>

          <div className="dashboard-items">
            {tasks.slice(-3).map(
              (task) => (
                <div
                  key={task.id}
                  className="dashboard-item"
                >
                  <div className="dashboard-item-info">
                    <strong>
                      {task.title}
                    </strong>
                  </div>

                  <span
                    className={`dashboard-status status-${task.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {task.status}
                  </span>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  )
}