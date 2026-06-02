import { useTheme } from "../../context/ThemeContext";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const { theme } = useTheme();

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
    xl: "px-9 py-4 text-lg",
  };

  const variantClasses = {
    primary: "gradient-purple text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      theme === "dark"
        ? "bg-surface-dark-3 text-purple-300 border border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40"
        : "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 hover:border-purple-300",
    ghost:
      theme === "dark"
        ? "text-purple-300 hover:bg-purple-500/10"
        : "text-purple-600 hover:bg-purple-50",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25",
    outline:
      theme === "dark"
        ? "border border-zinc-700 text-zinc-300 hover:border-purple-500 hover:text-purple-400"
        : "border border-zinc-300 text-zinc-600 hover:border-purple-500 hover:text-purple-600",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
