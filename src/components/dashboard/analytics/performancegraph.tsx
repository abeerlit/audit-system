import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Filler } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, Filler, ChartDataLabels);

const PerformanceGraph = () => {
  const labels = ["Accepted", "Skipped", "Edited", "Flagged"];

  const data = {
    // labels: labels,
    datasets: [
      {
        label: "Items",
        data: [67, 113, 40, 48],
        backgroundColor: ["#4CAF50", "#03A9F4", "#FFC107", "#F44336"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        color: '#FFFFFF',
        formatter: (value:number, context:any) => {
          // return context.chart.data.labels[context.dataIndex] + '\n' + value;
          return labels[context.dataIndex] + '\n' + value; // Just show the value
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
    <div className="bg-white p-6 rounded-3xl shadow-md grid grid-cols-2 gap-4">
      <div className="">
        <h2 className="text-xl font-semibold text-auth-purple mb-4">Performance</h2>
        <select className="mb-4 rounded-lg p-2 text-sm bg-[#F4F7FE] font-bold text-light-gray">
          <option>Last month</option>
          <option>This month</option>
        </select>
        <div className="grid grid-cols-2 border-gray-100 border rounded-xl shadow-sm p-2">
          <div className="flex p-2 border-gray-100 border-e border-b">
            <span className="w-3 h-3 mt-1 bg-green-600 rounded-full mr-2"></span>
            <div className="text-left">
              <span className="block text-sm text-light-gray">Accepted</span>
              <span className="block text-xl font-bold text-auth-purple">67</span>
            </div>
          </div>
          <div className="flex p-2 border-gray-100 border-b ps-4">
            <span className="w-3 h-3 mt-1 bg-gray-500 rounded-full mr-2"></span>
            <div className="text-left">
              <span className="block text-sm text-light-gray">Skipped</span>
              <span className="block text-xl font-bold text-auth-purple">113</span>
            </div>
          </div>
          <div className="flex p-2 border-gray-100 border-e">
            <span className="w-3 h-3 mt-1 bg-yellow-500 rounded-full mr-2"></span>
            <div className="text-left">
              <span className="block text-sm text-light-gray">Edited</span>
              <span className="block text-xl font-bold text-auth-purple">40</span>
            </div>
          </div>
          <div className="flex p-2 ps-4">
            <span className="w-3 h-3 mt-1 bg-red-500 rounded-full mr-2"></span>
            <div className="text-left">
              <span className="block text-sm text-light-gray">Flagged</span>
              <span className="block text-xl font-bold text-auth-purple">48</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PerformanceGraph;
