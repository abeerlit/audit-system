import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const WorkingHoursGraph = () => {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Hours Spent",
        data: [37, 49, 56],
        fill: false,
        borderColor: "#03A9F4",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="w-full">
      <Line data={data} />
    </div>
  );
};

export default WorkingHoursGraph;
