import { useState, useEffect } from "react";
import { Button } from "../components/ui/TrackButton";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Track() {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token");
  if (!token) toast.error("You must be logged in to view expenses.")

  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/expenses", {
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

    try {
      const res = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          amount: parseFloat(amount),
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

  return (
    <div className="bg-[#d1cfc0] min-h-screen text-black flex flex-col items-center py-6">
      <div className="px-1 w-[80%]">
        <blockquote className="instrument-serif-regular -mt-10 mb-7 border-l-2 pl-4 text-2xl text-black text-left border-black">
          Below is a detailed history of your expenses. You can use the search
          option to quickly find specific transactions, view spending patterns,
          or analyze your expenses by date, category, or amount.
        </blockquote>
      </div>
      {/* Add Expense Card */}
      <div className="bg-[#1f1f1f] text-white p-8 shadow-lg w-[80%] mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-3 w-full outline-none"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-3 w-full outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-3 w-full outline-none"
          >
            <option value="">Category</option>
            <optgroup label="Essentials">
              <option>Rent</option>
              <option>Utilities</option>
              <option>Groceries</option>
              <option>Transportation</option>
            </optgroup>
            <optgroup label="Leisure">
              <option>Restaurant</option>
              <option>Entertainment</option>
              <option>Subscriptions</option>
            </optgroup>
            <optgroup label="Personal">
              <option>Health</option>
              <option>Gym</option>
              <option>Education</option>
              <option>Miscellaneous</option>
            </optgroup>
          </select>
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-3 w-full outline-none"
          />
        </div>
      </div>

      {/* Add Expense Button - closer to card */}
      <div className="mb-10">
        <Button
          onClick={handleSubmit}
          className="w-48 text-black font-bold text-xl transition-all cursor-default hover:cursor-pointer"
        >
          Add Expense
        </Button>
      </div>

      {/* Recent Expenses Section */}
      

      <div className="bg-[#d1cfc0] p-6 w-[80%] mt-6">
        <h2 className="text-3xl font-semibold mb-6 text-left">Recent Expenses</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-black border-collapse">
            <thead>
              <tr className="bg-[#1f1f1f] text-white text-left border border-black">
                <th className="px-4 py-3 border border-black">Date</th>
                <th className="px-4 py-3 border border-black">Amount (₹)</th>
                <th className="px-4 py-3 border border-black">Category</th>
                <th className="px-4 py-3 border border-black">Note</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr
                  key={exp.id}
                  className="border border-black hover:bg-gray-200 transition-all"
                >
                  <td className="px-4 py-2 border border-black">
                    {new Date(exp.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-2 border border-black">₹{exp.amount}</td>
                  <td className="px-4 py-2 border border-black">{exp.category}</td>
                  <td className="px-4 py-2 border border-black">{exp.note || "-"}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 border border-black">
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
