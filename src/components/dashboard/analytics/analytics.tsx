import React from "react";
import PerformanceGraph from "./performancegraph";
import WorkingHoursGraph from "./workinghoursgraph";
import AnalyticsCardsIcon from "@/components/icons/dashboard/analytics-cards-icon";

const AnalyticsDashboard = () => {
  return (
    <div className="">
      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard title="Total Audited" value="46" />
        <StatCard title="Accepted Items" value="12" />
        <StatCard title="Edited Items" value="16" />
        <StatCard title="Skipped Items" value="21" />
        <StatCard title="Flagged Items" value="17" />
        <StatCard title="Each Audit Time (Avg)" value="10min" />
        <StatCard title="Daily Working Hours (Avg)" value="10hrs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Working Hours Average</h3>
          <WorkingHoursGraph />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Performance</h3>
          <PerformanceGraph />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow flex items-center flex-1 basis-64">
    <div className="text-4xl mr-4 bg-[#F4F7FE] p-4 rounded-full">
      <AnalyticsCardsIcon className="w-10 h-10" />
    </div>
    <div>
      <p className="text-sm text-light-gray">{title}</p>
      <p className="text-3xl font-extrabold text-auth-purple">{value}</p>
    </div>
  </div>
);

export default AnalyticsDashboard;
