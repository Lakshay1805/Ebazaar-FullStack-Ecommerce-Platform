import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Package, CheckCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ui/ThemeToggle";
import axiosInstance from "../utils/axiosInstance";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation()
  const email = location.state?.email;

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      console.log("clicked")
      const response = await axiosInstance.post("/user/resetPassword",{
        email:email,
        newPassword:password
      })
      console.log(email)
      console.log(password)
      if(response.data && !response.data.error){
        setSubmitted(true);
      }
    }
    catch(err){
      if(err.response && err.response.data){
        setError(err.response.data.message)
      }
    }
    console.log("Reset password:", { password, confirmPassword });
  };

  const inputClass = `w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
    isDark ? "input-dark" : "input-light"
  }`;

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
            Reset Password
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Create a new secure password
          </p>
        </div>

        <div className={`p-8 rounded-2xl ${isDark ? "card-dark" : "card-light shadow-xl"}`}>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  New Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      isDark ? "input-dark" : "input-light"
                    }`}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Reset Password
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                isDark ? "bg-green-500/15" : "bg-green-50"
              }`}>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>
                Password reset successfully!
              </h3>
              <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                Your password has been updated. You can now sign in with your new password.
              </p>
              <Button onClick={() => navigate("/login")} className="w-full" size="lg">
                Go to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
