import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import Footer from "../Component/Footer";
import "../assets/calender.css";

const getDaystring = (dayNumber) => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[dayNumber];
};

const Calender = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [datesWithEvents, setDatesWithEvents] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Extract unique dates with events
  useEffect(() => {
    const uniqueDates = [...new Set(
      events.map(event => new Date(event.date).toISOString().split('T')[0])
    )];
    
    setDatesWithEvents(uniqueDates);
  }, [events]);
  
  useEffect(() => {
    // Format the selected date
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    // Filter events for the selected date
    const eventsOnDate = events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === formattedDate;
    });
    
    // Sort events by start time
    const sortedEvents = eventsOnDate.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.startTime}`);
      const timeB = new Date(`1970/01/01 ${b.startTime}`);
      return timeA - timeB;
    });
    
    setFilteredEvents(sortedEvents);
  }, [selectedDate, events]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ticket?status=booked`);
      const data = response.data.map((item) => ({
        ...item,
        date: new Date(item.date)
      }));
      setEvents(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Custom tile class to add effects
  const tileClassName = ({ date, view }) => {
    // Only add class on month view
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      
      // Check if this date has events
      const hasEvents = datesWithEvents.includes(dateString);
      
      // Check if this is today's date
      const isToday = dateString === today;
      
      // Combine classes
      const classes = [];
      
      if (hasEvents) classes.push('event-date');
      if (isToday) classes.push('today-date');
      
      return classes.length > 0 ? classes.join(' ') : null;
    }
    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col md:flex-row p-4 max-w-7xl mx-auto">
          {/* Left side - Mini Calendar */}
          <div className="md:w-1/4 mb-6 md:mb-0">
            <div className="bg-white rounded-lg shadow-md p-4 md:sticky md:top-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Date</h2>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                formatShortWeekday={(locale, date) => {
                  const dayString = getDaystring(date.getDay());
                  return (
                    dayString.substring(0, 1).toUpperCase() +
                    dayString.substring(1, 2).toLowerCase()
                  );
                }}
                tileClassName={tileClassName}
                prev2Label={""}
                next2Label={""}
                showNeighboringMonth={false}
                className="border-0"
              />
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Selected: <span className="font-medium">{selectedDate.toDateString()}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Event List */}
          <div className="md:w-3/4 md:pl-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Events on {selectedDate.toDateString()}
              </h2>
              
              <div className="space-y-4">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => (
                    <div 
                      key={index} 
                      className="bg-slate-100 border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-2 sm:mb-0">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {event.clubname}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {event.eventdescription}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium text-gray-700">
                            {event.startTime} - {event.endTime}
                          </span>
                          <span className="text-xs text-gray-500">
                            Contact: {event.mobileno}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No Events</p>
                    <p className="text-gray-400 text-sm">There are no bookings for this date.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Calender;