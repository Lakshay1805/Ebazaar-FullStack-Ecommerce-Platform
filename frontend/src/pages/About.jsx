import { ShieldCheck, Mail, Search, ShoppingCart, CreditCard, LayoutDashboard } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const features = [
  { icon: ShieldCheck, text: "Secure user authentication" },
  { icon: Mail, text: "Email verification and password recovery" },
  { icon: Search, text: "Product browsing and search" },
  { icon: ShoppingCart, text: "Shopping cart and order management" },
  { icon: CreditCard, text: "Online payment integration" },
  { icon: LayoutDashboard, text: "Admin dashboard for product management" },
];

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
          About <span className="text-gradient">Us</span>
        </h1>
        <div className="w-16 h-1 gradient-purple rounded-full mx-auto" />
      </div>

      <div className={`rounded-2xl p-8 sm:p-10 mb-8 ${isDark ? "card-dark" : "card-light"}`}>
        <p className={`text-base leading-relaxed mb-6 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
          Welcome to our e-commerce platform, a modern online shopping experience built with the MERN stack.
        </p>
        <p className={`text-base leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
          Our goal is to provide a seamless and secure shopping experience where customers can browse products,
          manage orders, and complete purchases with ease.
        </p>
      </div>

      <div className={`rounded-2xl p-8 sm:p-10 mb-8 ${isDark ? "card-dark" : "card-light"}`}>
        <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Platform Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                isDark
                  ? "bg-purple-500/5 hover:bg-purple-500/10"
                  : "bg-purple-50/50 hover:bg-purple-50"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-purple-500/15" : "bg-purple-100"}`}>
                <Icon className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <span className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl p-8 sm:p-10 ${isDark ? "card-dark" : "card-light"}`}>
        <p className={`text-base leading-relaxed mb-4 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
          We are committed to delivering a fast, reliable, and user-friendly experience for every customer.
        </p>
        <p className={`text-base leading-relaxed font-medium ${isDark ? "text-purple-400" : "text-purple-600"}`}>
          Thank you for visiting our store.
        </p>
      </div>
    </div>
  );
}
