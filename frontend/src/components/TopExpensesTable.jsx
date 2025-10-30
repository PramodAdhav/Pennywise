
export default function TopExpensesTable({ expenses }) {
  const topExpenses = [...expenses]
    .sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
    .slice(0, 10);

  return (
    <div className="w-full bg-[#d1cfc0] rounded-2xl shadow-md p-4 sm:p-6 mt-6 border border-black overflow-x-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
        Top Expenses (All Time)
      </h2>

      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b text-sm sm:text-base">
            <th className="py-2 px-3 sm:px-4">Date</th>
            <th className="py-2 px-3 sm:px-4">Amount</th>
            <th className="py-2 px-3 sm:px-4">Category</th>
            <th className="py-2 px-3 sm:px-4">Note</th>
          </tr>
        </thead>
        <tbody>
          {topExpenses.map((exp, index) => (
            <tr
              key={index}
              className="border-b hover:bg-[#c4c2b4]/50 transition-colors text-sm sm:text-base"
            >
              <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                {new Date(exp.date).toLocaleDateString("en-GB")}
              </td>
              <td className="py-2 px-3 sm:px-4 whitespace-nowrap">
                ₹{exp.amount}
              </td>
              <td className="py-2 px-3 sm:px-4">{exp.category}</td>
              <td className="py-2 px-3 sm:px-4 max-w-[150px] truncate">
                {exp.note || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
