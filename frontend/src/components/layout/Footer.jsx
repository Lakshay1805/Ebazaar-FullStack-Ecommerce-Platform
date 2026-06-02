import { Link } from "react-router-dom";
import { Package, Globe, MessageCircle, Share, Mail, ArrowRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const footerLinks = {
  Shop: [
    { name: "All Products", path: "/products" },
    { name: "Electronics", path: "/products?category=Electronics" },
    { name: "Clothing", path: "/products?category=Clothing" },
    { name: "Accessories", path: "/products?category=Accessories" },
  ],
  Support: [
    { name: "Help Center", path: "/help-center" },
    { name: "Order Status", path: "/orders" },
  ],
  Company: [
    { name: "About Us", path: "/about" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms-of-service" },
  ],
};

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post("/subscription", {
        email,
      });

      if (response.data?.success) {
        console.log("subscribed successfully");
        setEmail("");
      } else {
        console.log("subscription failed");
      }
    } catch (err) {
      console.log("error:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer
      className={`border-t ${isDark ? "bg-surface-dark-2 border-purple-500/10" : "bg-surface-light-2 border-purple-100"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                Eba<span className="text-gradient">zaar</span>
              </span>
            </Link>
            <p className={`text-sm max-w-xs mb-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Discover premium products curated for the modern lifestyle. Quality meets elegance in
              every purchase.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? "input-dark" : "input-light"
                  }`}
              />
              <button disabled={loading} onClick={handleSubscribe} className="p-2.5 rounded-xl gradient-purple text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3
                className={`text-sm font-semibold mb-4 ${isDark ? "text-white" : "text-zinc-900"
                  }`}
              >
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`text-sm transition-colors duration-300 ${isDark
                        ? "text-zinc-400 hover:text-purple-400"
                        : "text-zinc-500 hover:text-purple-600"
                        }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? "border-purple-500/10" : "border-purple-100"
            }`}
        >
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            © 2026 Ebazaar. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}
