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

const WorkingHoursChart = () => {
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
    <div className="bg-white p-6 rounded-2xl shadow-lg flex">
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
  );
};

export default WorkingHoursChart;
