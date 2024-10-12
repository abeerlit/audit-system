"use client";
import Sidebar from "./sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen max-h-screen overflow-auto">
      {/* sidebar */}
      <div className="w-[300px]">
        <Sidebar />
      </div>
      {/* pathname content */}
      <div className="w-full overflow-auto p-6 bg-gray-200">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
