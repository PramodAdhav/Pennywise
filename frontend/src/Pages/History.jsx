import { useEffect, useState } from "react";
import ExpenseTable from "../components/ExpenseTable";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

        const res = await fetch("https://pennywise-tan.vercel.app/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          const sortedData = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setExpenses(sortedData);
        } else {
          toast.error(`Failed to load expenses: ${data.message || data.error}`);
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

  // ---- Delete handler ----
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await fetch(`https://pennywise-tan.vercel.app/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // ---- Export PDF ----
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

      // Title
      doc.setFont("times", "italic");
      doc.setFontSize(28);
      doc.text("Pennywise - History of Expenses", 14, 20);

      // Subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`List of expenses dated from ${startDate} to ${endDate}.`, 14, 32);

      // Prepare table data
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
      console.error("PDF generation failed:", err);
      toast.error("Failed to export PDF.");
    }
  };

  if (loading)
    return (
      <div className="bg-[#d1cfc0] min-h-screen flex justify-center items-center text-black text-lg sm:text-2xl text-center px-4">
        Loading your expenses...
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

      {/* Expense Table */}
      <div className="overflow-x-auto mt-4">
        <ExpenseTable expenses={expenses} onDelete={handleDelete} />
      </div>

      {/* Export Button */}
      <div className="flex justify-center mt-6 sm:mt-8 pb-10 sm:pb-12">
        <button
          onClick={handleExportPDF}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-[#1f1f1f] text-white rounded-full font-medium text-sm sm:text-base cursor-default hover:cursor-pointer transition-all"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
}
