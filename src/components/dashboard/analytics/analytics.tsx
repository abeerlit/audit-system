import React, { useEffect, useState } from "react";
import PerformanceGraph from "./performancegraph";
import WorkingHoursGraph from "./workinghoursgraph";
import AnalyticsCardsIcon from "@/components/icons/dashboard/analytics-cards-icon";
import DropdownIcon from "@/components/icons/dashboard/auditing/dropdown-icon";
import DropdownIconFill from "@/components/icons/dashboard/auditing/dropdown-icon-fill";
import { useSelector } from "react-redux";
import { Users } from "@/store/slices/usersSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import { User } from "@/store/slices/userSlice";
import ExpertPerformanceGraph from "./expertPerformanceGraph";
import UploadFileIconWhite from "@/components/icons/dashboard/chapters/upload-file-icon-white";
import { toast } from "react-hot-toast";
import ChaptersFilter from "../ChaptersFilter";
import chaptersTable from "../../../../chaptersTable.json"
import { dashboardStats } from "@/store/slices/dashboardStatsSlice";
const AnalyticsDashboard = () => {
  const usersData: Users[] = useSelector((state: RootState) => state.users);
  const userData: User = useSelector((state: RootState) => state.user);
const dashboardStats: dashboardStats = useSelector((state: RootState) => state.dashboardStats);
  const [selectedChapters, setSelectedChapters] = useState({ chapter_no: 0, chapter_name: 'All Chapters' });
  const chapterNames = [{ chapter_no: 0, chapter_name: 'All Chapters' }, ...chaptersTable];

  const [timePeriod, setTimePeriod] = useState<"today" | "week" | "month" | "">('month');
  const [userType, setUserType] = useState<"broker" | "expert" | "user type">('user type');

  const [selectedUsers, setSelectedUsers] = useState({ id: 0, firstName: 'All Users', lastName: '' });

  const [statsData, setStatsData] = useState<{
    totalChapters?: number;
    acceptedItems?: number;
    editedItems?: number;
    skippedItems?: number;
    flaggedItems?: number;
    auditTimeAvg?: number;
    chapterIncreasePercentage?: number;
    acceptedIncreasePercentage?: number;
    editedIncreasePercentage?: number;
    skippedIncreasePercentage?: number;
    flaggedIncreasePercentage?: number;
    auditTimeIncreasePercentage?: number;
    totalItems?: number;
    workingHoursAvg?: number;
    workingHoursIncreasePercentage?: number;
  } | any>({});



  const fetchDashboardStats = async () => {
    try {
      // Add 1 second delay before fetching stats
      const params = new URLSearchParams({
        time_period: timePeriod,
        ...(selectedChapters.chapter_no !== 0 && { chapter_id: selectedChapters.chapter_no.toString() }),
        ...(userData?.role === "broker" || userData?.role === "expert" ? { user_id: userData?.id?.toString() } : selectedUsers.id !== 0 && { user_id: selectedUsers.id.toString() }),
        ...(userType !== 'user type' && { user_type: userType })
      });

      const response = await axios.get(`/api/admin/dashboardStats?${params}`);
      setStatsData(response.data.chaptersDetails);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(selectedChapters.chapter_no !== 0 && { chapter_id: selectedChapters.chapter_no.toString() }),
        ...(selectedUsers.id !== 0 && { user_id: selectedUsers.id.toString() }),
        ...(userType !== 'user type' && { user_type: userType })
      });

      const response = await axios.get(`/api/admin/exportChapters?${params}`, {
        responseType: 'blob' // Important for handling binary data
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `chapter_items_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };



  useEffect(() => {
    if (userData.role && userData.id) {
      fetchDashboardStats();
    }
  }, [timePeriod, selectedChapters, selectedUsers, userType, userData.role, userData.id]);

  return (
    <div className="">
      <div className="flex justify-end flex-wrap gap-2 mb-4">

        {userData.role === "admin" && <div className="flex justify-end mb-4">
          <button
            type="button"
            className="px-3 py-2 ms-auto flex items-center font-semibold rounded-full  bg-white text-auth-purple group relative"
          >

            <span className="text-sm mr-8">{selectedUsers?.firstName.charAt(0).toUpperCase() + selectedUsers?.firstName.slice(1)} {selectedUsers?.lastName.charAt(0).toUpperCase() + selectedUsers?.lastName.slice(1)}</span>
            <DropdownIcon />
            <div className="absolute z-10 top-12 left-0 w-full bg-[#ececec] font-normal rounded-xl overflow-hidden shadow-md hidden group-focus:block">

              {usersData.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUsers(user)}
                  className="py-1 px-4 hover:bg-white cursor-pointer text-nowrap"
                >
                  {user?.firstName} {user?.lastName}
                </div>
              ))}
            </div>
          </button>
        </div>}

        {userData.role === "admin" && <div className="flex justify-end mb-4">
          <button
            type="button"
            className="px-3 py-2 ms-auto flex items-center font-semibold rounded-full  bg-white text-auth-purple group relative"
          >

            <span className="text-sm mr-8">{userType.charAt(0).toUpperCase() + userType.slice(1)}</span>
            <DropdownIcon />
            <div className="absolute z-10 top-12 left-0 w-full bg-[#ececec] font-normal rounded-xl overflow-hidden shadow-md hidden group-focus:block">

              {['broker', 'expert'].map((period) => (
                <div
                  key={period}
                  onClick={() => setUserType(period as "broker" | "expert")}
                  className="py-1 px-4 hover:bg-white cursor-pointer text-nowrap"
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </div>
              ))}
            </div>
          </button>
        </div>}

        {ChaptersFilter(selectedChapters, setSelectedChapters, chapterNames)}
        {userData.role === "admin" &&
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-2 text-white ms-auto flex items-center font-semibold rounded-full border bg-[#2AB3E7] group relative"
            >
              <UploadFileIconWhite />
              <span className="text-sm ml-2">Export in Excel</span>
            </button>
          </div>}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">

        <>
          <StatCard
            userData={userData}
            title={`Total ${userData.role === "admin" ? "Items Uploaded" : "Audited"}`}
            value={userData.role === "admin" ? statsData?.totalChapters?.toString() || "0" : statsData?.totalItems?.toString() || "0"}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            increase={userData.role === "admin" ? statsData?.chapterIncreasePercentage || 0 : statsData?.chapterIncreasePercentage || 0}
          />
          <StatCard
            userData={userData}
            title="Accepted Items"
            value={statsData?.acceptedItems?.toString() || "0"}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            increase={statsData?.acceptedIncreasePercentage || 0}
          />
          <StatCard
            userData={userData}
            title="Edited Items"
            value={statsData?.editedItems?.toString() || "0"}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            increase={statsData?.editedIncreasePercentage || 0}
          />
          {userData.role !== "expert" &&

            <StatCard
              userData={userData}
              title="Skipped Items"
              value={statsData?.skippedItems?.toString() || "0"}
              timePeriod={timePeriod}
              setTimePeriod={setTimePeriod}
              increase={statsData?.skippedIncreasePercentage || 0}
            />}
          {userData.role !== "expert" &&

            <StatCard
              userData={userData}
              title="Flagged Items"
              value={statsData?.flaggedItems?.toString() || "0"}
              timePeriod={timePeriod}
              setTimePeriod={setTimePeriod}
              increase={statsData?.flaggedIncreasePercentage || 0}
            />}
          <StatCard
            userData={userData}
            title="Each Audit Time (Avg)"
            value={statsData?.totalItems ? `${Math.floor(dashboardStats.eachAuditTimeAvg/(statsData.acceptedItems+statsData.skippedItems + statsData.editedItems + statsData.flaggedItems))}min ${Math.round((dashboardStats.eachAuditTimeAvg/(statsData.acceptedItems+statsData.skippedItems + statsData.editedItems + statsData.flaggedItems) % 1) * 60) > 0 ? `${Math.round((dashboardStats.eachAuditTimeAvg/(statsData.acceptedItems+statsData.skippedItems + statsData.editedItems + statsData.flaggedItems) % 1) * 60)}sec` : ""}` : "0min"}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            increase={statsData?.auditTimeIncreasePercentage || 0}
          />
          {userData.role !== "admin" &&
          <StatCard
            userData={userData}
            title="Daily Working Hours (Avg)"
            value={`${dashboardStats?.dailyWorkingHoursAvg || "0"}mins`}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            increase={statsData?.workingHoursIncreasePercentage || 0}
          />}


        </>
      </div>

      <div className="flex flex-wrap max-xl:flex-col gap-6">
        <div className="flex-1">

          <WorkingHoursGraph userData={userData} selectedUsers={selectedUsers}  timePeriod={timePeriod} setTimePeriod={setTimePeriod} />

        </div>
        <div className="flex-1">
          {userData.role === "expert" ? (
            <ExpertPerformanceGraph statsData={statsData} timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
          ) : (
            <PerformanceGraph statsData={statsData} timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, timePeriod, setTimePeriod, increase, userData }: { title: string; value: string; timePeriod: "today" | "week" | "month" | ""; setTimePeriod: (timePeriod: "today" | "week" | "month" | "") => void, increase: number, userData: User }) => (
  <div className="bg-white p-6 rounded-2xl shadow flex items-center flex-1 basis-64">
    <div className="text-4xl mr-4 bg-[#F4F7FE] p-4 rounded-full">
      <AnalyticsCardsIcon className="w-10 h-10" />
    </div>
    <div className="mr-[10px]">
      <p className="text-sm text-light-gray whitespace-nowrap max-sm:whitespace-normal">{title}</p>
      <p className="text-3xl font-extrabold text-auth-purple whitespace-nowrap">{value} {userData.role === "admin" && <span className={`text-sm ${increase > 0 ? 'text-green-500' : 'text-red-500'}`}>{increase > 0 ? `+${increase}%` : `${increase.toFixed(0)}%`}</span>}</p>

    </div>
    {userData.role === "admin" &&
      <div className="flex items-end w-full h-full mt-5 mr-[-10px]">

        <button
          type="button"
          className="px-3 py-2 ms-auto flex justify-between  h-[30px] items-center font-semibold rounded-[7px]  bg-[#F4F7FE] text-auth-purple group relative"
        >

          <span className="text-sm mr-2 whitespace-nowrap">{timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}</span>
          <DropdownIconFill />

          <div className="absolute z-10 top-12 left-0 w-full bg-[#ececec] font-normal rounded-xl overflow-hidden shadow-md hidden group-focus:block">

            {['today', 'week', 'month', "All Time"].map((period) => (
              <div
                key={period}
                onClick={() => setTimePeriod(period as "today" | "week" | "month" | "")}
                className="py-1 px-4 hover:bg-white cursor-pointer text-nowrap whitespace-nowrap"
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </div>
            ))}

          </div>
        </button>
      </div>}

  </div>
);

export default AnalyticsDashboard;
