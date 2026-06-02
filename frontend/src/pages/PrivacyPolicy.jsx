import { Shield, Mail, MapPin, ClipboardList, ShoppingCart, UserCheck, HeadphonesIcon, TrendingUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const collectedInfo = [
  { icon: UserCheck, text: "Name" },
  { icon: Mail, text: "Email address" },
  { icon: MapPin, text: "Shipping address" },
  { icon: ClipboardList, text: "Order history" },
];

const usageReasons = [
  { icon: ShoppingCart, text: "Process orders" },
  { icon: UserCheck, text: "Verify user accounts" },
  { icon: HeadphonesIcon, text: "Provide customer support" },
  { icon: TrendingUp, text: "Improve our services" },
];

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Privacy <span className="text-gradient">Policy</span>
        </h1>
        <div className="w-16 h-1 gradient-purple rounded-full mx-auto" />
      </div>

      <div className={`rounded-2xl p-8 sm:p-10 mb-8 ${isDark ? "card-dark" : "card-light"}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2.5 rounded-xl ${isDark ? "bg-purple-500/15" : "bg-purple-100"}`}>
            <Shield className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          </div>
          <p className={`text-base font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
            Your privacy is important to us.
          </p>
        </div>
        <p className={`text-base leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
          We collect only the information necessary to provide our services, including account details,
          order information, and contact information.
        </p>
      </div>

      <div className={`rounded-2xl p-8 sm:p-10 mb-8 ${isDark ? "card-dark" : "card-light"}`}>
        <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Information Collected
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collectedInfo.map(({ icon: Icon, text }) => (
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

      <div className={`rounded-2xl p-8 sm:p-10 mb-8 ${isDark ? "card-dark" : "card-light"}`}>
        <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>
          How We Use Your Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {usageReasons.map(({ icon: Icon, text }) => (
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

      <div className={`rounded-2xl p-8 sm:p-10 mb-8 ${isDark ? "card-dark" : "card-light"}`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Data Sharing
        </h2>
        <p className={`text-base leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
          We do not sell or share your personal information with third parties except when required to
          process payments, fulfill orders, or comply with legal obligations.
        </p>
      </div>

      <div className={`rounded-2xl p-8 sm:p-10 ${isDark ? "card-dark" : "card-light"}`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Security & Agreement
        </h2>
        <p className={`text-base leading-relaxed mb-4 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
          We take reasonable measures to protect your information and maintain account security.
        </p>
        <p className={`text-base leading-relaxed font-medium ${isDark ? "text-purple-400" : "text-purple-600"}`}>
          By using this platform, you agree to the practices described in this Privacy Policy.
        </p>
      </div>
    </div>
  );
}
