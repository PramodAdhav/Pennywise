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
          "#4E79A7",
          "#F28E2B",
          "#E15759",
          "#76B7B2",
          "#59A14F",
          "#EDC948",
          "#B07AA1",
          "#FF9DA7",
          "#9C755F",
          "#BAB0AC",
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
        display: false,
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}
