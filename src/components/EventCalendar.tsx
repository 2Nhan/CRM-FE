"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY events data
const events = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "3:00 PM - 5:00 PM",
    description: "Aliquam at porttitor sem. Aliquam erat volutpat.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "6:00 PM - 8:00 PM",
    description: "Donec ac odio tempor orci dapibus ultrices.",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-4 rounded-md">
      {/* CALENDAR */}
      <Calendar onChange={onChange} value={value} locale="en-US" />

      {/* HEADER */}
      <div className="flex items-center justify-between my-4">
        <h1 className="text-xl font-semibold">Attendance</h1>
        <Image
          src="/moreDark.png"
          alt="more"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </div>

      {/* EVENTS LIST */}
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="group p-4 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple transition-all duration-200 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-500 group-hover:text-gray-800 group-hover:font-bold transition-all duration-200">
                {event.title}
              </h1>
              <span className="text-xs text-gray-300 group-hover:text-gray-600 transition-all duration-200">
                {event.time}
              </span>
            </div>
            <p className="mt-2 text-gray-400 text-sm group-hover:text-gray-700 transition-all duration-200">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
