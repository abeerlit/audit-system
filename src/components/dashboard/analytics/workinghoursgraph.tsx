import React, { useState, useEffect } from "react";
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
import axios from 'axios';

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

// Add this type definition
type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
    pointRadius: number;
    pointBackgroundColor: string;
  }[];
};

const WorkingHoursChart = ({statsData, itemsStatus, setItemsStatus,userData }: { statsData: any, itemsStatus: "accepted" | "edited" | "skipped" | "flagged" | "all" , setItemsStatus: (itemsStatus: "accepted" | "edited" | "skipped" | "flagged" | "all" ) => void,userData:any }) => {
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [timePeriod, setTimePeriod] = useState<"today" | "week" | "month" | "">('month');
const [totalWorkingHours,setTotalWorkingHours]=useState<string>("0");
const [percentageIncrease,setPercentageIncrease]=useState<number>(0);
console.log(userData,"userData in working hours graph");

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response:any = await axios.get(`/api/sessions/stats?period=${timePeriod}&user_id=${userData.role === "admin" ? "1" : userData.id.toString()}`);
      console.log(response.data,"response in working hours graph");
      
        const hours=response?.data?.hours.map((hours:number)=>hours > 0 ? hours.toString().split(".")[0]  ==="0" ? hours.toFixed(2) : hours.toFixed(0) : 0);
        // Convert total hours to hours and minutes format
        const totalHoursNum = parseFloat(response?.data?.totalHours || "0");
        const totalHoursWhole = Math.floor(totalHoursNum);
        const totalMinutes = Math.round((totalHoursNum - totalHoursWhole) * 60);
        const formattedTotalHours = `${totalHoursWhole}hrs ${totalMinutes > 0 ? `${totalMinutes}min ` : ""}`;
        setTotalWorkingHours(formattedTotalHours);

        setPercentageIncrease(response?.data?.percentageIncrease);
        setChartData({
          labels: response.data.labels,
          datasets: [{
            label: "Working Hours",
            data: hours,
            borderColor: "#2AB3E7",
            tension: 0.4,
            pointRadius: 10,
            pointBackgroundColor: "#2AB3E7",
          }],
        });
      } catch (error) {
        console.error('Failed to fetch session data:', error);
      }
    };

    fetchSessionData();
  }, [timePeriod,userData]);

  console.log(statsData, "statsData");
  const data = {
    labels: ["1", "2", "3", "4"],
    datasets: [
      {
        label: "Working Hours",
        data: [0, 0, 0, 0],
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
      <div className="flex justify-start items-start gap-4 mt-[-40px] max-xl:mt-[-20px]">

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
        </div>
        <div className="flex items-end w-full h-full mt-5 mr-[-10px]">

          <button
            type="button"
            className="px-3 py-2 ms-auto flex justify-between  h-[30px] items-center font-semibold rounded-[7px]  bg-[#F4F7FE] text-auth-purple group relative"
          >

            <span className="text-sm mr-2 whitespace-nowrap">{    itemsStatus.charAt(0).toUpperCase() + itemsStatus.slice(1)} Items</span>
            <DropdownIconFill />

            <div className="absolute z-10 top-12 left-0 w-full bg-[#ececec] font-normal rounded-xl overflow-hidden shadow-md hidden group-focus:block">

              {['accepted', 'edited', 'skipped', 'flagged',"all"].map((status) => (
                <div
                  key={status}
                  onClick={() => setItemsStatus(status as "accepted" | "edited" | "skipped" | "flagged" | "all")}
                  className="py-1 px-4 hover:bg-white text-start cursor-pointer text-nowrap whitespace-nowrap"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} Items
                </div>
              ))}

            </div>
          </button>
        </div>
      </div>

      <div className=" w-full flex max-sm:flex-col justify-between items-start">

        <div className="mb-4">
          <h2 className="text-2xl font-bold">{totalWorkingHours}</h2>
          <div className="flex items-center text-sm text-nowrap">

            <span className=" text-gray-600">Total Spent ▲ </span>
            {/* <span className="ml-2 text-green-500">+2.45%</span> */}
            <span className={`text-sm ${percentageIncrease > 0 ? 'text-green-500' : 'text-red-500'}`}>{percentageIncrease > 0 ? `+${percentageIncrease || 0}%` :  `${ 0 }%`}</span>

          </div>
        </div>
        <div className="w-full max-sm:w-[300px]  max-w-sm">
          <Line data={chartData || data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursChart;
