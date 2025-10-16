// components/TopExpensesTable.jsx
export default function TopExpensesTable({ expenses }) {
  // Sort by amount descending and take top 10
  const topExpenses = [...expenses]
    .sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
    .slice(0, 10);

  return (
    <div className="w-full bg-[#d1cfc0] rounded-lg shadow-md p-4 mt-6 border border-black">
      <h2 className="text-xl font-bold mb-4">Top Expenses</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Amount (₹)</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Note</th>
          </tr>
        </thead>
        <tbody>
          {topExpenses.map((exp, index) => (
            <tr key={index} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{exp.date}</td>
              <td className="py-2 px-4">{exp.amount}</td>
              <td className="py-2 px-4">{exp.category}</td>
              <td className="py-2 px-4">{exp.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
