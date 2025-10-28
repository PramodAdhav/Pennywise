import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [expensesByDate, setExpensesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You must be logged in to view calendar expenses.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          const totalsByDate = {};
          const expensesMap = {};

          data.forEach((exp) => {
            const date = exp.date.split("T")[0];
            totalsByDate[date] = (totalsByDate[date] || 0) + parseFloat(exp.amount);

            if (!expensesMap[date]) expensesMap[date] = [];
            expensesMap[date].push(exp);
          });

          const eventList = Object.entries(totalsByDate).map(([date, total]) => ({
            title: `₹${total}`,
            date,
          }));

          setEvents(eventList);
          setExpensesByDate(expensesMap);
        } else {
          console.error("Failed to fetch expenses:", data);
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    fetchExpenses();
  }, []);

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr || info.event?.startStr;
    setSelectedDate(clickedDate);
  };

  return (
    <div className="mt-[-4rem] text-black px-10 relative">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="80vh"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleDateClick}
        dayMaxEventRows={true}
        eventContent={(arg) => (
          <div
            style={{
              textAlign: "center",
              fontSize: "1rem",
              color: "black",
              fontWeight: "500",
              pointerEvents: "none",
            }}
          >
            {arg.event.title}
          </div>
        )}
        eventDisplay="block"
      />

      {/* Popup Modal */}
      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#d1cfc0] rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-y-auto animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-center">
              Expenses on {selectedDate}
            </h2>

            {expensesByDate[selectedDate] && expensesByDate[selectedDate].length > 0 ? (
              expensesByDate[selectedDate].map((exp, idx) => (
                <div
                  key={idx}
                  className="border-b border-grey-300 py-2 text-sm flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{exp.category}</p>
                    <p className="text-gray-600">{exp.note}</p>
                  </div>
                  <p className="font-bold text-black">₹{exp.amount}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No expenses found</p>
            )}

            <button
              onClick={() => setSelectedDate(null)}
              className="mt-4 w-full bg-[#1f1f1f] text-white py-2 rounded-lg hover:bg-black transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
