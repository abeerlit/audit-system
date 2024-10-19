import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PerformanceGraph = () => {
  const data = {
    labels: ["Accepted", "Skipped", "Edited", "Flagged"],
    datasets: [
      {
        label: "Items",
        data: [67, 113, 40, 48],
        backgroundColor: ["#4CAF50", "#03A9F4", "#FFC107", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Pie data={data} />
    </div>
  );
};

export default PerformanceGraph;
