import { useState, useEffect } from "react";
import { Button } from "../components/ui/TrackButton";
import { toast } from "sonner";

export default function Track() {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token");
  if (!token) toast.error("You must be logged in to view expenses.");

  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://pennywise-tan.vercel.app/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        const sorted = data.sort((a, b) => b.id - a.id);
        setExpenses(sorted.slice(0, 5));
      } else {
        console.error("Failed to fetch expenses:", data);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async () => {
    if (!date || !amount || !category) {
      toast.error("Please fill in date, amount, and category");
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid positive number for amount");
      return;
    }

    try {
      const res = await fetch("http://pennywise-tan.vercel.app/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          amount: numAmount,
          category,
          note,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Expense added successfully!");
        setDate("");
        setAmount("");
        setCategory("");
        setNote("");
        fetchExpenses();
      } else {
        toast.error(`Failed to add expense: ${data.message || data.error}`);
      }
    } catch (err) {
      console.error("Error submitting expense:", err);
    }
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  };

  return (
    <div className="bg-[#d1cfc0] min-h-screen text-black flex flex-col -mt-8 sm:-mt-10 items-center py-6 px-3 sm:px-6">
      {/* Add Expense Card */}
      <div className="bg-[#1f1f1f] text-white p-5 sm:p-8 shadow-lg w-full sm:w-[80%] mb-4 rounded">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-2 sm:py-3 w-full rounded outline-none text-sm sm:text-base"
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="Amount"
            value={amount}
            onChange={handleAmountChange}
            className="bg-[#2b2b2b] text-white px-3 py-2 sm:py-3 w-full rounded outline-none text-sm sm:text-base"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-2 sm:py-3 w-full rounded outline-none text-sm sm:text-base"
          >
            <option value="">Category</option>
            <option>Groceries</option>
            <option>Food</option>
            <option>Rent</option>
            <option>Transportation</option>
            <option>Utilities</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Education</option>
            <option>Shopping</option>
            <option>Subscriptions</option>
            <option>Miscellaneous</option>
          </select>
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-2 sm:py-3 w-full rounded outline-none text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="mb-8 sm:mb-10">
        <Button
          onClick={handleSubmit}
          className="w-40 sm:w-48 text-black text-lg sm:text-xl transition-all cursor-default hover:cursor-pointer"
        >
          Add Expense
        </Button>
      </div>

      {/* Recent Expenses */}
      <div className="bg-[#d1cfc0] p-4 sm:p-6 w-full sm:w-[80%] mt-4 sm:mt-6 overflow-x-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-left">
          Recent Expenses
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-black border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-[#1F1F1F] text-white text-left border border-black">
                <th className="px-3 sm:px-4 py-2 sm:py-3 border border-black">
                  Date
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 border border-black">
                  Amount
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 border border-black">
                  Category
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 border border-black">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr
                  key={exp.id}
                  className="border border-black hover:bg-gray-200 transition-all"
                >
                  <td className="px-3 sm:px-4 py-2 border border-black">
                    {new Date(exp.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-3 sm:px-4 py-2 border border-black">
                    ₹{exp.amount}
                  </td>
                  <td className="px-3 sm:px-4 py-2 border border-black">
                    {exp.category}
                  </td>
                  <td className="px-3 sm:px-4 py-2 border border-black">
                    {exp.note || "-"}
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-3 sm:py-4 border border-black"
                  >
                    No expenses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
