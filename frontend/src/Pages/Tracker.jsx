import { useState, useEffect } from "react";
import { Button } from "../components/ui/TrackButton";

export default function Track() {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to view expenses.");
  }

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setExpenses(data);
      else console.error("Failed to fetch expenses:", data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async () => {
    if (!date || !amount || !category) {
      alert("Please fill in date, amount, and category");
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
        alert("Expense added successfully!");
        setDate("");
        setAmount("");
        setCategory("");
        setNote("");
        fetchExpenses(); // refresh list
      } else {
        alert(`Failed to add expense: ${data.message || data.error}`);
      }
    } catch (err) {
      console.error("Error submitting expense:", err);
      alert(`Error submitting expense: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#d1cfc0] min-h-screen text-black pt-0 px-10">
      {/* Tracker Form */}
      <div className="px-8 mt-6">
        <div className="max-w-full h-[100px] bg-[#1f1f1f] text-white rounded-lg flex items-center px-4 space-x-4 shadow-md">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-3 rounded-md outline-none"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-3 rounded-md outline-none w-52"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-3 rounded-md outline-none w-52"
          >
            <option value="">Category</option>
            <optgroup label="Essentials">
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Groceries">Groceries</option>
              <option value="Internet & More">Internet & More</option>
              <option value="Transportation">Transportation</option>
            </optgroup>
            <optgroup label="Food & Leisure">
              <option value="Restaurant">Restaurant</option>
              <option value="Snacks">Snacks</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Subscriptions">Subscriptions</option>
            </optgroup>
            <optgroup label="Personal & Lifestyle">
              <option value="Clothing">Clothing</option>
              <option value="Personal care">Personal care</option>
              <option value="Gym">Gym</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
            </optgroup>
            <optgroup label="Financial & Occasional">
              <option value="Insurance">Insurance</option>
              <option value="Investments">Investments</option>
              <option value="Savings">Savings</option>
              <option value="Gift">Gift</option>
              <option value="Donation">Donation</option>
              <option value="Vacation">Vacation</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </optgroup>
          </select>
          <input
            type="text"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-[#2b2b2b] text-white px-3 py-3 rounded-md outline-none flex-1"
          />
        </div>
        <div className="flex justify-center mt-4 w-full">
          <Button
            onClick={handleSubmit}
            className="w-40 text-black font-bold instrument-serif-regular text-2xl hover:bg-[brown] transition-all"
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="px-8 mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Expenses</h2>
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-[#1f1f1f] text-white">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b">
                <td className="px-4 py-2">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{exp.amount}</td>
                <td className="px-4 py-2">{exp.category}</td>
                <td className="px-4 py-2">{exp.note || "-"}</td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
