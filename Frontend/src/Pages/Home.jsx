import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import Footer from "../Component/Footer";
import "../assets/calender.css";

const getDaystring = (dayNumber) => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[dayNumber];
};

function renderEventContent(eventInfo) {
  const arr = eventInfo.event.title.split("-");
  console.log(arr);
  return (
    <>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="w-[100px] bg-slate-600">{arr[0]}</div>
        <div className="w-[100px] bg-slate-600 ">
          {arr[2]}-{arr[3]}
        </div>
      </div>
    </>
  );
}

const Calender = () => {
  const [Event, setEvent] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/ticket?status=booked`)
      .then((res) => {
        console.log(res.data);
        const data = res.data.map((item) => {
          return {
            title: `${item.clubname}-Slot-${item.startTime}-${item.endTime}`,
            start: item.date.substring(0, 10),
            end: item.date.substring(0, 10),
          };
        });
        setEvent(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="">
        <div className="flex flex-col">
          <div className="flex flex-row w-full justify-between px-[20px]">
            <div className="md:flex flex-col  h-[100vh] items-center hidden">
              <div className="bg-slate-300 mt-[80px] w-[260px] h-[330px] shadow-xl px-4 py-5 m-10 rounded-lg translate-x-[-10px] translate-y-[18px]">
                <Calendar
                  formatShortWeekday={(locale, date) => {
                    return (
                      getDaystring(date.getDay())
                        .substring(0, 1)
                        .toUpperCase() +
                      getDaystring(date.getDay()).substring(1, 2).toLowerCase()
                    );
                  }}
                  prev2Label={""}
                  next2Label={""}
                  showNeighboringMonth={false}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="w-[1200px] md:w-[70vw] h-auto mt-4 ">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  height={"100vh"}
                  events={Event}
                  dayMinWidth={"120px"}
                  eventContent={renderEventContent}
                  allDaySlot={false}
                />
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
