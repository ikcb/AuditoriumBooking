import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Footer from "../Component/Footer";

function Userlogin() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    if (email === "" || password === "") {
      toast.error("Form can't be empty!");
      return;
    }

    e.preventDefault();
    const req = {
      email: email,
      password: password,
    };
    console.log(req);
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/Adminlogin`, req)
      .then((res) => {
        localStorage.setItem("authtoken", res.data.token);
        navigate("/viewrequest");
      })
      .catch((err) => {
        toast.error(err.response.data.error);
        console.log(err);
      });
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="min-h-[75vh]">
        <div className="bg-slate-300 shadow-xl rounded-lg relative top-10 max-w-[500px] m-auto flex items-center justify-center p-4">
          <div className="bg-slate-300 p-6 rounded-lg  w-full">
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="border bg-white outline-none p-2 rounded-lg w-full"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="border bg-white outline-none p-2 rounded-lg w-full password-input"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                required
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Userlogin;
