import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Filler } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import DropdownIconFill from "@/components/icons/dashboard/auditing/dropdown-icon-fill";

ChartJS.register(ArcElement, Tooltip, Legend, Filler, ChartDataLabels);

const PerformanceGraph = ({ statsData, timePeriod, setTimePeriod }: { statsData: any, timePeriod: "today" | "week" | "month" | "", setTimePeriod: (timePeriod: "today" | "week" | "month" | "") => void }) => {
  const hasData = statsData?.acceptedItems || statsData?.skippedItems || statsData?.editedItems || statsData?.flaggedItems;

  const labels = ["Accepted", "Skipped", "Edited", "Flagged"];

  const data = {
    // labels: labels,
    datasets: [
      {
        label: "Items",
        data: [statsData?.acceptedItems ?? 1, statsData?.skippedItems ?? 1, statsData?.editedItems ?? 1, statsData?.flaggedItems ?? 1],
        backgroundColor: ["#4CAF50", "#03A9F4", "#FFC107", "#F44336"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        color: '#FFFFFF',
        formatter: (value: number, context: any) => {
          // return context.chart.data.labels[context.dataIndex] + '\n' + value;
          return value ? labels[context.dataIndex] + '\n' + value : ''; // Just show the value
        },
        font: {
          weight: 500,
          size: 14,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md grid grid-cols-2 max-sm:flex max-sm:flex-col max-sm:items-start max-sm:justify-start gap-4">
      <div className=" flex flex-col  w-full justify-between items-start">
        <h2 className="text-xl font-semibold text-auth-purple mb-4">Performance</h2>


        <button
          type="button"
          className="px-3 py-2 mb-4 flex justify-start  h-[30px] items-center font-semibold rounded-[7px]  bg-[#F4F7FE] text-auth-purple group relative"
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
        <div className="grid grid-cols-2 border-gray-100 border rounded-xl shadow-sm p-2">
          <div className="flex p-2 border-gray-100 border-e border-b">
            <span className="w-3 h-3 mt-1 bg-green-600 rounded-full mr-2"></span>
            <div className="text-left">
              <span className="block text-sm text-light-gray">Accepted</span>
              <span className="block text-xl font-bold text-auth-purple">{statsData?.acceptedItems ?? 0}</span>
            </div>
          </div>
          <div className="flex p-2 border-gray-100 border-b ps-4">
            <span className="w-3 h-3 mt-1 bg-gray-500 rounded-full mr-2"></span>
            <div className="text-left">
              <span className="block text-sm text-light-gray">Skipped</span>
              <span className="block text-xl font-bold text-auth-purple">{statsData?.skippedItems ?? 0}</span>
            </div>
          </div>
          <div className="flex p-2 border-gray-100 border-e">
            <span className="w-3 h-3 mt-1 bg-yellow-500 rounded-full mr-2"></span>
            <div className="text-left">
              <span className="block text-sm text-light-gray">Edited</span>
              <span className="block text-xl font-bold text-auth-purple">{statsData?.editedItems ?? 0}</span>
            </div>
          </div>
          <div className="flex p-2 ps-4">
            <span className="w-3 h-3 mt-1 bg-red-500 rounded-full mr-2"></span>
            <div className="text-left">
              <span className="block text-sm text-light-gray">Flagged</span>
              <span className="block text-xl font-bold text-auth-purple">{statsData?.flaggedItems ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[300px] flex  items-start relative">
        {hasData ? (
          <Pie data={data} options={options} />
        ) : (
          <div className="min-w-[225px] min-h-[225px] mt-2 mx-auto flex items-center justify-center bg-[#2AB3E7] rounded-full">
            <span className="text-white text-xl font-semibold">No Data</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceGraph;
