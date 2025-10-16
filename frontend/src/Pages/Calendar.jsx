import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import "./Calendar.css";

export default function Calendar() {
  return (
      <div className='mt-[-4rem] text-black px-10'>
          <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
        height={"80vh"}
        events={[
      { title: '500rs', date: '2025-10-12' },
      { title: '3400rs', date: '2025-10-13' },
      { title: '30rs', date: '2025-10-14' },
      { title: '500rs', date: '2025-10-15' },
      { title: '1254rs', date: '2025-10-16' }
    ]}
      />
      </div>

  )
}