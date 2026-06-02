import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Package } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ui/ThemeToggle";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate  } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error , setError] = useState("")
  const navigate = useNavigate()
  
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    if(!form.name){
      setError("Please enter a valid name.")
      return;
    }
    if(!validateEmail(form.email)){
      setError("Please enter a valid email.")
      return;
    }
    if(!form.password){
      setError("Please enter a valid password.")
      return;
    }
    try{
      const response = await axiosInstance.post("/user/register" , {
        name : form.name,
        email : form.email,
        password : form.password
      })
      if(response.data && response.data.error){
        setError(response.data.error)
        return
      }
      if(response.data){
        navigate("/verify-account", { state: { email: form.email } })
      }
    }catch(err){
      console.log(err);
      console.log(err.response?.data);
      if(err.response && err.response.data){
        setError(err.response.data.message || err.response.data.error || "Something went wrong, Please try again!")
        return
      }
      setError("Server error.")
    }
    console.log("Register:", form);
  };

  const inputClass = `w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
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
            Create an account
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Join Ebazaar and start shopping
          </p>
        </div>

        <div className={`p-8 rounded-2xl ${isDark ? "card-dark" : "card-light shadow-xl"}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                Full Name
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                <input type="text" value={form.name} onChange={handleChange("name")} placeholder="John Doe" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="••••••••"
                  className={`${inputClass} !pr-10`}
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

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <Button type="submit" className="w-full" size="lg">
              Create Account
            </Button>
          </form>
        </div>

        <p className={`text-center text-sm mt-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Already have an account?{" "}
          <Link to="/login" className="text-purple-500 hover:text-purple-400 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
