import { ShieldCheck, UserCheck, FileText, ShieldAlert, Tag, ClipboardList, Ban } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const terms = [
  { icon: ShieldCheck, text: "Users are responsible for maintaining the security of their accounts." },
  { icon: UserCheck, text: "All information provided during registration must be accurate and up to date." },
  { icon: ShieldAlert, text: "Users must not attempt to misuse, disrupt, or gain unauthorized access to the platform." },
  { icon: Tag, text: "Product availability, pricing, and descriptions may be updated at any time." },
  { icon: ClipboardList, text: "Orders may be canceled or modified in accordance with store policies." },
  { icon: Ban, text: "We reserve the right to suspend accounts that violate these terms." },
];

export default function TermsOfService() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Terms of <span className="text-gradient">Service</span>
        </h1>
        <div className="w-16 h-1 gradient-purple rounded-full mx-auto" />
      </div>

      <div className={`rounded-2xl p-8 sm:p-10 mb-8 ${isDark ? "card-dark" : "card-light"}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2.5 rounded-xl ${isDark ? "bg-purple-500/15" : "bg-purple-100"}`}>
            <FileText className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          </div>
          <p className={`text-base font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
            Please read these terms carefully.
          </p>
        </div>
        <p className={`text-base leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
          By accessing and using this platform, you agree to comply with the following terms:
        </p>
      </div>

      <div className={`rounded-2xl p-8 sm:p-10 mb-8 ${isDark ? "card-dark" : "card-light"}`}>
        <div className="space-y-4">
          {terms.map(({ icon: Icon, text }, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                isDark
                  ? "bg-purple-500/5 hover:bg-purple-500/10"
                  : "bg-purple-50/50 hover:bg-purple-50"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isDark ? "bg-purple-500/15" : "bg-purple-100"}`}>
                <Icon className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <div className="flex items-start gap-3">
                <span className={`text-sm font-bold shrink-0 mt-0.5 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {index + 1}.
                </span>
                <span className={`text-sm leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                  {text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl p-8 sm:p-10 ${isDark ? "card-dark" : "card-light"}`}>
        <p className={`text-base leading-relaxed font-medium ${isDark ? "text-purple-400" : "text-purple-600"}`}>
          Continued use of the platform constitutes acceptance of these Terms of Service.
        </p>
      </div>
    </div>
  );
}
