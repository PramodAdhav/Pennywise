import { useEffect, useState } from "react";
import LineChart from "../components/LineChart";
import CategoryPieChart from "../components/CategoryPieChart";
import TopExpensesTable from "../components/TopExpensesTable";
import CapybaraLoader from "../components/capybara"; // Import the loader

export default function Insights() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthError(true);
          return;
        }

        const res = await fetch("https://pennywise-tan.vercel.app/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          setAuthError(true);
          return;
        }

        let data;
        try {
          data = await res.json();
        } catch (e) {
          console.error("Failed to parse insights JSON:", e);
          data = [];
        }

        if (res.ok) {
          setExpenses(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching insights:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchExpenses();
  }, []);

  // --- Capybara Loading View ---
  if (loading)
    return (
      <div className="bg-[#d1cfc0] min-h-[calc(100vh-64px)] flex flex-col justify-center items-center">
        <div className="-mt-20">
          <CapybaraLoader />
          <p className="-mt-5 text-black font-medium animate-pulse text-center">
            Analysing your spendings...
          </p>
        </div>
      </div>
    );

  if (authError)
    return (
      <div className="min-h-screen bg-[#d1cfc0] flex flex-col justify-center items-center text-gray-800 px-6 text-center">
        <div className="shadow-md border border-black rounded-2xl p-8 sm:p-10 max-w-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Session Required</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Please log in again to view your spending insights.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-6 px-6 py-2 bg-black text-white rounded-full font-medium hover:cursor-pointer transition"
          >
            Go to Login
          </button>
        </div>
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
  const monthlyTotal = monthlyExpenses.reduce((s, e) => s + e.amount, 0).toFixed(2);
  const monthlyEntries = monthlyExpenses.length;
  const avgPerDay = Math.floor(monthlyTotal / daysInMonth || 0);
  const highestExpense = monthlyExpenses.reduce(
    (max, e) => (e.amount > max.amount ? e : max),
    { amount: 0, category: "" }
  );

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0).toFixed(2);
  const totalEntries = expenses.length;
  const avgSpending = totalEntries > 0 ? Math.floor(totalExpenses / totalEntries) : 0;

  const freqCategoryMap = {};
  expenses.forEach((e) => {
    freqCategoryMap[e.category] = (freqCategoryMap[e.category] || 0) + 1;
  });
  const mostFreqCategory =
    Object.entries(freqCategoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  // Monthly Aggregation for new section
  const monthlyAggregates = expenses.reduce((acc, e) => {
    const monthKey = e.date.substring(0, 7);
    acc[monthKey] = (acc[monthKey] || 0) + e.amount;
    return acc;
  }, {});
  const sortedMonths = Object.entries(monthlyAggregates).sort((a, b) => new Date(b[0]) - new Date(a[0]));

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

  return (
    <div className="min-h-screen bg-[#d1cfc0] text-neutral-900 p-4 sm:p-8 space-y-10 font-[system-ui] -mt-8">
      {/* Summary Section */}
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

        <div className="h-[250px] sm:h-[320px] w-full">
          <LineChart data={chartData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="h-[260px] sm:h-[320px] flex items-center justify-center">
            {Object.keys(categoryData).length > 0 ? (
              <CategoryPieChart data={categoryData} showLegend={false} />
            ) : (
              <p className="text-neutral-500 italic text-sm sm:text-base">Add expenses to see pie chart</p>
            )}
          </div>

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

      <TopExpensesTable expenses={expenses} />

      {/* New Monthly Breakdown Section */}
      {/* Monthly Breakdown Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
        <div className="border border-black rounded-3xl p-6 bg-[#dcdacb]">
          <h3 className="text-xl font-semibold mb-4">Monthly Breakdown</h3>
          {/* This container sets the scrollable area */}
          <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#dcdacb]">
                <tr className="border-b border-black">
                  <th className="py-2 text-sm">Month</th>
                  <th className="py-2 text-sm text-right">Total Expenses</th>
                </tr>
              </thead>
              <tbody>
                {sortedMonths.map(([month, total]) => {
                  const date = new Date(month + "-01");
                  
                  // Format as Month, YYYY
                  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
                  const yearName = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(date);
                  const formattedMonth = `${monthName}, ${yearName}`;

                  return (
                    <tr key={month} className="border-b border-black/10">
                      <td className="py-3 text-sm">{formattedMonth}</td>
                      <td className="py-3 text-sm text-right">₹{total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-black rounded-3xl p-6 bg-[#dcdacb] flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-semibold mb-2">Savings Trend</h3>
          <p className="text-neutral-600 text-sm">
            Visualizing your financial health over time.
          </p>
          
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, sub }) {
  return (
    <div className="shadow-sm border border-black rounded-2xl py-4 sm:py-6 px-2 sm:px-4 flex flex-col justify-center items-center hover:shadow-md transition-all duration-200 bg-[#dcdacb]">
      <p className="text-neutral-600 text-xs sm:text-sm">{label}</p>
      <h2 className="text-2xl sm:text-3xl font-semibold mt-1">{value}</h2>
      {sub && <p className="text-neutral-500 text-xs sm:text-sm mt-1">{sub}</p>}
    </div>
  );
}