import { useEffect, useState } from "react";
import ExpenseTable from "../components/ExpenseTable";
import CapybaraLoader from "../components/capybara"; // Importing your new component
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function History() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthError(true);
          toast.error("You must be logged in to view expenses.");
          return;
        }

        const res = await fetch(
          "https://pennywise-tan.vercel.app/api/expenses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 401 || res.status === 403) {
          setAuthError(true);
          let data;
          try {
            data = await res.json();
          } catch {
            data = {};
          }
          toast.error(
            data.message ||
              data.error ||
              "Your session has expired. Please log in again."
          );
          return;
        }

        const data = await res.json();

        if (res.ok) {
          const sortedData = (data || []).sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setExpenses(sortedData);
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
        toast.error("Error fetching expenses.");
      } finally {
        // Adding a slight delay so the Capybara can actually be seen!
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await fetch(
        `https://pennywise-tan.vercel.app/api/expenses/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
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

  const handleExportPDF = () => {
    if (expenses.length === 0) {
      toast.error("No expenses to export.");
      return;
    }

    try {
      const doc = new jsPDF();
      const startDate = new Date(
        Math.min(...expenses.map((e) => new Date(e.date)))
      ).toLocaleDateString("en-GB");
      const endDate = new Date(
        Math.max(...expenses.map((e) => new Date(e.date)))
      ).toLocaleDateString("en-GB");

      doc.setFont("times", "italic");
      doc.setFontSize(28);
      doc.text("Pennywise - History of Expenses", 14, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`List of expenses dated from ${startDate} to ${endDate}.`, 14, 32);

      const tableData = expenses.map((e, i) => [
        i + 1,
        new Date(e.date).toLocaleDateString("en-GB"),
        `${e.amount}/-`,
        e.category,
        e.note || "-",
      ]);

      autoTable(doc, {
        startY: 40,
        head: [["S.No", "Date", "Amount", "Category", "Note"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
      });

      doc.save(`Pennywise_Expenses_${startDate}_to_${endDate}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF.");
    }
  };

  // --- NEW CAPYBARA LOADING STATE ---
  if (loading)
    return (
      <div className="bg-[#d1cfc0] min-h-[calc(100vh-64px)] flex flex-col justify-center items-center">
        <div className="-mt-20"> {/* Pulls the capybara up slightly to visually center it */}
          <CapybaraLoader />
          <p className="-mt-5 text-black font-medium animate-pulse text-center">
            {/* You can keep your page-specific text here */}
            Loading history...
          </p>
        </div>
      </div>
    );

  if (authError)
    return (
      <div className="bg-[#d1cfc0] min-h-screen flex justify-center items-center text-black text-lg sm:text-2xl text-center px-4">
        Please log in again to view your expenses.
      </div>
    );

  return (
    <div className="bg-[#d1cfc0] min-h-screen text-black pt-0 px-4 sm:px-10 text-left -mt-6 sm:-mt-8">
      <div className="px-2 sm:px-8 mt-2">
        <blockquote className="instrument-serif-regular mt-2 border-l-2 pl-3 sm:pl-4 text-lg sm:text-2xl text-black border-black leading-relaxed">
          Below is a detailed history of your expenses. You can use the search
          option to quickly find specific transactions, view spending patterns,
          or analyze your expenses by date, category, or amount.
        </blockquote>
      </div>

      <div className="overflow-x-auto mt-4">
        {expenses.length === 0 ? (
          <div className="text-center text-sm sm:text-base text-black py-6">
            You have not added any expenses yet. Start by adding your first
            expense to see it here.
          </div>
        ) : (
          <ExpenseTable expenses={expenses} onDelete={handleDelete} />
        )}
      </div>

      <div className="flex justify-center mt-6 sm:mt-8 pb-10 sm:pb-12">
        <button
          onClick={handleExportPDF}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-[#1f1f1f] text-white rounded-full font-medium text-sm sm:text-base hover:bg-black transition-all"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
}