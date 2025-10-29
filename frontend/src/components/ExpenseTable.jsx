import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function ExpenseTable({ expenses, onDelete }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Search logic
  const filteredExpenses = expenses.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.date.toLowerCase().includes(term) ||
      item.amount.toString().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.note.toLowerCase().includes(term)
    );
  });

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Default delete if onDelete not passed
  const handleDelete = async (id) => {
    if (onDelete) return onDelete(id);

    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");

    try {
      const res = await fetch(`http://pennywise-gray-iota.vercel.app/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Expense deleted successfully");
      } else {
        alert(data.message || "Failed to delete expense");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting expense");
    }
  };

  return (
    <div className="p-6">
      {/* Search box */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by date, amount, category, or note..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-400 rounded-md text-black w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
      </div>

      {/* Expense Table */}
      <table className="min-w-full bg-[#d1cfc0] text-black rounded-lg shadow-lg border border-black overflow-hidden">
        <thead className="bg-[#bcb9ac] text-left">
          <tr>
            <th className="py-3 px-3">Date</th>
            <th className="py-3 px-3">Amount</th>
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3">Note</th>
            <th className="py-3 px-2 w-16 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentExpenses.length > 0 ? (
            currentExpenses.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 hover:bg-[#c9c7ba] transition"
              >
                <td className="px-3">{new Date(item.date).toLocaleDateString("en-GB")}</td>
                <td className="py-3 px-3">₹{item.amount}</td>
                <td className="py-3 px-3">{item.category}</td>
                <td className="py-3 px-6">{item.note?.trim() ? item.note : "-"}</td>
                <td className="py-3 px-2 text-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 transition cursor-default hover:cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-600">
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600"
        >
          Prev
        </button>
        <span className="text-black font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
