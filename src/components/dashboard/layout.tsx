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
      <div className="w-full overflow-auto lg:p-6 p-4 bg-gray-200">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
