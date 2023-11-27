import codebase from "../assets/codebase.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function Footer() {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    if (token) {
      localStorage.removeItem("authtoken");
      navigate("/");
      setUser(false);
    } else {
      navigate("/login");
      setUser(true);
    }
  };
  const token = localStorage.getItem("authtoken");

  return (
    <>
      <div className="flex flex-col  bg-slate-800 ">
        <div className="flex flex-col  md:flex-row lg:flex-row lg:justify-between items-center bg-slate-800 ">
          <div className="w-full md:w-10px lg:w-20px xl:10px p-5">
            <div className=" flex items-center md:w-10px lg:w-20px xl:10px justify-center">
              <img src={codebase} alt="codebase" className=" md:mt-8 w-24" />
              <p className=" text-3xl  font-semibold  text-slate-200 inline-block font-mono md:mt-8">
              CODEBASE IIIT KOTA 
              </p>
            </div>
          </div>
          <div className=" flex flex-col text-left w-full md:w-10px lg:w-20px xl:10px p-5 justify-center items-center font-mono">
            <p className="text-left text-3xl  text-slate-200 my-1 font-mono font-bold">Links</p>
            <div className="flex flex-col space-y-2 font-mono text-left max-md:items-center ">
              <Link to="/" className="text-left text-gray-400">
                Home
              </Link>
              <Link to="/request" className="text-left text-gray-400">
                Book Now
              </Link>
              <a href="" className="text-left text-gray-400" onClick={handleAdminClick}>
                {token ? "LogOut" : "Admin Login"}
              </a>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-10px lg:w-20px xl:10px p-5 justify-center max-md:items-center">
            <p className="flex-col text-3xl  text-slate-200 my-1 font-mono font-bold "> Contact Us</p>
            <div className="flex flex-col space-y-2 font-mono max-md:items-center text-left">
              <p className=" text-gray-400">
                <Link
                  to="https://github.com/ikcb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-left text-gray-400"
                >
                  Git Hub
                </Link>
              </p>
              <p className="text-left text-gray-400">
              <Link
                  to="https://www.instagram.com/iiitkota_codebase/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-left text-gray-400">
                Instagram
                </Link>
              </p>

              <p className="text-left text-gray-400">
                <Link
                  to="https://iiitkota.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-left text-gray-400"
                >
                 IIIT Kota Main Website
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex  justify-center  md:w-10px lg:w-20px xl:10px p-4 ">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Codebase India. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

export default Footer;
