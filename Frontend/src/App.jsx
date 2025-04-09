import { useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Home from "./Pages/Home";
import Request from "./Pages/Request";
import Login from "./Pages/Login";

import ViewRequests from "./Pages/ViewRequests";
// import Footer from "./Component/Footer";

const App = () => {
  const [home, setHome] = useState(true);

  return (
    <>
      <div className="font-['Poppins'] h-[90vh]">
        <Router>
          <Navbar home={home} setHome={setHome} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/request" element={<Request />} />
            <Route path="/viewrequest" element={<ViewRequests />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </>
  );
};

export default App;
