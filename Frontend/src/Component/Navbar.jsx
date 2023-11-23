/* eslint-disable react/prop-types */
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = ({ home, setHome }) => {
  const navigate = useNavigate();
  const handleBookClick = () => {
    if (home) {
      navigate("/request");
      setHome(false);
    } else {
      navigate("/");
      setHome(true);
    }
  };
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

  const handleViewClick = () => {
    if (user) {
      navigate("/login");
      setUser(false);
    } else {
      navigate("/");
      setUser(true);
    }
  };
  const token = localStorage.getItem("authtoken");
  return (
    <>
      <div className="NAV_DIV  flex flex-row justify-between items-center py-3 px-5  shadow-md mb-4">
        <Link to="/">
          <div className="LOGO translate-x-2 max-sm:translate-x-0">
            <img src={Logo} alt="LOGO" className="h-20 max-sm:h-16" />
          </div>
        </Link>

        <div>
          <p className="text-3xl font-semibold max-sm:hidden">
            Auditorium Booking Portal
          </p>
        </div>
        <div className="flex gap-3 justify-center items-center">
          <Link to="/viewrequest">
            <p
              className={
                token 
                  ? "NAV pb-0 font-semibold translate-x-[-10px]  px-3 flex justify-center max-sm:translate-x-[-20px] items-center py-4 cursor-pointer ": "hidden"
              }
              onClick={handleViewClick}
            >
              View Request
            </p>
          </Link>
          <p
            className=" NAV px-0 pb-0 font-semibold translate-x-[-10px] flex justify-center max-sm:translate-x-[-20px] items-center pt-4 cursor-pointer"
            onClick={handleBookClick}
          >
            {home ? "Book Now" : "Home"}
          </p>
          <button
            className=" bg-slate-800 hover:bg-transparent hover:text-black font-semibold hover:border-black hover:border-solid hover:border-[1.5px] outline-none text-white rounded-[120px] px-3 w-[120px] h-[50px] max-sm:w-[80px] max-sm:h-[40px] flex justify-center items-center py-4 max-sm:py-3 max-sm:flex max-sm:justify-between max-sm:items-center"
            onClick={handleAdminClick}
          >
            {token ? "LogOut" : "Admin"}
          </button>
        </div>
      </div>
    </>
  );
};
export default Navbar;
