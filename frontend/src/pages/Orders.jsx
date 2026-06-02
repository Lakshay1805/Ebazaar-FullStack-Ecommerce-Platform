import { Link } from "react-router-dom";
import { Package, Truck, CheckCircle, Clock, ChevronRight, Eye, Mail } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getInitials } from "../utils/helper";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const statusConfig = {
  Delivered: { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle },
  Shipped: { color: "text-blue-500", bg: "bg-blue-500/10", icon: Truck },
  Processing: { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Package },
  Pending: { color: "text-zinc-400", bg: "bg-zinc-500/10", icon: Clock },
};

export default function Orders() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      if (response.data && !response.data.error) {
        setProfile({
          name: response.data.user.name,
          email: response.data.user.email,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMyOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders/myorders");
      if (response.data && !response.data.error) {
        setOrders(response.data.orders || []);
      }
    } catch (err) {
      console.log("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    getMyOrders();
  }, []);

  const user = {
    name: profile.name || "User",
    email: profile.email || "you@example.com",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div
        className={`rounded-2xl p-5 sm:p-6 mb-8 transition-all duration-300 ${
          isDark ? "card-dark" : "card-light"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-purple flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
            <span className="text-white text-lg sm:text-xl font-bold">
              {getInitials(user.name)}
            </span>
          </div>
          <div className="min-w-0">
            <h2
              className={`text-lg sm:text-xl font-bold truncate ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              {user.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Mail
                className={`w-3.5 h-3.5 shrink-0 ${
                  isDark ? "text-purple-400" : "text-purple-500"
                }`}
              />
              <span
                className={`text-sm truncate ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
        My Orders
      </h1>
      <p className={`text-sm mb-8 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
        Track your order progress and delivery status
      </p>

      {loadingOrders ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center ${isDark ? "card-dark" : "card-light"}`}>
          <Package className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-zinc-600" : "text-zinc-300"}`} />
          <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.Pending;
            const StatusIcon = status.icon;
            const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={order._id}
                className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                  isDark
                    ? "card-dark hover:shadow-purple-500/5"
                    : "card-light hover:shadow-purple-200/30"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3
                        className={`font-bold text-sm ${isDark ? "text-white" : "text-zinc-900"}`}
                      >
                        #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {order.status}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      Ordered on {orderDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                    <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-3 pt-4 border-t ${
                    isDark ? "border-purple-500/10" : "border-purple-100"
                  }`}
                >
                  <div className="flex-1">
                    <p className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                      {order.address?.city && `${order.address.city}, ${order.address.state}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
