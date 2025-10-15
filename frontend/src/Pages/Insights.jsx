import LineChart from "../components/LineChart";
import CategoryPieChart from "../components/CategoryPieChart";
import WeeklyBarChart from "../components/WeeklyBarChart";
import TopExpensesTable from "../components/TopExpensesTable";
import TotalExpensesCard from "../components/TotalExpensesCard";

export default function Insights() {
  const startDate = new Date("2025-10-01");
  const labels = Array.from({ length: 60 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  });

  const expensesData = [
    { date: "2025-10-01", amount: 5000, category: "Food", note: "Lunch" },
    { date: "2025-10-02", amount: 12000, category: "Travel", note: "Cab" },
    { date: "2025-10-03", amount: 3000, category: "Shopping", note: "Clothes" },
    { date: "2025-10-04", amount: 4000, category: "Bills", note: "Electricity" },
    { date: "2025-10-05", amount: 1500, category: "Food", note: "Snacks" },
    { date: "2025-10-06", amount: 7000, category: "Travel", note: "Train" },
    { date: "2025-10-07", amount: 2000, category: "Other", note: "Gift" },
    { date: "2025-10-08", amount: 3500, category: "Shopping", note: "Shoes" },
    { date: "2025-10-09", amount: 500, category: "Food", note: "Breakfast" },
    { date: "2025-10-10", amount: 6000, category: "Travel", note: "Taxi" },
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Daily Spending (₹)",
        data: Array.from({ length: 60 }, () => Math.floor(Math.random() * 2000)),
        borderColor: "#1f1f1f",
        backgroundColor: "rgba(31, 31, 31, 0.3)",
        tension: 0.3,
      },
    ],
  };

  const categoryData = {
    Food: 12000,
    Travel: 8000,
    Shopping: 5000,
    Bills: 3000,
    Other: 2000,
  };

  const weeklyData = {
    "Week 1": 5000,
    "Week 2": 7000,
    "Week 3": 6500,
    "Week 4": 8000,
    "Week 5": 4000,
    "Week 6": 7500,
    "Week 7": 6000,
    "Week 8": 9000,
  };

  return (
    <div className="min-h-screen bg-[#d1cfc0] text-black p-8 space-y-6">
      
      {/* Line Chart */}
      <div className="w-full h-[470px] bg-[#d1cfc0] rounded-lg shadow-md p-2">
        <LineChart data={chartData} />
      </div>

      {/* Pie Chart + Top Expenses Table side by side */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Pie Chart */}
        <div className="flex-1 h-[400px] bg-[#d1cfc0] rounded-lg p-4 mt-13">
          <CategoryPieChart data={categoryData} />
        </div>

        {/* Top Expenses Table */}
        <div className="flex-1 bg-[#d1cfc0] rounded-lg p-4">
          <TopExpensesTable expenses={expensesData} />
        </div>
        
      </div>

      {/* Weekly Bar Chart */}
      <div className="w-150 h-[400px] bg-[#d1cfc0] rounded-lg p-4">
        <WeeklyBarChart data={weeklyData} />
      </div>
      <TotalExpensesCard total={expensesData.reduce((sum, e) => sum + e.amount, 0)} />
    </div>
  );
}
