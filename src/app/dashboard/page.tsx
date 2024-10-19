"use client";
import AnalyticsDashboard from "@/components/dashboard/analytics/analytics";
import Header from "@/components/dashboard/header";
import DashboardLayout from "@/components/dashboard/layout";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <Header />
      <AnalyticsDashboard />
    </DashboardLayout>
  )
}

export default DashboardPage;
