import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Package2,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ui/ThemeToggle";

const sidebarLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col transition-all duration-300 border-r ${
        collapsed ? "w-[72px]" : "w-64"
      } ${
        isDark
          ? "bg-surface-dark-2 border-purple-500/10"
          : "bg-white border-purple-100"
      }`}
    >
      <div className={`flex items-center h-16 px-4 border-b ${
        isDark ? "border-purple-500/10" : "border-purple-100"
      }`}>
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center shrink-0">
            <Package2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
              Admin
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? isDark
                    ? "bg-purple-500/15 text-purple-400"
                    : "bg-purple-50 text-purple-600"
                  : isDark
                  ? "text-zinc-400 hover:text-purple-300 hover:bg-purple-500/10"
                  : "text-zinc-500 hover:text-purple-600 hover:bg-purple-50"
              }`
            }
            title={collapsed ? link.name : undefined}
          >
            <link.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{link.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`p-3 border-t space-y-2 ${isDark ? "border-purple-500/10" : "border-purple-100"}`}>
        <div className={`flex ${collapsed ? "justify-center" : "justify-between"} items-center`}>
          {!collapsed && <ThemeToggle />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
              isDark
                ? "text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10"
                : "text-zinc-500 hover:text-purple-600 hover:bg-purple-50"
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            collapsed ? "justify-center" : ""
          } ${
            isDark
              ? "text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
              : "text-zinc-500 hover:text-red-600 hover:bg-red-50"
          }`}
          title={collapsed ? "Back to Store" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
      </div>
    </aside>
  );
}
