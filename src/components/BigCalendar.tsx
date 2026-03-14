"use client"
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import { calendarEvents } from '@/lib/data'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState } from 'react'

const localizer = momentLocalizer(moment)

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  // Toggle the event when click on view props
  const handleToggleView = () => {
    setView( (prev) => (prev === Views.WORK_WEEK ? Views.DAY : Views.WORK_WEEK))
  }

  return (
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        style={{ height: "98%" }}
        onView={handleToggleView}
        min={new Date(2025,1,1,7,0,0)}
        max={new Date(2025,1,1,17,30,0)}
        
      />
  )
}

export default BigCalendar



