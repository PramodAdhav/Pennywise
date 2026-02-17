import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CheckCircle, Trash2 } from "lucide-react";
import CapybaraLoader from "../components/capybara"; // Import your new loader

export default function DebtLend() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
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
        if (!token) {
          setAuthError(true);
          toast.error("Please login again.");
          return;
        }

        const res = await fetch("https://pennywise-tan.vercel.app/api/debtlend", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          setAuthError(true);
          let data;
          try { data = await res.json(); } catch { data = {}; }
          toast.error(data.message || data.error || "Your session has expired. Please log in again.");
          return;
        }

        let data;
        try { data = await res.json(); } catch (e) { data = []; }

        if (res.ok) {
          setRecords(Array.isArray(data) ? data : []);
        } else {
          toast.error(data.message || data.error || "Failed to load Debt/Lend data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load Debt/Lend data");
      } finally {
        // Syncing delay with History and Insights for a smooth feel
        setTimeout(() => setLoading(false), 800);
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

      const res = await fetch("https://pennywise-tan.vercel.app/api/debtlend", {
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
        setForm({ personOfInterest: "", date: "", amount: "", note: "", type: "Debt" });
      } else {
        toast.error(data.message || "Failed to add record");
      }
    } catch (err) {
      toast.error("Error adding record");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Unauthorized");

      const res = await fetch(`https://pennywise-tan.vercel.app/api/debtlend/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
        toast.success("Status updated!");
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://pennywise-tan.vercel.app/api/debtlend/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        toast.success("Record deleted!");
      }
    } catch (err) { toast.error("Error deleting record"); }
  };

  const calculateSums = (items) => {
    return items.reduce((acc, curr) => {
      const amt = parseFloat(curr.amount) || 0;
      acc.total += amt;
      if (curr.status === "cleared") acc.cleared += amt;
      else acc.uncleared += amt;
      return acc;
    }, { total: 0, cleared: 0, uncleared: 0 });
  };

  const debts = records.filter((r) => r.type === "Debt");
  const lends = records.filter((r) => r.type === "Lend");

  const debtSums = calculateSums(debts);
  const lendSums = calculateSums(lends);

  const SummaryStats = ({ stats, type }) => (
    <div className="flex justify-between gap-2 mb-6">
      <div className="flex-1 bg-[#d1cfc0] text-black rounded-xl p-2 text-center border border-black">
        <p className="text-[9px] uppercase font-bold opacity-70">Total {type}</p>
        <p className="text-sm sm:text-base font-bold">₹{stats.total.toLocaleString()}</p>
      </div>
      <div className="flex-1 bg-[#d1cfc0] text-green-700 rounded-xl p-2 text-center border border-black">
        <p className="text-[9px] uppercase font-bold opacity-70">Cleared</p>
        <p className="text-sm sm:text-base font-bold">₹{stats.cleared.toLocaleString()}</p>
      </div>
      <div className="flex-1 bg-[#d1cfc0] text-red-600 rounded-xl p-2 text-center border border-black">
        <p className="text-[9px] uppercase font-bold opacity-70">Due</p>
        <p className="text-sm sm:text-base font-bold">₹{stats.uncleared.toLocaleString()}</p>
      </div>
    </div>
  );

  // --- CAPYBARA LOADING STATE ---
  if (loading)
    return (
      <div className="bg-[#d1cfc0] min-h-[calc(100vh-64px)] flex flex-col justify-center items-center">
        <div className="-mt-45"> {/* Pulls the capybara up slightly to visually center it */}
          <CapybaraLoader />
          <p className="-mt-5 text-black font-medium animate-pulse text-center">
            Balancing your books...
          </p>
        </div>
      </div>
    );
  if (authError) return (
    <div className="bg-[#d1cfc0] min-h-screen flex flex-col justify-center items-center">
      <div className="border border-black rounded-2xl p-10 max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2">Session Required</h2>
        <button onClick={() => (window.location.href = "/login")} className="mt-6 px-6 py-2 bg-black text-white rounded-full transition">Go to Login</button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#d1cfc0] min-h-screen text-black px-4 sm:px-8 py-8 sm:py-10">
      {/* Form Section */}
      <div className="bg-[#1f1f1f] -mt-16 sm:-mt-20 shadow-md rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto mb-8 sm:mb-10 border border-black">
        <h2 className="text-lg text-white font-semibold mb-4">Add New Record</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" name="personOfInterest" value={form.personOfInterest} onChange={handleChange} placeholder="Person" className="text-white bg-[#2b2b2b] rounded-lg p-2 text-sm" />
          <input type="date" name="date" value={form.date} onChange={handleChange} className="text-white bg-[#2b2b2b] rounded-lg p-2 text-sm" />
          <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" className="text-white bg-[#2b2b2b] rounded-lg p-2 text-sm" />
          <select name="type" value={form.type} onChange={handleChange} className="text-white bg-[#2b2b2b] rounded-lg p-2 text-sm">
            <option value="Debt">Debt</option>
            <option value="Lend">Lend</option>
          </select>
        </div>
        <textarea name="note" value={form.note} onChange={handleChange} placeholder="Note" className="text-white bg-[#2b2b2b] rounded-lg p-2 text-sm w-full mt-3"></textarea>
        <div className="text-center mt-4">
          <button onClick={handleAdd} className="px-6 py-2 bg-white text-black rounded-full text-sm">Add Record</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Debt Card */}
        <div className="border border-black rounded-2xl shadow-md p-4 sm:p-6 flex flex-col">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Debts</h2>
          <SummaryStats stats={debtSums} type="Debt" />
          {debts.length === 0 ? <p className="text-gray-600 text-sm">No debts recorded.</p> : (
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <ul className="space-y-4">
                {debts.map((r) => (
                  <li key={r.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-black/20 pb-3">
                    <div className="flex items-start space-x-3">
                      {r.status === "cleared" && <CheckCircle className="text-green-600 w-5 h-5 mt-1" />}
                      <div>
                        <p className="font-medium text-sm sm:text-base">{r.personOfInterest}</p>
                        <p className="text-xs text-black opacity-70">₹{r.amount} — {new Date(r.date).toLocaleDateString("en-GB")}</p>
                        <p className="text-xs text-black italic">{r.note}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-end mt-2 sm:mt-0">
                      <select value={r.status} onChange={(e) => handleStatusChange(r.id, e.target.value)} className="border border-black text-black rounded-md p-1 text-xs">
                        <option value="uncleared">Uncleared</option>
                        <option value="cleared">Cleared</option>
                      </select>
                      <Trash2 className="w-4 h-4 text-red-600 cursor-pointer" onClick={() => handleDelete(r.id)} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Lend Card */}
        <div className="border border-black rounded-2xl shadow-md p-4 sm:p-6 flex flex-col">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Lends</h2>
          <SummaryStats stats={lendSums} type="Lend" />
          {lends.length === 0 ? <p className="text-gray-600 text-sm">No lends recorded.</p> : (
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <ul className="space-y-4">
                {lends.map((r) => (
                  <li key={r.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-black/20 pb-3">
                    <div className="flex items-start space-x-3">
                      {r.status === "cleared" && <CheckCircle className="text-green-600 w-5 h-5 mt-1" />}
                      <div>
                        <p className="font-medium text-sm sm:text-base">{r.personOfInterest}</p>
                        <p className="text-xs text-black opacity-70">₹{r.amount} — {new Date(r.date).toLocaleDateString("en-GB")}</p>
                        <p className="text-xs text-black italic">{r.note}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-end mt-2 sm:mt-0">
                      <select value={r.status} onChange={(e) => handleStatusChange(r.id, e.target.value)} className="border border-black text-black rounded-md p-1 text-xs">
                        <option value="uncleared">Uncleared</option>
                        <option value="cleared">Cleared</option>
                      </select>
                      <Trash2 className="w-4 h-4 text-red-600 cursor-pointer" onClick={() => handleDelete(r.id)} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}