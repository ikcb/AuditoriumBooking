import React, { useState } from "react";
import Calendar from "react-calendar";
import { Mobile, Desktop } from "@/components/Platform";
import EventTile from "@/components/EventCard";
import Router from "next/router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";


const sampleEvents = [
  {
    id: 1,
    date: new Date(2023, 10, 25, 10, 0), // Example: November 25, 2023, 10:00 AM
    duration: "1 hour",
    title: "Sample Event 1",
    description: "This is a sample event description.",
    category: "General",
    host: "John Doe",
  },
  // Add more sample events as needed
];

const IndexPage = () => {
  const [date, setDate] = useState(new Date());
  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

  const getCurrentDateInfo = () => {
    const currentYear = date.getFullYear();
    const currentMonth = date.toLocaleString("default", { month: "long" });
    const currentDate = date.getDate();

    return `${currentMonth} ${currentDate}, ${currentYear}`;
  };

  const isDateDisabled = (date) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return date < oneWeekAgo;
  };
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4 text-center mt-16">Auditorium Booking</h1>
        <Desktop>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Go to Date?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to go to {date.toISOString().split('T')[0]} to Check/Book the Auditorium?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No</AlertDialogCancel>
                <AlertDialogAction onClick={
                  async () => {
                    await Router.push(`/book?date=${date.toISOString().split('T')[0]}`);
                    setOpen(false)
                  }
                }>Yes</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>



          <div className="flex">
            <div className="flex-1">
              <Calendar
                className="bg-white rounded-lg overflow-hidden shadow-lg p-8 m-4"
                onChange={(newDate) => {setDate(newDate); setOpen(true);}}
                value={date}
                tileClassName={({ date, view }) =>
                  view === "month" && date.toDateString() === new Date().toDateString()
                    ? "highlighted-date"
                    : null
                }
                tileDisabled={({ date, view }) => view === "month" ? isDateDisabled(date) : false}
              />
            </div>
            <div className="w-1/3 p-4">
              <ul className="border-2 border-black rounded-lg p-3 mx-10 mt-3">
                <li>
                  <h2 className="text-xl font-bold mb-2">Upcoming Events</h2>
                </li>
                {sampleEvents.map((event) => (
                  <EventTile key={event.id} event={event} />
                ))}
              </ul>
            </div>
          </div>
        </Desktop>

        <Mobile>
          <Calendar
            className="rounded-lg overflow-hidden shadow-lg p-8 mx-4 sm:mx-auto w-full sm:w-96"
            onChange={(newDate) => setDate(newDate)}
            value={date}
            tileClassName={({ date, view }) =>
              view === "month" && date.toDateString() === new Date().toDateString()
                ? "highlighted-date"
                : null
            }
            tileDisabled={({ date }) => isDateDisabled(date)}
          />
          <div className="p-4">
            <ul className="border-2 border-black rounded-lg p-4 mx-3">
              <li>
                <h2 className="text-xl font-bold mb-2">Upcoming Events</h2>
              </li>
              {sampleEvents.map((event) => (
                <EventTile key={event.id} event={event} />
              ))}
            </ul>
          </div>
        </Mobile>
      </div>
    </div>
  );
};

export default IndexPage;
