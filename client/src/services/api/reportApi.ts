import { apiRequest } from "./api"

// Get the reports overview
export function getReportOverview() {
  return apiRequest("/reports/overview")
}