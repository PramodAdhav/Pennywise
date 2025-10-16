export default function TotalExpensesCard({ total }) {
  return (
    <div className="flex-1 h-[120px] bg-[#d1cfc0] border border-black text-black rounded-lg p-4 flex items-center justify-center transition-transform transform hover:scale-105">
      <div className="text-center">
        <h3 className="text-gray-500 text-sm font-semibold">Total Expenses</h3>
        <p className="text-2xl font-bold mt-1">₹{total}</p>
      </div>
    </div>
  );
}
