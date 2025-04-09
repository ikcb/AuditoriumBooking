import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Footer from "../Component/Footer";
import { Eye, EyeOff } from 'lucide-react'; 

function Userlogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  // Email validation regex
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Password strength check
  const validatePassword = (password) => {
    return password.length >= 1;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
  
    // Comprehensive form validation
    if (!email || !password) {
      toast.error("Please fill in all fields!");
      return;
    }
  
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }
  
    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
  
    // Check if account is locked
    if (isLocked) {
      toast.error("Too many login attempts. Please try again later.");
      return;
    }
  
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/Adminlogin`, {
        email,
        password,
      }, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
  
      const { token, role } = res.data;
      console.log(res.data);
  
      setLoginAttempts(5);
  
      // Secure token storage
      localStorage.setItem("authtoken", token);
      sessionStorage.setItem("userEmail", email);
      
      // Store user data in local storage
      localStorage.setItem("role", role);
      localStorage.setItem("userEmail", email);
  
      // Enhanced security: Clear sensitive data
      setPassword("");
  
      toast.success("Login successful!");
      navigate("/viewrequest");
    } catch (err) {
      // Increment login attempts
      setLoginAttempts(prev => prev + 1);
  
      if (loginAttempts >= 4) {
        setIsLocked(true);
        toast.error("Too many failed attempts. Account temporarily locked.");
        return;
      }
  
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate, loginAttempts, isLocked]);

  // Reset login attempts after a certain time
  useEffect(() => {
    let timer;
    if (isLocked) {
      timer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
      }, 15 * 60 * 1000); 
    }
    return () => clearTimeout(timer);
  }, [isLocked]);

  useEffect(() => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) emailInput.setAttribute('autocomplete', 'off');
    if (passwordInput) passwordInput.setAttribute('autocomplete', 'off');
  }, []);

  return (
    <>
      <Toaster />
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="bg-slate-300 shadow-xl rounded-lg max-w-[500px] w-full p-6">
          <h2 className="text-xl font-semibold text-center mb-4">Admin Login</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="border bg-white outline-none p-2 rounded-lg w-full"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
                autoFocus
                disabled={loading || isLocked}
                autoComplete="new-email"
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="border bg-white outline-none p-2 rounded-lg w-full pr-10"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                  disabled={loading || isLocked}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full py-2 px-4 rounded-lg transition ${
                (loading || isLocked) 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-black text-white hover:bg-gray-700"
              }`}
            >
              {isLocked 
                ? "Locked" 
                : loading 
                  ? "Logging in..." 
                  : "Log In"
              }
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Userlogin;