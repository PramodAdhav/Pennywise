export default function TotalExpensesCard({ total }) {
  return (
    <div className="bg-[#f1f1f1] text-black rounded-lg p-4 w-60 shadow-md flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-sm font-semibold">Total Expenses</h3>
        <p className="text-2xl font-bold mt-1">₹{total}</p>
      </div>
    </div>
  );
}
