import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const VerticalTimeClock = () => {
  const [events, setEvents] = useState([]);
  const { toast } = useToast()
  const [newEvent, setNewEvent] = useState({
    fullname: "",
    category: "",
    starttimehr: "",
    endtimehr: "",
    starttimemn: "",
    endtimemn: "",
    title: "",
    description: "",
    email: ""
  });
  
  const [isopened, setIsopened] = useState(false);
  const [startTimehrselected, setStartTimehrselected] = useState(false);
  const [endTimehrselected, setEndTimehrselected] = useState(false);
  const [startTimemnselected, setStartTimemnselected] = useState(false);
  const [endTimemnselected, setEndTimemnselected] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpsending, setOtpSending] = useState(false);
  const [otpsent, setOtpSent] = useState(false);
  const submitResponse = () => {
    if (newEvent.fullname === "" || newEvent.category === "" || newEvent.starttimehr === "" || newEvent.endtimehr === "" || newEvent.starttimemn === "" || newEvent.endtimemn === "" || newEvent.title === "" || newEvent.description === "" || newEvent.email === "") {
      toast({
        title: "Error! ",
        description: "Please fill all the fields",
        action: (
          <ToastAction altText="Make sure you filled all the fields">Ok</ToastAction>
        ),
      })

      return;
    }
    console.log(newEvent.starttimehr, newEvent.endtimehr, newEvent.starttimemn, newEvent.endtimemn)
    console.log(Number(newEvent.starttimehr) > Number(newEvent.endtimehr))
    if (Number(newEvent.starttimehr) > Number(newEvent.endtimehr)) {
      toast({
        title: "Error! ",
        description: "Start time cannot be after end time!",
        action: (
          <ToastAction altText="You choosen end time before start time">Ok</ToastAction>
        ),
      })
      return;
    }
    if (newEvent.starttimehr === newEvent.endtimehr && newEvent.starttimemn > newEvent.endtimemn) {
      toast({
        title: "Error! ",
        description: "Start time cannot be after end time",
        action: (
          <ToastAction altText="You choosen end time before start time">Ok</ToastAction>
        ),
      })
      return;
    }
    if (newEvent.starttimehr === newEvent.endtimehr && newEvent.starttimemn === newEvent.endtimemn) {
      toast({
        title: "Error! ",
        description: "Start time cannot be Same as end time",
        action: (
          <ToastAction altText="You choosen end time and start time are same">Ok</ToastAction>
        ),
      })
      return;
    }
    if (newEvent.email.indexOf("@") === -1) {
      toast({
        title: "Error! ",
        description: "Please enter a valid email",
        action: (
          <ToastAction altText="You choosen end time and start time are same">Ok</ToastAction>
        ),
      })
      return;
    }
    setOtpOpen(true);
    setIsopened(false);
  }

  const formatEventTimings = (event) => {
    const startTime = `${event.starttimehr}:${event.starttimemn}`;
    const endTime = `${event.endtimehr}:${event.endtimemn}`;

    const formatTime = (time) => {
      const [hours, minutes] = time.split(":");
      const formattedHours = hours % 12 || 12;
      const period = hours >= 12 ? "PM" : "AM";
      return `${formattedHours}:${minutes} ${period}`;
    };

    return `${formatTime(startTime)} to ${formatTime(endTime)}`;
  };

  const isDisabled = (data, toCheck) => {
    for (const event of data) {
      const startTime = event.starttimehr + 1;
      const endTime = event.endtimehr - 1;
      if (toCheck >= startTime && toCheck <= endTime) {
        return true;
      }
    }
    return false; 
  };



  const handleAddEvent = () => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setNewEvent({
      fullname: "",
      category: "",
      starttimehr: "",
      endtimehr: "",
      starttimemn: "",
      endtimemn: "",
      title: "",
      description: "",
      email: ""
    });
  };
  const handleStartTimeChange = (e) => {
    const newValue = e;

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      starttimehr: newValue
    }));
    setStartTimehrselected(true);
  };
  const handleStartTimeminChange = (e) => {
    const newValue = e;

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      starttimemn: newValue
    }));
    setStartTimemnselected(true);
  };
  const handleEndTimeChange = (e) => {
    const newValue = e;
    // console.log(newEvent.starttimehr);

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      endtimehr: newValue
    }));
    setEndTimehrselected(true);
  };
  const handleEndTimeminChange = (e) => {
    const newValue = e;

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      endtimemn: newValue
    }));
    setEndTimemnselected(true);
  };

  const router = useRouter();
  const { date } = router.query;



  useEffect(() => {
    const fetchData = async () => {
      
      if (date) {
        const [year, month, day] = date.split('-');
        try {
          const response = await fetch(`/api/geteventsinmonthanddate?month=${month}&date=${day}`);
          if (response.ok) {
            const data = await response.json();
            const sortedEvents = data.data.sort((a, b) => {
              const startTimeA = a.starttimehr * 60 + a.starttimemn;
              const startTimeB = b.starttimehr * 60 + b.starttimemn;
              return startTimeA - startTimeB;
            });
            setEvents(sortedEvents);
          } else {
            console.error('Failed to fetch events:', response.statusText);
          }
        } catch (error) {
          console.error('Error while fetching events:', error);
        }
      }
    };

    fetchData();
  }, [date]);
  

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster/>
      <Dialog open={otpOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{otpsending ? "Please Wait.." : "Enter OTP"}</DialogTitle>
          <DialogDescription>
          {otpsending ? "Sending OTP.." : "If you entered email correctly, Then you should have received an OTP. Please enter it below."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="OTP" className="text-right">
              OTP
            </Label>
            <Input id="OTP" value="" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit OTP</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      <Dialog open={isopened} onOpenChange={
        (isOpen) => setIsopened(isOpen)
      }>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit Requst</DialogTitle>
            <DialogDescription>
              Please note that you must submit a request first. Your request may be declined if it is deemed unreasonable.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="text-right">
                Your Full Name
              </Label>
              <Input id="fullname" value={
                newEvent.fullname
              } onChange={
                (e) => setNewEvent({ ...newEvent, fullname: e.target.value })
              } className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Your college Email
              </Label>
              <Input id="email" value={
                newEvent.email
              } onChange={
                (e) => setNewEvent({ ...newEvent, email: e.target.value.replaceAll(" ", "").toLowerCase().replaceAll(/[^a-z0-9@.]/g, "") })
              } className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Club or category
              </Label>
              <Input id="category" value={
                newEvent.category
              } onChange={
                (e) => setNewEvent({ ...newEvent, category: e.target.value })
              } className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Event Title or Name
              </Label>
              <Input id="title" value={
                newEvent.title
              } onChange={
                (e) => setNewEvent({ ...newEvent, title: e.target.value })
              } className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Short Description
              </Label>
              <Input id="description" value={
                newEvent.description
              } onChange={
                (e) => setNewEvent({ ...newEvent, description: e.target.value })
              } className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="starttime" className="text-right">
                Select start time
              </Label>
              <Select id="starttime" value={
                newEvent.starttimehr
              } onValueChange={
                handleStartTimeChange
              }>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select start time Hour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Morning</SelectLabel>
                    <SelectItem value="7" disabled={isDisabled(events, 7)}>7 AM</SelectItem>
                    <SelectItem value="8" disabled={isDisabled(events, 8)}>8 AM</SelectItem>
                    <SelectItem value="9" disabled={isDisabled(events, 9)}>9 AM</SelectItem>
                    <SelectItem value="10" disabled={isDisabled(events, 10)}>10 AM</SelectItem>
                    <SelectItem value="11" disabled={isDisabled(events, 11)}>11 AM</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Afternoon</SelectLabel>
                    <SelectItem value="12" disabled={isDisabled(events, 12)}>12 PM (Noon)</SelectItem>
                    <SelectItem value="13" disabled={isDisabled(events, 13)}>1 PM</SelectItem>
                    <SelectItem value="14" disabled={isDisabled(events, 14)}>2 PM</SelectItem>
                    <SelectItem value="15" disabled={isDisabled(events, 15)}>3 PM</SelectItem>
                    <SelectItem value="16" disabled={isDisabled(events, 16)}>4 PM</SelectItem>
                    <SelectItem value="17" disabled={isDisabled(events, 17)}>5 PM</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Evening</SelectLabel>
                    <SelectItem value="18" disabled={isDisabled(events, 18)}>6 PM</SelectItem>
                    <SelectItem value="19" disabled={isDisabled(events, 19)}>7 PM</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Night</SelectLabel>
                    <SelectItem value="20" disabled={isDisabled(events, 20)}>8 PM</SelectItem>
                    <SelectItem value="21" disabled={isDisabled(events, 21)}>9 PM</SelectItem>
                    <SelectItem value="22" disabled={isDisabled(events, 22)}>10 PM</SelectItem>
                    <SelectItem value="23" disabled={isDisabled(events, 23)}>11 PM</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="starttimemin" className="text-right">
                Select start time
              </Label>
              <Select id="starttimemin" value={
                newEvent.starttimemn
              } disabled={!startTimehrselected} onValueChange={
                handleStartTimeminChange
              }>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select start time Min" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m-00">00</SelectItem>
                  <SelectItem value="m-15">15</SelectItem>
                  <SelectItem value="m-30">30</SelectItem>
                  <SelectItem value="m-45">45</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endtimehr" className="text-right">
                Select End time
              </Label>
              <Select id="endtimehr" disabled={!startTimemnselected} value={
                newEvent.endtimehr
              } onValueChange={handleEndTimeChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select expected end time Hour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Morning</SelectLabel>
                    <SelectItem value="7" disabled={isDisabled(events, 7) || Number(newEvent.starttimehr) > 7}>7 AM</SelectItem>
                    <SelectItem value="8" disabled={isDisabled(events, 8) || Number(newEvent.starttimehr) > 8}>8 AM</SelectItem>
                    <SelectItem value="9" disabled={isDisabled(events, 9) || Number(newEvent.starttimehr) > 9}>9 AM</SelectItem>
                    <SelectItem value="10" disabled={isDisabled(events, 10) || Number(newEvent.starttimehr) > 10}>10 AM</SelectItem>
                    <SelectItem value="11" disabled={isDisabled(events, 11) || Number(newEvent.starttimehr) > 11}>11 AM</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Afternoon</SelectLabel>
                    <SelectItem value="12" disabled={isDisabled(events, 12) || Number(newEvent.starttimehr) > 12}>12 PM (Noon)</SelectItem>
                    <SelectItem value="13" disabled={isDisabled(events, 13) || Number(newEvent.starttimehr) > 13}>1 PM</SelectItem>
                    <SelectItem value="14" disabled={isDisabled(events, 14) || Number(newEvent.starttimehr) > 14}>2 PM</SelectItem>
                    <SelectItem value="15" disabled={isDisabled(events, 15) || Number(newEvent.starttimehr) > 15}>3 PM</SelectItem>
                    <SelectItem value="16" disabled={isDisabled(events, 16) || Number(newEvent.starttimehr) > 16}>4 PM</SelectItem>
                    <SelectItem value="17" disabled={isDisabled(events, 17) || Number(newEvent.starttimehr) > 17}>5 PM</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Evening</SelectLabel>
                    <SelectItem value="18" disabled={isDisabled(events, 18) || Number(newEvent.starttimehr) > 18}>6 PM</SelectItem>
                    <SelectItem value="19" disabled={isDisabled(events, 19) || Number(newEvent.starttimehr) > 19}>7 PM</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Night</SelectLabel>
                    <SelectItem value="20" disabled={isDisabled(events, 20) || Number(newEvent.starttimehr) > 20}>8 PM</SelectItem>
                    <SelectItem value="21" disabled={isDisabled(events, 21) || Number(newEvent.starttimehr) > 21}>9 PM</SelectItem>
                    <SelectItem value="22" disabled={isDisabled(events, 22) || Number(newEvent.starttimehr) > 22}>10 PM</SelectItem>
                    <SelectItem value="23" disabled={isDisabled(events, 23) || Number(newEvent.starttimehr) > 23}>11 PM</SelectItem>
                  </SelectGroup>
                </SelectContent>

              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endtimemin" className="text-right">
                Select end time
              </Label>
              <Select value={
                newEvent.endtimemn
              } id="endtimemin" disabled={!endTimehrselected} onValueChange={handleEndTimeminChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Expected End time Min" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m-00">00</SelectItem>
                  <SelectItem value="m-15">15</SelectItem>
                  <SelectItem value="m-30">30</SelectItem>
                  <SelectItem value="m-45">45</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!endTimemnselected} onClick={submitResponse}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div className="flex-1 relative z-10 m-3 "><div class="bg-[#ecf2f7] flex items-center justify-center min-h-screen font-nunito text-slate-600">
        <section class="max-w-[968px] w-full mx-4">

          <h1 class="mx-2 my-10 text-2xl font-semibold text-center sm:text-3xl">{events.length === 0 ? "No" : events.length} events this day</h1>
          {events.map((event, index) => (

            <ul
              class="w-full bg-white p-8  rounded-lg gap-3 flex items-start justify-center shadow-[0px_10px_15px_9px_#DDE4F1] flex-col sm:flex-row relative overflow-hidden mb-10">
              <li class="pr-4 overflow-hidden grow">
                <span class="absolute slide-in-top bg-gradient-to-r from-[#6c73ff] to-[#676bbe] text-white px-24 py-[4px] rounded-br-lg left-0 top-0 text-sm">{event.category}</span>
                <h2 class="mb-3 text-xl font-[800] mt-3">{event.title}</h2>
                <p class="max-w-lg text-lg">{event.description}</p>
              </li>
              <ul>
                <li className="max-w-xl m-auto text-sm text-center text-slate-400">{event.host}</li>
                <li className="max-w-xl m-auto text-sm text-center text-slate-400">
                  {formatEventTimings(event)}
                </li>
              </ul>

            </ul>


          ))} <p class="max-w-xl m-auto text-sm text-center text-slate-400">Please note that you must submit a request first. Your request may be declined if it is deemed unreasonable.</p>
          <button onClick={
            () => (setIsopened(true))
          } class="mb-20 px-20 py-4 text-white bg-[#f1626e] mx-auto block mt-5 rounded-xl text-lg transition-all duration-150 ease-in hover:bg-[#d14f5a]">
            Book an event
          </button>
        </section>
      </div>
      </div>
    </div>
  );
};

export default VerticalTimeClock;
