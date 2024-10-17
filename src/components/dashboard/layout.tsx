"use client";
import Sidebar from "./sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen max-h-screen overflow-auto">
      {/* sidebar */}
      <div className="min-w-[230px]">
        <Sidebar />
      </div>
      {/* pathname content */}
      <div className="w-full lg:space-y-6 space-y-4 lg:p-6 p-4 bg-[#F4F7FE] overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
