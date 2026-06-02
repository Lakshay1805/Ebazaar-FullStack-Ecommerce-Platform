import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Package } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ui/ThemeToggle";
import axiosInstance from "../utils/axiosInstance";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [error, setError] = useState("")
  const isDark = theme === "dark";
  const location = useLocation()
  const email = location.state?.email;

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const code = otp.join("");
    try{
      const response = await axiosInstance.post("/user/verifyOtp",{
        email:email,
        otp:code
      })
      if(response.data && !response.data.error){
        navigate("/reset-password" , {state:{email}});
      }
    }catch(err){
      if(err.response && err.response.data){
        setError(err.response.data.message || "Server error, try again!")
      }
    }
    console.log("Verify OTP:", code);
    
  };
  const handleResendOtp = async(e) => {
    try{
      const response = await axiosInstance.post("/user/forgetPassword" , {
        email:email
      })
      if(response.status == 200){
        setError("")
      }
    }catch(err){
      if(err.response?.status == 404){
        setError(err.response.data.message)
        return
      }
      if(err.response && err.response.data){
        setError(err.response.data.message || "Server error, try again!")
        return
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${
        isDark ? "gradient-hero" : "gradient-hero-light"
      }`}
    >
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
              Eba<span className="text-gradient">zaar</span>
            </span>
          </Link>
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isDark ? "bg-purple-500/15" : "bg-purple-50"
          }`}>
            <ShieldCheck className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
            Verify OTP
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Enter the 6-digit code we sent to your email
          </p>
        </div>

        <div className={`p-8 rounded-2xl ${isDark ? "card-dark" : "card-light shadow-xl"}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-8 h-10 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:scale-105 ${
                    isDark ? "input-dark" : "input-light"
                  }`}
                />
              ))}
            </div>
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <Button type="submit" className="w-full" size="lg">
              Verify Code
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Didn't receive the code?{" "}
              <button
                className="text-purple-500 hover:text-purple-400 font-medium transition-colors cursor-pointer"
                onClick={handleResendOtp}
              >
                Resend
              </button>
            </p>
          </div>
        </div>

        <Link
          to="/forgot-password"
          className={`flex items-center justify-center gap-2 mt-6 text-sm transition-colors ${
            isDark ? "text-zinc-400 hover:text-purple-400" : "text-zinc-500 hover:text-purple-600"
          }`}
        >
          ← Back
        </Link>
      </div>
    </div>
  );
}
