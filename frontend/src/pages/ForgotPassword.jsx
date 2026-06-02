import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Package } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ui/ThemeToggle";
import axiosInstance from "../utils/axiosInstance";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("")
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response = await axiosInstance.post("/user/forgetPassword" , {
        email:email
      })
      if(response.status == 200){
        setSubmitted(true);
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
          <h1 className={`text-2xl font-bold mt-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
            Forgot your password?
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            No worries, we'll send you an OTP to reset it
          </p>
        </div>

        <div className={`p-8 rounded-2xl ${isDark ? "card-dark" : "card-light shadow-xl"}`}>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      isDark ? "input-dark" : "input-light"
                    }`}
                  />
                </div>
              </div>
              {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
              <Button type="submit" className="w-full" size="lg">
                Send OTP
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                isDark ? "bg-purple-500/15" : "bg-purple-50"
              }`}>
                <Mail className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <p className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                We've sent an OTP to <strong>{email}</strong>. Check your inbox and enter the code.
              </p>
              <Link to="/verify-otp" state={{email}}>
                <Button className="w-full" size="lg">
                  Enter OTP
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/login"
          className={`flex items-center justify-center gap-2 mt-6 text-sm transition-colors ${
            isDark ? "text-zinc-400 hover:text-purple-400" : "text-zinc-500 hover:text-purple-600"
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    </div>
  );
}
