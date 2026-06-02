import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useAsyncError, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  Package,
  LogOut,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import axiosInstance from "../../utils/axiosInstance";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Orders", path: "/orders" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [admin, setAdmin] = useState(false)
  const isLoggedIn = !!localStorage.getItem("token");

  const checkAdmin = async()=>{
    try{const response = await axiosInstance.get("/user/profile")
    if(response.data && !response.data.error){
      if(response.data.user.role === 'admin'){
        setAdmin(true);
      }
    }}catch(err){
      console.log(err)
    }
  }
  

  const { cartCount } = useCart();

  useEffect(() => {
    checkAdmin();
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async() => {
    try{const response = await axiosInstance.post("/user/logout")
    if(response.data && response.data.error == false){
      localStorage.removeItem("token");
      setProfileOpen(false);
      setMobileOpen(false);
    }}catch(err){
      console.log(err)
      return
    }
    navigate("/login")
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark ? "glass-dark" : "glass-light"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span
              className={`text-xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              Eba<span className="text-gradient">zaar</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? isDark
                        ? "bg-purple-500/15 text-purple-400"
                        : "bg-purple-50 text-purple-600"
                      : isDark
                      ? "text-zinc-400 hover:text-purple-300 hover:bg-purple-500/10"
                      : "text-zinc-600 hover:text-purple-600 hover:bg-purple-50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                isDark
                  ? "text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10"
                  : "text-zinc-500 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Search className="w-5 h-5" onClick={()=> navigate("/products")}/>
            </button>

            <ThemeToggle />

            <Link
              to="/cart"
              className={`relative p-2 rounded-xl transition-all duration-300 ${
                isDark
                  ? "text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10"
                  : "text-zinc-500 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white gradient-purple rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                    profileOpen
                      ? isDark
                        ? "bg-purple-500/15 text-purple-400"
                        : "bg-purple-50 text-purple-600"
                      : isDark
                      ? "text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10"
                      : "text-zinc-500 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>

                {profileOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-52 rounded-2xl p-2 shadow-xl animate-fade-in border ${
                      isDark
                        ? "bg-surface-dark-2 border-purple-500/15 shadow-purple-500/5"
                        : "bg-white border-purple-100 shadow-purple-200/20"
                    }`}
                  >
                    <Link
                      to="/orders"
                      onClick={() => setProfileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isDark
                          ? "text-zinc-300 hover:text-purple-300 hover:bg-purple-500/10"
                          : "text-zinc-600 hover:text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      <ClipboardList className="w-4 h-4" />
                      My Orders
                    </Link>

                    {admin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                          isDark
                            ? "text-zinc-300 hover:text-purple-300 hover:bg-purple-500/10"
                            : "text-zinc-600 hover:text-purple-600 hover:bg-purple-50"
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div
                      className={`my-1 border-t ${
                        isDark ? "border-purple-500/10" : "border-purple-100"
                      }`}
                    />

                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                        isDark
                          ? "text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                          : "text-zinc-500 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDark
                    ? "text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10"
                    : "text-zinc-500 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Link
              to="/cart"
              className={`relative p-2 rounded-xl ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white gradient-purple rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-xl cursor-pointer ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className={`md:hidden animate-slide-down border-t ${
            isDark
              ? "bg-surface-dark border-purple-500/10"
              : "bg-white border-purple-100"
          }`}
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? isDark
                        ? "bg-purple-500/15 text-purple-400"
                        : "bg-purple-50 text-purple-600"
                      : isDark
                      ? "text-zinc-400 hover:text-purple-300 hover:bg-purple-500/10"
                      : "text-zinc-600 hover:text-purple-600 hover:bg-purple-50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {isLoggedIn && admin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? isDark
                        ? "bg-purple-500/15 text-purple-400"
                        : "bg-purple-50 text-purple-600"
                      : isDark
                      ? "text-zinc-400 hover:text-purple-300 hover:bg-purple-500/10"
                      : "text-zinc-600 hover:text-purple-600 hover:bg-purple-50"
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </NavLink>
            )}

            <div
              className={`my-2 border-t ${
                isDark ? "border-purple-500/10" : "border-purple-100"
              }`}
            />

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isDark
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isDark
                    ? "text-zinc-400 hover:text-purple-300 hover:bg-purple-500/10"
                    : "text-zinc-600 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                Login / Register
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
