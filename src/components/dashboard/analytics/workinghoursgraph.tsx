import React from "react";
import { Line } from "react-chartjs-2";
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

const WorkingHoursChart = ({ timePeriod, setTimePeriod }: { timePeriod: "today" | "week" | "month" | "", setTimePeriod: (timePeriod: "today" | "week" | "month") => void }) => {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Working Hours",
        data: [40, 37, 42, 45],
        borderColor: "#2AB3E7", // Tailwind's blue-500
        tension: 0.4, // Smooth curve
        pointRadius: 10, // Larger point for visibility
        pointBackgroundColor: "#2AB3E7", // Point color
      },
    ],
  };

  const options = {
    elements: {
      point: {
        radius: 5, // Default point size
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: () => '', // Remove the title in tooltips
          // label: (tooltipItem: any) => `${tooltipItem.raw} hrs`,
        },
      },
    },
    scales: {
      y: {
        display: false, // Hide y-axis
        beginAtZero: true,
      },
      x: {
        ticks: {
          // color: '#2AB3E7',
        },
        grid: {
          display: false, // Hide x-axis grid
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg  flex flex-col justify-between items-start h-full">
      <div className="flex justify-start items-start gap-4 mt-[-40px]">

        <div className="flex items-end w-full h-full mt-5 mr-[-10px]">

          <button
            type="button"
            className="px-3 py-2 ms-auto flex justify-between  h-[30px] items-center font-semibold rounded-[7px]  bg-[#F4F7FE] text-auth-purple group relative"
          >

            <span className="text-sm mr-2">{timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}</span>
            <DropdownIconFill />

            <div className="absolute z-10 top-12 left-0 w-full bg-[#ececec] font-normal rounded-xl overflow-hidden shadow-md hidden group-focus:block">

              {['today', 'week', 'month'].map((period) => (
                <div
                  key={period}
                  onClick={() => setTimePeriod(period as "today" | "week" | "month")}
                  className="py-1 px-4 hover:bg-white cursor-pointer text-nowrap"
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </div>
              ))}

            </div>
          </button>
        </div>
        <div className="flex items-end w-full h-full mt-5 mr-[-10px]">

          <button
            type="button"
            className="px-3 py-2 ms-auto flex justify-between  h-[30px] items-center font-semibold rounded-[7px]  bg-[#F4F7FE] text-auth-purple group relative"
          >

            <span className="text-sm mr-2">{timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}</span>
            <DropdownIconFill />

            <div className="absolute z-10 top-12 left-0 w-full bg-[#ececec] font-normal rounded-xl overflow-hidden shadow-md hidden group-focus:block">

              {['today', 'week', 'month'].map((period) => (
                <div
                  key={period}
                  onClick={() => setTimePeriod(period as "today" | "week" | "month")}
                  className="py-1 px-4 hover:bg-white cursor-pointer text-nowrap"
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
          <h2 className="text-2xl font-bold">40hrs</h2>
          <div className="flex items-center text-sm text-nowrap">
            <span className=" text-gray-600">Total Spent ▲ </span>
            <span className="ml-2 text-green-500">+2.45%</span>
          </div>
        </div>
        <div className="w-full max-w-sm">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursChart;
