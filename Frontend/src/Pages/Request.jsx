import { useState } from "react";
import "../assets/calender.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Component/Footer";

const option = [];
for (let i = 0; i < 1440; i += 15) {
  option.push(i);
}

const convertMinutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const amPm = hours < 12 ? "AM" : "PM";
  const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const formattedMinutes = String(remainingMinutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${amPm}`;
};
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  // Pad month and day with leading zeros if needed
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
}

const AddEvent = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileno: "",
    eventdescription: "",
    date: "",
    clubname: "",
    approve:"",
    file:null,
    startTime: 0,
    endTime: 15,
    status: "pending",
  });
  const [fileName,setFileName] = useState("");
  const [pdfData, setPdfData] = useState("");

  function pdfToBinary(e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPdfData(base64String);
      };
      reader.readAsDataURL(file);
    }else{
      return null;
    }
  }
  
  
  const handleSave = () => {
  
    const req = {
     ...form,
     file:pdfData,
      startTime: convertMinutesToTime(form.startTime),
      endTime: convertMinutesToTime(form.endTime),
    };
    console.log(req);
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/createticket`, req)
      .then((res) => {
        console.log(res);
        toast.success("Booking Request created successfully!");

        setForm({
          name: "",
          email: "",
          mobileno: "",
          eventdescription: "",
          date: "",
          clubname: "",
          approve:"",
          file:null,
          startTime: 0,
          endTime: 15,
          status: "pending",
        });
        setFileName("");
      })
      .catch((err) => {
        toast.error(err.response.data.error);
        console.log(err.response.data.error);
      });
  };

  return (
    <>
      <div>
        <Toaster />
      </div>

      <div className="min-h-[85vh] flex flex-col justify-center items-center mx-4 max-sm:mt-5">
        <div className="bg-slate-300 rounded-lg h-auto p-5 flex flex-col shadow-xl w-auto">
          <h1 className="flex justify-center mb-3 font-semibold">
            Register Your Event
          </h1>
          <div className="flex flex-row flex-wrap gap-5">
            <div className="flex flex-col">
              <form action="" method="post">
                <div className="flex flex-row  justify-between my-3 gap-7">
                  <label>Name</label>
                  <input
                    className="rounded-[5px] w-[200px] outline-none pl-2"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-row justify-between my-3 gap-7 w-[350px]">
                  <label>Email</label>
                  <input
                    className="rounded-[5px] w-[200px] outline-none pl-2"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-row justify-between my-3 gap-7 w-[350px]">
                  <label>Mobile Number</label>
                  <input
                    className="rounded-[5px] w-[200px] outline-none pl-2"
                    type="text"
                    required
                    min={getCurrentDate()}
                    value={form.mobileno}
                    onChange={(e) => {
                      setForm({ ...form, mobileno: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-row justify-between my-3 gap-7 w-[350px]">
                  <label>Date</label>
                  <input
                    className="rounded-[5px] w-[200px] outline-none pl-2"
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => {
                      setForm({ ...form, date: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-row justify-between my-3 gap-7 w-[350px]">
                  <label>Clubname</label>
                  <input
                    className="rounded-[5px] w-[200px] outline-none pl-2"
                    type="text"
                    required
                    value={form.clubname}
                    onChange={(e) => {
                      setForm({ ...form, clubname: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-row justify-between my-3 gap-7 w-[350px]">
                  <label>Approved By</label>
                  <input
                    className="rounded-[5px] w-[200px] outline-none pl-2"
                    type="text"
                    required
                    value={form.approve}
                    onChange={(e) => {
                      setForm({ ...form, approve: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-row justify-between my-3 gap-7 w-[350px]">
                  <label>PDF</label>
                  <input
                    className="rounded-[5px] w-[200px] outline-none pl-2"
                    type="file"
                    required
                    value={form.file}
                    onChange={(e) => {
                      pdfToBinary(e);
                      setForm({ ...form, file: e.target.value });
                    }}
                  />
                </div>
              </form>
            </div>

            <div className="flex flex-row justify-between my-3 gap-7 w-[350px]">
              <textarea
                name="Description"
                cols="30"
                required
                rows="4"
                className="rounded-lg p-5 outline-none resize-none h-full w-full"
                placeholder="Enter Description"
                value={form.eventdescription}
                onChange={(e) => {
                  setForm({ ...form, eventdescription: e.target.value });
                }}
              ></textarea>
            </div>
          </div>
          <div className="flex my-4">
            <FormControl sx={{ m: 1, width: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Start</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-multiple-name"
                value={form.startTime}
                label="time"
                onChange={(e) => {
                  setForm({ ...form, startTime: Number(e.target.value) });
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      height: 200,
                      width: 120,
                    },
                  },
                }}
              >
                {option.map((val) => (
                  <MenuItem key={val} value={val}>
                    {convertMinutesToTime(val)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 120 }} size="small">
              <InputLabel id="demo-select-small-label">End</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-multiple-name"
                value={form.endTime}
                label="time"
                onChange={(e) => {
                  setForm({ ...form, endTime: Number(e.target.value) });
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      height: 200,
                      width: 120,
                    },
                  },
                }}
              >
                {option.map((val) => {
                  if (form.startTime < val) {
                    return (
                      <MenuItem key={val} value={val}>
                        {convertMinutesToTime(val)}
                      </MenuItem>
                    );
                  } else {
                    return <></>;
                  }
                })}
              </Select>
            </FormControl>
          </div>
          <button
            className="border-[2px] border-slate-700  w-[200px] hover:bg-slate-400 text-black shadow-lg font-semibold h-[45px]  py-1 px-3 rounded-lg"
            onClick={handleSave}
            type="submit"
          >
            Send Request
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddEvent;
