import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Package, CheckCircle, PartyPopper } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ui/ThemeToggle";
import axiosInstance from "../utils/axiosInstance";
import { useEffect } from "react";

export default function VerifyUser() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hasSentOtp = useRef(false)

  const email = location.state?.email || "";

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

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    setError("");

    try{
      const response = await axiosInstance.post("/user/verifyUser",{
        email:email,
        otp:otp.join("")
      })
      if(response.data && response.data.error){
        setError(response.data.error.message)
        return
      }
      if(response.data && response.data.accessToken){
        localStorage.setItem("token",response.data.accessToken)
        setVerified(true)
      }
    }catch(err){
      if(err.response && err.response.data){
        setError(err.response.data.message || "Something went wrong, Please try again!")
        return;
      }
      setError("Server error. try again!")
    }
  };
  const handleResendOtp = async()=>{
    try{
      const response = await axiosInstance.post("/user/resendOtp",
        {email:email}
      )
      if(response.data && !response.data.error){
        setError("")
        return;
      }
    }catch(err){
      if(err.response && err.response.data){
        setError(err.response.data.message || "Server error, send again!")
      }
    }
  }
  useEffect(()=>{
    if(location.state?.resendOtp && !hasSentOtp.current){
      hasSentOtp.current = true;
      handleResendOtp();
    }
  },[])

  const handleContinue = () => {
    navigate("/");
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

          {!verified ? (
            <>
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  isDark ? "bg-purple-500/15" : "bg-purple-50"
                }`}
              >
                <ShieldCheck className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                Verify Your Account
              </h1>
              <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                We've sent a 6-digit code to{" "}
                {email ? (
                  <strong className={isDark ? "text-purple-400" : "text-purple-600"}>{email}</strong>
                ) : (
                  "your email"
                )}
              </p>
            </>
          ) : (
            <>
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  isDark ? "bg-green-500/15" : "bg-green-50"
                }`}
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                Account Verified!
              </h1>
              <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                Your account has been successfully verified. Welcome to Ebazaar!
              </p>
            </>
          )}
        </div>

        <div className={`p-8 rounded-2xl ${isDark ? "card-dark" : "card-light shadow-xl"}`}>
          {!verified ? (
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
                    onPaste={i === 0 ? handlePaste : undefined}
                    className={`w-8 h-10 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:scale-105 ${
                      isDark ? "input-dark" : "input-light"
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-xs text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" size="lg">
                Verify Account
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  isDark ? "bg-green-500/10 border border-green-500/20" : "bg-green-50 border border-green-200"
                }`}
              >
                <PartyPopper className="w-5 h-5 text-green-500 shrink-0" />
                <p className={`text-sm ${isDark ? "text-green-300" : "text-green-700"}`}>
                  You're all set! Start exploring our curated collection of premium products.
                </p>
              </div>

              <Button onClick={handleContinue} className="w-full" size="lg">
                Start Shopping
              </Button>
            </div>
          )}

          {!verified && (
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
          )}
        </div>

        {!verified && (
          <Link
            to="/register"
            className={`flex items-center justify-center gap-2 mt-6 text-sm transition-colors ${
              isDark ? "text-zinc-400 hover:text-purple-400" : "text-zinc-500 hover:text-purple-600"
            }`}
          >
            ← Back to Register
          </Link>
        )}
      </div>
    </div>
  );
}
