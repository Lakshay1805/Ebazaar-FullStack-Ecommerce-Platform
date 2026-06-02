import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../utils/axiosInstance";

const statusConfig = {
  Delivered: { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle },
  Shipped: { color: "text-blue-500", bg: "bg-blue-500/10", icon: Truck },
  Pending: { color: "text-zinc-400", bg: "bg-zinc-500/10", icon: Clock },
};

const statusOptions = ["Pending", "Shipped", "Delivered"];

export default function AdminOrders() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders");
      if (response.data && !response.data.error) {
        setOrders(response.data.orders || []);
        console.log(response.data.orders)
      }
    } catch (err) {
      console.log("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (response.status === 201) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (err) {
      console.log("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
          All Orders
        </h1>
        <p className={`text-sm mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Manage and update order statuses
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center ${isDark ? "card-dark" : "card-light"}`}>
          <Package className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-zinc-600" : "text-zinc-300"}`} />
          <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            No orders yet.
          </p>
        </div>
      ) : (
        <div className={`rounded-2xl overflow-hidden ${isDark ? "card-dark" : "card-light"}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-xs uppercase ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  <th className="text-left px-6 py-4 font-medium">Order ID</th>
                  <th className="text-left px-6 py-4 font-medium">Customer</th>
                  <th className="text-left px-6 py-4 font-medium">Date</th>
                  <th className="text-left px-6 py-4 font-medium">Items</th>
                  <th className="text-right px-6 py-4 font-medium">Total</th>
                  <th className="text-left px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                {orders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.Pending;
                  const StatusIcon = status.icon;
                  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={order._id}
                      className={`border-t transition-colors ${
                        isDark
                          ? "border-purple-500/5 hover:bg-purple-500/5"
                          : "border-purple-50 hover:bg-purple-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className={`font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
                            {order.address?.fullName || "—"}
                          </p>
                          <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                            {order.address?.city}, {order.address?.state}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{orderDate}</td>
                      <td className="px-6 py-4">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select
                            value={order.status}
                            disabled={updatingId === order._id}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                              status.color
                            } ${status.bg} ${
                              isDark ? "border border-purple-500/10" : "border border-purple-100"
                            } ${updatingId === order._id ? "opacity-50" : ""}`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt} className={isDark ? "bg-zinc-900 text-zinc-300" : "bg-white text-zinc-700"}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${status.color}`}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
