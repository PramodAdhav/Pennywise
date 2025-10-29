import { useEffect, useState } from "react";
import LineChart from "../components/LineChart";
import CategoryPieChart from "../components/CategoryPieChart";
import TopExpensesTable from "../components/TopExpensesTable";

export default function Insights() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return alert("You must be logged in to view insights.");

        const res = await fetch("http://localhost:5000/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setExpenses(data);
        else alert(`Failed to load insights: ${data.message || data.error}`);
      } catch (err) {
        console.error(err);
        alert("Error fetching insights");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#d1cfc0] flex justify-center items-center text-gray-600 text-lg">
        Loading insights...
      </div>
    );

  if (expenses.length === 0)
    return (
      <div className="min-h-screen bg-[#d1cfc0] flex flex-col justify-center items-center text-gray-800 px-6 text-center">
        <div className="shadow-md border border-black rounded-2xl p-8 sm:p-10 max-w-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">No Expenses Found</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Start tracking expenses to view insights, trends, and breakdowns.
          </p>
          <button
            onClick={() => (window.location.href = "/track")}
            className="mt-6 px-6 py-2 bg-black text-white rounded-full font-medium hover:cursor-pointer transition"
          >
            Add Your First Expense
          </button>
        </div>
      </div>
    );

  // ----- Calculations -----
  const [year, month] = selectedMonth.split("-");
  const monthlyExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === +year && d.getMonth() + 1 === +month;
  });

  const daysInMonth = new Date(year, month, 0).getDate();
  const monthlyTotal = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
  const monthlyEntries = monthlyExpenses.length;
  const avgPerDay = Math.floor(monthlyTotal / daysInMonth || 0);
  const highestExpense = monthlyExpenses.reduce(
    (max, e) => (e.amount > max.amount ? e : max),
    { amount: 0, category: "" }
  );

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalEntries = expenses.length;
  const avgSpending = Math.floor(totalExpenses / totalEntries);

  const freqCategoryMap = {};
  expenses.forEach((e) => {
    freqCategoryMap[e.category] = (freqCategoryMap[e.category] || 0) + 1;
  });
  const mostFreqCategory = Object.entries(freqCategoryMap).sort((a, b) => b[1] - a[1])[0][0];

  const labels = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Daily Spending (₹)",
        data: labels.map((d) =>
          monthlyExpenses
            .filter((e) => new Date(e.date).toISOString().split("T")[0] === d)
            .reduce((sum, e) => sum + e.amount, 0)
        ),
        borderColor: "#000",
        backgroundColor: "rgba(0,0,0,0.05)",
        tension: 0.4,
      },
    ],
  };

  const categoryData = {};
  monthlyExpenses.forEach((e) => {
    categoryData[e.category] = (categoryData[e.category] || 0) + e.amount;
  });

  // ----- UI -----
  return (
    <div className="min-h-screen bg-[#d1cfc0] text-neutral-900 p-4 sm:p-8 space-y-10 font-[system-ui] -mt-8">
      {/* Summary */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <SummaryCard label="Total Spent" value={`₹${totalExpenses}`} />
        <SummaryCard label="Entries" value={totalEntries} />
        <SummaryCard label="Avg per Entry" value={`₹${avgSpending}`} />
        <SummaryCard label="Top Category" value={mostFreqCategory} />
      </section>

      {/* Monthly Section */}
      <section className="rounded-3xl shadow-sm p-4 sm:p-8 border border-black space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-medium">Monthly Overview</h2>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-black border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition text-sm sm:text-base"
          />
        </div>

        {/* Line Chart */}
        <div className="h-[250px] sm:h-[320px] w-full">
          <LineChart data={chartData} />
        </div>

        {/* Pie + Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Pie Chart */}
          <div className="h-[260px] sm:h-[320px] flex items-center justify-center">
            {Object.keys(categoryData).length > 0 ? (
              <CategoryPieChart data={categoryData} showLegend={false} />
            ) : (
              <p className="text-neutral-500 italic text-sm sm:text-base">
                Add expenses to see pie chart
              </p>
            )}
          </div>

          {/* Small Summary Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <SummaryCard label="Monthly Total" value={`₹${monthlyTotal}`} />
            <SummaryCard label="Entries" value={monthlyEntries} />
            <SummaryCard label="Avg per Day" value={`₹${avgPerDay}`} />
            <SummaryCard
              label="Highest Expense"
              value={`₹${highestExpense.amount}`}
              sub={highestExpense.category}
            />
          </div>
        </div>
      </section>

      {/* Table */}
      <TopExpensesTable expenses={expenses} />
    </div>
  );
}

// ---- Summary Card Component ----
function SummaryCard({ label, value, sub }) {
  return (
    <div className="shadow-sm border border-black rounded-2xl py-4 sm:py-6 px-2 sm:px-4 flex flex-col justify-center items-center hover:shadow-md transition-all duration-200 bg-[#dcdacb]">
      <p className="text-neutral-600 text-xs sm:text-sm">{label}</p>
      <h2 className="text-2xl sm:text-3xl font-semibold mt-1">{value}</h2>
      {sub && <p className="text-neutral-500 text-xs sm:text-sm mt-1">{sub}</p>}
    </div>
  );
}
