import React from "react";

const EventTile = ({ event }) => {
  const date = new Date(Number(event.year), Number(event.month) - 1, Number(event.date), Number(event.starttimehr), Number(event.starttimemn));

  return (
    <div className="bg-white shadow-md rounded p-4 mb-4">
      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
      <p className="text-sm">
        <span className="font-bold">Date:</span> {date.toLocaleDateString()}
        <span className="font-bold"> • </span>
        <span className="font-bold">Time:</span> {date.toLocaleTimeString()}
        <br />
        <span className="font-bold">{event.host}</span>,
        <span className="font-mono"> {event.category}</span>
      </p>
      <p className="mt-2 text-gray-600">{event.description}</p>
    </div>
  );
};

export default EventTile;
