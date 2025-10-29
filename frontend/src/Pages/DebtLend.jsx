import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CheckCircle, Trash2 } from "lucide-react";

export default function DebtLend() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    personOfInterest: "",
    date: "",
    amount: "",
    note: "",
    type: "Debt",
  });

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return toast.error("Please login again.");

        const res = await fetch("http://pennywise-gray-iota.vercel.app/api/debtlend", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) setRecords(data);
        else toast.error(data.message || "Failed to load Debt/Lend data");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load Debt/Lend data");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!form.personOfInterest || !form.amount || !form.date)
      return toast.error("Please fill all required fields.");

    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Unauthorized.");

      const res = await fetch("http://pennywise-gray-iota.vercel.app/api/debtlend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setRecords((prev) => [data, ...prev]);
        toast.success(`${form.type} added successfully!`);
        setForm({
          personOfInterest: "",
          date: "",
          amount: "",
          note: "",
          type: "Debt",
        });
      } else {
        toast.error(data.message || "Failed to add record");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding record");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Unauthorized");

      const res = await fetch(`http://pennywise-gray-iota.vercel.app/api/debtlend/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setRecords((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        toast.success("Status updated!");
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Unauthorized.");

      const res = await fetch(`http://pennywise-gray-iota.vercel.app/api/debtlend/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        toast.success("Record deleted successfully!");
      } else {
        toast.error("Failed to delete record");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting record");
    }
  };

  const debts = records.filter((r) => r.type === "Debt");
  const lends = records.filter((r) => r.type === "Lend");

  if (loading)
    return (
      <div className="bg-[#d1cfc0] min-h-screen flex justify-center items-center text-black text-xl sm:text-2xl text-center px-4">
        Loading your records...
      </div>
    );

  return (
    <div className="bg-[#d1cfc0] min-h-screen text-black px-4 sm:px-8 py-8 sm:py-10">
      {/* Add Form */}
      <div className="bg-[#1f1f1f] -mt-16 sm:-mt-20 shadow-md rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto mb-8 sm:mb-10 border border-black">
        <h2 className="text-lg sm:text-xl text-white font-semibold mb-4 text-center sm:text-left">
          Add New Record
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input
            type="text"
            name="personOfInterest"
            value={form.personOfInterest}
            onChange={handleChange}
            placeholder="Person of Interest"
            className="text-white bg-[#2b2b2b] rounded-lg p-2 text-sm sm:text-base w-full"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="text-white bg-[#2b2b2b] rounded-lg p-2 text-sm sm:text-base w-full"
          />
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="text-white bg-[#2b2b2b] rounded-lg p-2 text-sm sm:text-base w-full"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="text-white bg-[#2b2b2b] rounded-lg p-2 text-sm sm:text-base w-full"
          >
            <option value="Debt">Debt</option>
            <option value="Lend">Lend</option>
          </select>
        </div>

        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Note"
          className="text-white bg-[#2b2b2b] rounded-lg p-2 text-sm sm:text-base w-full mt-3 sm:mt-4"
        ></textarea>

        <div className="text-center mt-5 sm:mt-6">
          <button
            onClick={handleAdd}
            className="px-5 sm:px-6 py-2 bg-white text-black rounded-full hover:bg-white hover:cursor-pointer transition-all text-sm sm:text-base"
          >
            Add Record
          </button>
        </div>
      </div>

      {/* Debt / Lend Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Debt Card */}
        <div className="border border-black rounded-2xl shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Debts</h2>
          {debts.length === 0 ? (
            <p className="text-gray-600 text-sm sm:text-base">No debts recorded yet.</p>
          ) : (
            <ul className="space-y-3 sm:space-y-4">
              {debts.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-black pb-2 sm:pb-3"
                >
                  <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
                    {r.status === "cleared" && (
                      <CheckCircle className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-0" />
                    )}
                    <div>
                      <p className="font-medium text-black text-sm sm:text-base">
                        {r.personOfInterest}
                      </p>
                      <p className="text-xs sm:text-sm text-black">
                        ₹{r.amount} — {new Date(r.date).toLocaleDateString("en-GB")}
                      </p>
                      <p className="text-xs sm:text-sm text-black break-words">{r.note}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                      className="border border-black text-black rounded-md p-1 text-xs sm:text-sm"
                    >
                      <option value="uncleared">Uncleared</option>
                      <option value="cleared">Cleared</option>
                    </select>
                    <Trash2
                      className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 hover:text-red-800 cursor-pointer"
                      onClick={() => handleDelete(r.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Lend Card */}
        <div className="border border-black rounded-2xl shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Lends</h2>
          {lends.length === 0 ? (
            <p className="text-gray-600 text-sm sm:text-base">No lends recorded yet.</p>
          ) : (
            <ul className="space-y-3 sm:space-y-4">
              {lends.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-black pb-2 sm:pb-3"
                >
                  <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
                    {r.status === "cleared" && (
                      <CheckCircle className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-0" />
                    )}
                    <div>
                      <p className="font-medium text-black text-sm sm:text-base">
                        {r.personOfInterest}
                      </p>
                      <p className="text-xs sm:text-sm text-black">
                        ₹{r.amount} — {new Date(r.date).toLocaleDateString("en-GB")}
                      </p>
                      <p className="text-xs sm:text-sm text-black break-words">{r.note}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                      className="border border-black text-black rounded-md p-1 text-xs sm:text-sm"
                    >
                      <option value="uncleared">Uncleared</option>
                      <option value="cleared">Cleared</option>
                    </select>
                    <Trash2
                      className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 hover:text-red-800 cursor-pointer"
                      onClick={() => handleDelete(r.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
