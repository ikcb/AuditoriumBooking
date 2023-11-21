import React from "react";

const EventTile = ({ event }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 mb-4">
  <h3 className="text-xl font-bold mb-2">{ event.title }</h3>
  <p className="text-sm">
    <span className="font-bold"></span> { event.date.toLocaleDateString() } 
    <span className="font-bold">{" "}• {" "}</span> { event.date.toLocaleTimeString() } 

    <span className="font-bold">{" "}• {" "}</span> { event.duration } 
    <br/>
    <span className="font-bold">{ event.host }</span>,

    <span className="font-mono"> {" "}{ event.category }</span>
  </p>
  <p className="mt-2 text-gray-600">{ event.description }</p>
</div>
  );
};

export default EventTile;
