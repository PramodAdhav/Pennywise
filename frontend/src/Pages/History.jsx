import { useEffect, useState } from "react";
import ExpenseTable from "../components/ExpenseTable";
import { toast } from "sonner";

export default function History() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view expenses.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          // Sort newest first
          const sortedData = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setExpenses(sortedData);
        } else {
          toast.error(`Failed to load expenses: ${data.message || data.error}`);
          console.error("Backend error:", data);
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
        toast.error(`Error fetching expenses: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Delete expense handler
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        // Remove deleted expense from state immediately
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
        toast.success(data.message || "Expense deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete expense");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting expense");
    }
  };

  if (loading)
    return (
      <div className="bg-[#d1cfc0] min-h-screen flex justify-center items-center text-black text-2xl">
        Loading your expenses...
      </div>
    );

  return (
    <div className="bg-[#d1cfc0] min-h-screen text-black pt-0 px-10 text-left -mt-8">
      <div className="px-8">
        <blockquote className="instrument-serif-regular mt-1 border-l-2 pl-4 text-2xl text-black text-left border-black">
          Below is a detailed history of your expenses. You can use the search
          option to quickly find specific transactions, view spending patterns,
          or analyze your expenses by date, category, or amount.
        </blockquote>
      </div>

      {/* Pass handleDelete as onDelete prop */}
      <ExpenseTable expenses={expenses} onDelete={handleDelete} />
    </div>
  );
}
