// components/LineChart.jsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({ data }) {
  const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { drawTicks: true, drawBorder: true, display: false }, // hides grid lines
      ticks: {
        color: "#333",
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      grid: { drawTicks: true, drawBorder: true, display: false }, // hides grid lines
      ticks: { color: "#333" },
    },
  },
  plugins: {
    legend: { display: false },
  },
};

  return <Line data={data} options={options} />;
}
