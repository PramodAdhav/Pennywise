import ExpenseTable from "../components/ExpenseTable";



const dummyExpenses = [
  { date: "2025-10-01", amount: "₹450", category: "Food", note: "Lunch with friends" },
  { date: "2025-10-02", amount: "₹1200", category: "Travel", note: "Cab to office" },
  { date: "2025-10-03", amount: "₹300", category: "Groceries", note: "Snacks and fruits" },
  { date: "2025-10-04", amount: "₹1500", category: "Shopping", note: "New shoes" },
  { date: "2025-10-05", amount: "₹90", category: "Food", note: "Tea and samosa" },
  { date: "2025-10-06", amount: "₹2500", category: "Bills", note: "Electricity bill" },
  { date: "2025-10-07", amount: "₹1100", category: "Health", note: "Doctor visit" },
  { date: "2025-10-08", amount: "₹200", category: "Entertainment", note: "Movie ticket" },
  { date: "2025-10-09", amount: "₹800", category: "Transport", note: "Train tickets" },
  { date: "2025-10-10", amount: "₹650", category: "Groceries", note: "Vegetables and fruits" },
  { date: "2025-10-11", amount: "₹5000", category: "Rent", note: "Monthly apartment rent" },
  { date: "2025-10-12", amount: "₹320", category: "Food", note: "Dinner outside" },
  { date: "2025-10-13", amount: "₹700", category: "Subscriptions", note: "Netflix renewal" },
  { date: "2025-10-14", amount: "₹150", category: "Transport", note: "Auto fare" },
  { date: "2025-10-15", amount: "₹1300", category: "Health", note: "Pharmacy medicines" },
  { date: "2025-10-16", amount: "₹1800", category: "Shopping", note: "New jacket" },
  { date: "2025-10-17", amount: "₹400", category: "Food", note: "Office canteen" },
  { date: "2025-10-18", amount: "₹2300", category: "Bills", note: "Internet and phone" },
  { date: "2025-10-19", amount: "₹900", category: "Travel", note: "Bus pass" },
  { date: "2025-10-20", amount: "₹100", category: "Food", note: "Evening snacks" },
  { date: "2025-10-21", amount: "₹450", category: "Entertainment", note: "Arcade games" },
  { date: "2025-10-22", amount: "₹600", category: "Groceries", note: "Weekly essentials" },
  { date: "2025-10-23", amount: "₹2400", category: "Bills", note: "Credit card payment" },
  { date: "2025-10-24", amount: "₹950", category: "Shopping", note: "New shirt" },
  { date: "2025-10-25", amount: "₹180", category: "Transport", note: "Fuel refill" },
  { date: "2025-10-26", amount: "₹250", category: "Food", note: "Breakfast cafe" },
  { date: "2025-10-27", amount: "₹4000", category: "Rent", note: "Hostel fees" },
  { date: "2025-10-28", amount: "₹130", category: "Health", note: "Painkillers" },
  { date: "2025-10-29", amount: "₹700", category: "Groceries", note: "Weekend shopping" },
  { date: "2025-10-30", amount: "₹120", category: "Food", note: "Coffee and sandwich" },
  { date: "2025-11-01", amount: "₹950", category: "Travel", note: "Outstation trip" },
  { date: "2025-11-02", amount: "₹500", category: "Bills", note: "Water bill" },
  { date: "2025-11-03", amount: "₹300", category: "Entertainment", note: "OTT subscription" },
  { date: "2025-11-04", amount: "₹1600", category: "Shopping", note: "Headphones" },
  { date: "2025-11-05", amount: "₹220", category: "Food", note: "Dinner outside" },
  { date: "2025-11-06", amount: "₹2800", category: "Health", note: "Gym membership" },
  { date: "2025-11-07", amount: "₹800", category: "Transport", note: "Cab to airport" },
  { date: "2025-11-08", amount: "₹400", category: "Groceries", note: "Milk and eggs" },
  { date: "2025-11-09", amount: "₹210", category: "Food", note: "Quick snack" },
  { date: "2025-11-10", amount: "₹3100", category: "Bills", note: "Loan EMI" }
];


export default function History() {
  return (
    <div className="bg-[#d1cfc0] min-h-screen text-black pt-0 px-10 text-left">
      <div className="px-8">
        <blockquote className="mt-1 border-l-2 pl-6 italic text-2xl text-black text-left">
          Below is a detailed history of your expenses. You can use the search option to quickly find 
          specific transactions, view spending patterns, or analyze your expenses by date, category, or amount.
        </blockquote>
      </div>
    <ExpenseTable expenses={dummyExpenses} />
    </div>
  );
}
