import { useTheme } from "../../context/ThemeContext";

export default function SkeletonCard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl overflow-hidden animate-pulse-soft ${
        isDark ? "card-dark" : "card-light"
      }`}
    >
      <div className={`h-56 ${isDark ? "bg-surface-dark-3" : "bg-purple-50"}`} />

      <div className="p-4 space-y-3">
        <div className={`h-4 rounded-lg w-3/4 ${isDark ? "bg-surface-dark-3" : "bg-purple-50"}`} />
        <div className={`h-3 rounded-lg w-1/2 ${isDark ? "bg-surface-dark-3" : "bg-purple-50"}`} />
        <div className="flex justify-between items-center pt-2">
          <div className={`h-5 rounded-lg w-1/4 ${isDark ? "bg-surface-dark-3" : "bg-purple-50"}`} />
          <div className={`h-9 rounded-xl w-1/3 ${isDark ? "bg-surface-dark-3" : "bg-purple-50"}`} />
        </div>
      </div>
    </div>
  );
}
