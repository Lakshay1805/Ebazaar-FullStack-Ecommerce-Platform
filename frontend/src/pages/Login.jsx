import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Package } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const { theme } = useTheme();
  const navigate = useNavigate()
  const isDark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email.")
      return;
    }
    if (!password) {
      setError("Please enter a valid password.")
      return;
    }
    try {
      const response = await axiosInstance.post("/user/login", {
        email: email,
        password: password
      })
      if (response.data && response.data.error) {
        setError(response.data.error)
        return;
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken)
        navigate("/")
      }
    } catch (err) {

      if (err.response?.status === 403) {
        setError(err.response.data.message);
        navigate("/verify-account", {state:{email , resendOtp:true}})
        return;
      }

      if (err.response?.data) {
        setError(
          err.response.data.message ||
          err.response.data.error ||
          "Something went wrong, Please try again!"
        );
        return;
      }

      setError("Server error.");
    }
    console.log("Login:", { email, password });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? "gradient-hero" : "gradient-hero-light"
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
            Welcome back
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Sign in to your account to continue
          </p>
        </div>

        <div
          className={`p-8 rounded-2xl ${isDark ? "card-dark" : "card-light shadow-xl"
            }`}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? "input-dark" : "input-light"
                    }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? "input-dark" : "input-light"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"
                    }`}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                />
                <span className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-500 hover:text-purple-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
             {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

        </div>

        <p className={`text-center text-sm mt-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-500 hover:text-purple-400 font-medium transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
