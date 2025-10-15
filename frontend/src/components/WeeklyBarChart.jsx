// components/WeeklyBarChart.jsx
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function WeeklyBarChart({ data }) {
  const chartData = {
    labels: Object.keys(data), // week names
    datasets: [
      {
        label: "Weekly Spending (₹)",
        data: Object.values(data), // amounts
        backgroundColor: "#36A2EB",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { drawTicks: true, drawBorder: true, display: false },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
