import LineChart from "../components/LineChart";
import CategoryPieChart from "../components/CategoryPieChart";
import TopExpensesTable from "../components/TopExpensesTable";
import TotalExpensesCard from "../components/TotalExpensesCard";

export default function Insights() {
  const startDate = new Date("2025-10-01");
  const labels = Array.from({ length: 60 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date.toISOString().split("T")[0];
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

  const totalExpenses = expensesData.reduce((sum, e) => sum + e.amount, 0);
  const totalEntries = expensesData.length;
  const avgSpending = Math.floor(totalExpenses / totalEntries);

  const freqCategoryMap = {};
  expensesData.forEach((e) => {
    freqCategoryMap[e.category] = (freqCategoryMap[e.category] || 0) + 1;
  });
  const mostFreqCategory = Object.entries(freqCategoryMap).sort((a, b) => b[1] - a[1])[0][0];

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

  return (
    <div className="min-h-screen bg-[#d1cfc0] text-black p-8 space-y-6">
      <div className="px-8">
        <blockquote className="instrument-serif-regular -mt-14 border-l-2 mb-8 border-black pl-4 text-2xl text-left">
          The amount entered is considered in rupees by default. If no date is selected, today’s date will be 
          used automatically. Please choose an appropriate category from the dropdown menu before submitting your 
          expense.
        </blockquote>
      </div>

      {/* Summary + Monthly Insights side by side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side: 4 summary cards in 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <TotalExpensesCard total={totalExpenses} />
          <div className="h-[120px] bg-[#d1cfc0] rounded-lg border border-black flex flex-col items-center justify-center transition-transform transform hover:scale-105">
            <p className="text-gray-500 text-sm">Total Entries</p>
            <h2 className="text-2xl font-bold">{totalEntries}</h2>
          </div>
          <div className="h-[120px] bg-[#d1cfc0] border border-black rounded-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105">
            <p className="text-gray-500 text-sm">Average Spending / Day</p>
            <h2 className="text-2xl font-bold">₹{avgSpending}</h2>
          </div>
          <div className="h-[120px] bg-[#d1cfc0] border border-black rounded-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105">
            <p className="text-gray-500 text-sm">Most Frequent Category</p>
            <h2 className="text-2xl font-bold">{mostFreqCategory}</h2>
          </div>
        </div>

        {/* Right side: Monthly Insights */}
        <div className="flex-1 bg-[#d1cfc0] border border-black rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Monthly Insights</h2>

          {/* Month and Year Picker */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <input
              type="month"
              className="bg-[#d1cfc0] text-black px-4 py-2 rounded-md outline-none border border-black"
            />
            <button
              className="bg-[#1f1f1f] text-white px-6 py-2 rounded-md hover:bg-black transition-all"
            >
              Generate Insights
            </button>
          </div>

          {/* Temporary Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-[#d1cfc0] border border-black rounded-lg p-4 hover:scale-105 transition-transform">
              <p className="text-gray-600 text-sm">Total Expenses</p>
              <h3 className="text-xl font-bold">₹23,500</h3>
            </div>
            <div className="bg-[#d1cfc0] border border-black rounded-lg p-4 hover:scale-105 transition-transform">
              <p className="text-gray-600 text-sm">Most Frequent Category</p>
              <h3 className="text-xl font-bold">Food</h3>
            </div>
            <div className="bg-[#d1cfc0] border border-black rounded-lg p-4 hover:scale-105 transition-transform">
              <p className="text-gray-600 text-sm">Average per Day</p>
              <h3 className="text-xl font-bold">₹1,175</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart (no shadow) */}
      <div className="w-full h-[470px] bg-[#d1cfc0] rounded-lg p-2">
        <LineChart data={chartData} />
      </div>

      {/* Pie Chart + Table (same height) */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 h-[500px] bg-[#d1cfc0] rounded-lg p-4 ml-10 mt-8">
          <CategoryPieChart data={categoryData} />
        </div>
        <div className="flex-1 h-[400px] bg-[#d1cfc0] rounded-lg p-4 mr-13 mb-5">
          <TopExpensesTable expenses={expensesData} />
        </div>
      </div>
    </div>
  );
}
