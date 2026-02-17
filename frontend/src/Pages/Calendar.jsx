import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css";

export default function Calendar() {
  const [allExpenses, setAllExpenses] = useState([]); 
  const [events, setEvents] = useState([]);
  const [expensesByDate, setExpensesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("https://pennywise-tan.vercel.app/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setAllExpenses(data);
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
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (allExpenses.length > 0) {
      const now = new Date();
      const initialTotal = allExpenses
        .filter((exp) => {
          const d = new Date(exp.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      setMonthlyTotal(initialTotal);
    }
  }, [allExpenses]);

  const handleDatesSet = (dateInfo) => {
    if (allExpenses.length === 0) return;
    const currentMonth = dateInfo.view.currentStart.getMonth();
    const currentYear = dateInfo.view.currentStart.getFullYear();
    const filteredTotal = allExpenses
      .filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    setMonthlyTotal(filteredTotal);
  };

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr || info.event?.startStr;
    setSelectedDate(clickedDate);
  };

  return (
    <div className="mt-[-4rem] sm:mt-[-5rem] text-black px-4 sm:px-10 relative">
      <div className="px-2 sm:px-8 mt-2 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <blockquote className="instrument-serif-regular border-l-2 pl-3 sm:pl-4 text-lg sm:text-2xl text-black border-black leading-snug flex-grow">
          The calendar below displays the total expenses for each day. Tap on a
          specific date to view a detailed list of expenses for that day.
        </blockquote>
        <div className="flex-shrink-0 bg-black text-[#d1cfc0] rounded-xl border border-black shadow-sm flex flex-col justify-center items-center w-[160px] h-[65px]">
          <p className="text-[10px] uppercase tracking-wider font-bold opacity-70 mb-1">Monthly Total</p>
          <p className="text-xl sm:text-2xl font-bold">₹{monthlyTotal.toLocaleString()}</p>
        </div>
      </div>

      <div 
        className="bg-[#d1cfc0] rounded-2xl p-2 sm:p-4 border border-black shadow-sm mb-4 overflow-hidden relative flex flex-col" 
        style={{ height: "calc(100vh - 350px)", minHeight: "500px" }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="100%"
          contentHeight="100%"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleDateClick}
          datesSet={handleDatesSet}
          eventContent={(arg) => (
            <div className="custom-event-content">{arg.event.title}</div>
          )}
          eventDisplay="block"
          headerToolbar={{ left: "title", center: "", right: "today prev,next" }}
          buttonText={{ today: "Today" }}
          fixedWeekCount={false}
        />
      </div>

      <style>
        {`
          .fc { height: 100% !important; }
          .fc-view-harness { height: 100% !important; }
          .fc-daygrid-body, .fc-daygrid-body table { height: 100% !important; width: 100% !important; }
          .fc-daygrid-row { height: auto !important; flex-grow: 1 !important; }
          
          /* The Core Centering Logic */
          .fc-daygrid-day-frame { 
            height: 100% !important; 
            display: flex !important; 
            flex-direction: column !important;
            justify-content: center !important; /* Vertical center */
            align-items: center !important;     /* Horizontal center */
            position: relative;
          }

          /* Keep day numbers in the corner */
          .fc-daygrid-day-top {
            position: absolute;
            top: 2px;
            right: 5px;
            flex-direction: row !important;
          }

          /* Force the event container to be a flex center */
          .fc-daygrid-day-events {
            width: 100%;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            margin: 0 !important;
          }

          /* Show dash when NO events are present */
          .fc-daygrid-day-events:empty::before {
            content: "-";
            font-size: 2rem;
            color: rgba(0,0,0,0.2);
            font-weight: bold;
          }

          /* Event Pill Styling - Larger and Centered */
          .custom-event-content {
            font-size: 1.1rem;
            font-weight: 700;
            color: black;
            text-align: center;
            width: 100%;
          }

          .fc-event {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            width: 100%;
          }

          .fc-daygrid-day { 
            background-color: rgb(133, 131, 123); 
            border-radius: 10px; 
            cursor: pointer; 
            transition: background 0.2s;
          }
          .fc-daygrid-day:hover { background-color: rgb(143, 141, 133); }

          .fc .fc-toolbar-title { font-size: 1.2rem; font-weight: 700; }
          .fc .fc-button { background: black !important; border: none !important; border-radius: 8px !important; }

          @media (max-width: 640px) {
            .custom-event-content { font-size: 0.8rem; }
            .fc-daygrid-day-events:empty::before { font-size: 1.5rem; }
          }
        `}
      </style>

      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3 cursor-default" onClick={() => setSelectedDate(null)}>
          <div className="bg-[#d1cfc0] rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[80vh] overflow-y-auto animate-fadeIn border border-black" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Expenses on {selectedDate}</h2>
            {expensesByDate[selectedDate]?.length > 0 ? (
              expensesByDate[selectedDate].map((exp, idx) => (
                <div key={idx} className="border-b border-gray-400 py-2 text-sm flex justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold">{exp.category}</p>
                    <p className="text-gray-600 truncate">{exp.note}</p>
                  </div>
                  <p className="font-bold whitespace-nowrap">₹{exp.amount}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No expenses found</p>
            )}
            <button onClick={() => setSelectedDate(null)} className="mt-5 w-full bg-[#1f1f1f] text-white py-2 rounded-lg hover:bg-black transition cursor-pointer">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}