// components/CategoryPieChart.jsx
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart({ data }) {
  const chartData = {
    labels: Object.keys(data), // category names
    datasets: [
      {
        label: "Spending by Category",
        data: Object.values(data), // amounts
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#333" },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}
