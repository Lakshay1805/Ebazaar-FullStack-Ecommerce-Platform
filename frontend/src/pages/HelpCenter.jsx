import { useState } from "react";
import { HelpCircle, ChevronDown, UserPlus, KeyRound, Package, CreditCard, Headphones, MailWarning } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const faqs = [
  {
    icon: UserPlus,
    question: "How do I create an account?",
    answer: "Click the Sign Up button and complete the registration process using your email address.",
  },
  {
    icon: KeyRound,
    question: "How do I reset my password?",
    answer: "Use the Forgot Password option on the login page and follow the instructions sent to your email.",
  },
  {
    icon: Package,
    question: "How can I track my order?",
    answer: "Visit the Orders section of your account to view the latest order status.",
  },
  {
    icon: CreditCard,
    question: "What payment methods are supported?",
    answer: "Payments are processed securely through our integrated payment gateway.",
  },
  {
    icon: Headphones,
    question: "How do I contact support?",
    answer: "For assistance, please use the Contact Us page or reach out through the support email provided on the platform.",
  },
  {
    icon: MailWarning,
    question: "Why am I not receiving verification emails?",
    answer: "Check your spam or junk folder and ensure that the email address entered during registration is correct.",
  },
];

export default function HelpCenter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Help <span className="text-gradient">Center</span>
        </h1>
        <div className="w-16 h-1 gradient-purple rounded-full mx-auto mb-4" />
        <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Find answers to commonly asked questions
        </p>
      </div>

      <div className={`rounded-2xl p-8 sm:p-10 mb-8 ${isDark ? "card-dark" : "card-light"}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className={`p-2.5 rounded-xl ${isDark ? "bg-purple-500/15" : "bg-purple-100"}`}>
            <HelpCircle className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map(({ icon: Icon, question, answer }, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden transition-all duration-300 ${
                isDark
                  ? "bg-purple-500/5 hover:bg-purple-500/10"
                  : "bg-purple-50/50 hover:bg-purple-50"
              } ${openIndex === index ? (isDark ? "bg-purple-500/10" : "bg-purple-50") : ""}`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center gap-4 p-4 cursor-pointer"
              >
                <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-purple-500/15" : "bg-purple-100"}`}>
                  <Icon className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                </div>
                <span className={`flex-1 text-left text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
                  {question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  } ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className={`px-4 pb-4 pl-16 text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
