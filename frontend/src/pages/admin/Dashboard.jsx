import {
  ShoppingCart,
  IndianRupee, 
  Users,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [adminStats, setadminStats] = useState({totalUsers : 0, totalOrders : 0, totalProducts : 0, totalRevenueData : 0})
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])

  const handleGetAnalytics = async()=>{
    try{
      const response = await axiosInstance.get("/analytics")
      if(response.data){
        setadminStats(response.data);
      }
    }catch(err){
      console.log(err)
    }
  }

  const getRecentOrders = async()=>{
    try{const response = await axiosInstance.get("/orders/recent")
    if(response.data && ! response.data.error){
      setRecentOrders(response.data.orders)
    }}catch(err){
      if(err.response && err.response.data){
        console.log(err);
      }
    }
  }
  const getTopProducts = async()=>{
    try{
      const response = await axiosInstance.get("/orders/topSold")
      if(response.data && !response.data.error){
        console.log(response.data.topProducts)
        setTopProducts(response.data.topProducts)
      }
    }catch(err){
      if(err.response && err.response.data){
        console.log(err);
      }
    }
  }
  useEffect(()=>{
    handleGetAnalytics();
    getRecentOrders();
    getTopProducts();
  },[])

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${adminStats.totalRevenueData}`,
      icon: IndianRupee,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Total Orders",
      value: adminStats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Customers",
      value: adminStats.totalUsers,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Products",
      value: adminStats.totalProducts,
      icon: Package,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  const statusColors = {
    Delivered: "text-green-500 bg-green-500/10",
    Shipped: "text-blue-500 bg-blue-500/10",
    Processing: "text-yellow-500 bg-yellow-500/10",
    Pending: "text-zinc-400 bg-zinc-500/10",
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
          Dashboard
        </h1>
        <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Welcome back! Here's your store overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ title, value, icon: Icon, color, bg }) => (
          <div
            key={title}
            className={`rounded-2xl p-5 transition-all duration-300 hover:shadow-lg ${
              isDark
                ? "card-dark hover:shadow-purple-500/5"
                : "card-light hover:shadow-purple-200/30"
            }`}
          >
            <div className="mb-4">
              <div className={`p-2.5 rounded-xl inline-flex ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
              {value}
            </p>
            <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              {title}
            </p>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl p-6 ${isDark ? "card-dark" : "card-light"}`}>
        <h2 className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Top Products
        </h2>
        <div className="space-y-4">
          {topProducts.map((topProd, i) => (
            <div key={topProd.product._id} className="flex items-center gap-3">
              <span
                className={`w-6 text-xs font-bold text-center ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {i + 1}
              </span>
              <img
                src={topProd.product.imageUrl}
                alt={topProd.product.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium line-clamp-1 ${
                    isDark ? "text-zinc-200" : "text-zinc-700"
                  }`}
                >
                  {topProd.product.name}
                </p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  {topProd.totalSold} sold
                </p>
              </div>
              <span
                className={`text-sm font-bold ${isDark ? "text-white" : "text-zinc-900"}`}
              >
                ₹{topProd.product.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl p-6 mt-6 ${isDark ? "card-dark" : "card-light"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className={`text-sm font-medium transition-colors ${
              isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"
            }`}
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-xs uppercase ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                <th className="text-left pb-4 font-medium">Order</th>
                <th className="text-left pb-4 font-medium">Date</th>
                <th className="text-left pb-4 font-medium">Status</th>
                <th className="text-right pb-4 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
              {recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className={`border-t transition-colors ${
                    isDark
                      ? "border-purple-500/5 hover:bg-purple-500/5"
                      : "border-purple-50 hover:bg-purple-50/50"
                  }`}
                >
                  <td className="py-3.5 font-medium">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3.5">{order.createdAt.slice(0,10)}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className={`py-3.5 text-right font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
