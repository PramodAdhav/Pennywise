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

        const res = await fetch("https://pennywise-tan.vercel.app/api/expenses", {
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
    <div className="mt-[-4rem] sm:mt-[-5rem] text-black px-4 sm:px-10 relative">
      <div className="px-2 sm:px-8 mt-2 mb-4">
        <blockquote className="instrument-serif-regular border-l-2 pl-3 sm:pl-4 text-lg sm:text-2xl text-black border-black leading-snug">
          The calendar below displays the total expenses for each day. Tap on a
          specific date to view a detailed list of expenses for that day.
        </blockquote>
      </div>

      <div className="bg-[#d1cfc0] rounded-2xl p-2 sm:p-4 border border-black shadow-sm">
        <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  height="70vh"
  events={events}
  dateClick={handleDateClick}
  eventClick={handleDateClick}
  eventContent={(arg) => (
    <div
      style={{
        textAlign: "center",
        fontSize: "0.9rem",
        color: "black",
        fontWeight: "500",
        pointerEvents: "none",
      }}
    >
      {arg.event.title}
    </div>
  )}
  eventDisplay="block"
  headerToolbar={{
    left: "title",
    center: "",
    right: "today prev,next",
  }}
  buttonText={{
    today: "Today",
  }}
  dayMaxEventRows={false}
  eventOverlap={false}
  contentHeight="auto"
  fixedWeekCount={false}
/>

      </div>

      <style>
        {`
          /* === Calendar Day Styling === */
.fc-daygrid-day {
  background-color: rgb(133, 131, 123);
  border-radius: 10px;
  cursor: pointer;
}

/* === Expense Event Box Styling === */
.fc-event {
  background-color: rgb(133, 131, 123) !important;
  color: black !important;
  border: 1px solid #cfcdc0 !important;
  border-radius: 10px !important;
  font-weight: bold;
  text-align: center;
  width: 100%;
  max-width: 100px;
  height: 35px;
  font-size: 0.85rem !important;
  line-height: 1.2 !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 4px !important;
}

/* Remove extra styling from FullCalendar wrappers */
.fc-daygrid-event {
  background: none !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
}

/* === Toolbar Styling === */
.fc .fc-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Title aligned to left */
.fc .fc-toolbar-title {
  font-size: 1.1rem;
  font-weight: 600;
  text-align: left;
  flex-grow: 1;
}

/* Buttons grouped on right */
.fc .fc-button {
  background: black !important;
  border: none !important;
  color: white !important;
  padding: 0.25rem 0.6rem !important;
  font-size: 0.8rem !important;
  border-radius: 6px !important;
  margin-left: 0.4rem !important;
}

.fc .fc-button:hover {
  background: #1f1f1f !important;
}

/* === Animation === */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* === Day Frame Fixes === */
.fc-daygrid-day-frame {
  position: relative;
  overflow: hidden;
  padding: 4px !important;
}

/* === Responsive Adjustments === */
@media (max-width: 640px) {
  .fc .fc-toolbar-title {
    font-size: 0.9rem !important;
  }

  .fc .fc-button {
    padding: 0.2rem 0.45rem !important;
    font-size: 0.7rem !important;
  }

  .fc-event {
    font-size: 0.6rem !important;
    height: 25px !important;
    padding: 0 !important;
  }

  .fc-daygrid-day-frame {
    padding: 2px !important;
  }

  .fc-daygrid-day-top {
    margin-bottom: 1px !important;
  }
}

        `}
      </style>

      {/* Popup Modal */}
      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
          <div className="bg-[#d1cfc0] rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[80vh] overflow-y-auto animate-fadeIn border border-black">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">
              Expenses on {selectedDate}
            </h2>

            {expensesByDate[selectedDate] && expensesByDate[selectedDate].length > 0 ? (
              expensesByDate[selectedDate].map((exp, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-400 py-2 text-sm flex justify-between gap-2 sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base">
                      {exp.category}
                    </p>
                    <p className="text-gray-600 truncate">{exp.note}</p>
                  </div>
                  <p className="font-bold text-black whitespace-nowrap text-sm sm:text-base">
                    ₹{exp.amount}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No expenses found</p>
            )}

            <button
              onClick={() => setSelectedDate(null)}
              className="mt-5 w-full bg-[#1f1f1f] text-white py-2 rounded-lg hover:bg-black transition text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
