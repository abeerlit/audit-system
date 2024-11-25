import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale, // Import CategoryScale
} from "chart.js";
import DropdownIconFill from "@/components/icons/dashboard/auditing/dropdown-icon-fill";

// Register the required components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale // Register CategoryScale
);

const WorkingHoursChart = ({ timePeriod, setTimePeriod ,statsData}: { timePeriod: "today" | "week" | "month" | "", setTimePeriod: (timePeriod: "today" | "week" | "month" | "") => void ,statsData:any}) => {
 

 
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg  flex flex-col justify-between items-start gap-10 h-full">
      <div className="flex justify-between items-center gap-4 w-full mt-[-10px]">

      <h2 className="text-xl font-semibold text-auth-purple ">Performance</h2>

        <div className="flex items-end w-full h-full  mr-[-10px]">

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
        </div>
      </div>

      <div className=" w-full flex justify-between items-start">

        <div className="mb-4">
          <div className="flex items-center text-sm text-nowrap">
          <h2 className="text-2xl font-bold">72hrs</h2>
            <span className="ml-2 text-green-500">+2.45%</span>
          </div>
            <p   className="text-[12px] text-gray-600">Total Spent ▲ </p>
        </div>
        <div className="w-full max-w-sm">
        </div>
      </div>
      <div className=" w-full">
      {/* Accepted */}
      <div className="flex items-center mb-4">
        <span className="text-[12px] font-medium text-gray-500 w-20">ACCEPTED</span>
        <div className="flex-grow h-3 bg-white rounded-full relative ">
          <div
            className="h-3  bg-green-500 "
            style={{ width: `${statsData.acceptedItems}%` ,borderTopRightRadius:50,borderBottomRightRadius:50}} // Adjust the width for the progress bar
          ></div>
        </div>
        <span className="text-green-500 font-bold text-sm ml-4">{statsData.acceptedItems}</span>
      </div>

      {/* Edited */}
      <div className="flex items-center">
        <span className="text-[12px] font-medium text-gray-500 w-20">EDITED</span>
        <div className="flex-grow h-3 bg-white rounded-full relative">
          <div
            className="h-3 bg-yellow-500 "
            style={{ width: `${statsData.editedItems}%` ,borderTopRightRadius:50,borderBottomRightRadius:50}} // Adjust the width for the progress bar
          ></div>
        </div>
        <span className="text-yellow-500 font-bold text-sm ml-4">{statsData.editedItems}</span>
      </div>
    </div>
    </div>
  );
};

export default WorkingHoursChart;
