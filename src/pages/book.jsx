import React, { useState } from "react";

const VerticalTimeClock = () => {
  const [events, setEvents] = useState([
    {
      start: "9:30",
      end: "11:45",
      title: "Meeting with John Doe",
      description: "Discuss new project"
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    start: "",
    end: "",
    title: "",
    description: "",
  });

  const hours = Array.from({ length: 17 }, (_, i) => i + 7);

  const getTimeInMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleAddEvent = () => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setNewEvent({
      start: "",
      end: "",
      title: "",
      description: "",
    });
  };

  return (
    <div className="flex h-screen">
      <div className="w-16 border-r border-gray-300">
        {/* Timeline */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-12 flex items-center justify-end text-right pr-2"
          >
            {hour}:00
          </div>
        ))}
      </div>

      <div className="flex-1 relative z-10">
        {/* Events */}
        {events.map((event, index) => (
          <div
            className="absolute bg-blue-200 border border-blue-500 rounded-md p-2 mt-1"
            key={index}
            style={{
              top: `${getTimeInMinutes(event.start) - 540}px`,
              height: `${getTimeInMinutes(event.end) - getTimeInMinutes(event.start)}px`
            }}
          >
            <div className="font-bold">{event.title}</div>
            <div>{event.description}</div>
          </div>
        ))}

        {/* Add Event Form */}
        {/* <div className="absolute bottom-4 right-4">
          <form>
            <label className="block mb-2">Start Time</label>
            <input
              type="time"
              name="start"
              value={newEvent.start}
              onChange={handleInputChange}
              className="mb-2"
            />

            <label className="block mb-2">End Time</label>
            <input
              type="time"
              name="end"
              value={newEvent.end}
              onChange={handleInputChange}
              className="mb-2"
            />

            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              className="mb-2"
            />

            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              rows="3"
              className="mb-2"
            />

            <button
              type="button"
              onClick={handleAddEvent}
              className="bg-green-500 text-white px-4 py-2"
            >
              Add Event
            </button>
          </form>
        </div> */}
      </div>
    </div>
  );
};

export default VerticalTimeClock;
