import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";

export default function Cart() {
  const { cartItems: items, updateQuantity, removeFromCart } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
            isDark ? "bg-purple-500/10" : "bg-purple-50"
          }`}
        >
          <ShoppingBag className={`w-10 h-10 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Your cart is empty
        </h2>
        <p className={`text-sm mb-8 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Looks like you haven't added any products yet
        </p>
        <Link to="/products">
          <Button size="lg">
            Continue Shopping <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-zinc-900"}`}>
        Shopping Cart
        <span className={`text-sm font-normal ml-3 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          ({items.length} items)
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex gap-4 p-4 rounded-2xl transition-all duration-300 ${
                isDark ? "card-dark" : "card-light"
              }`}
            >
              <Link to={`/products/${item.id}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.id}`}
                  className={`font-semibold text-sm sm:text-base line-clamp-1 hover:text-purple-500 transition-colors ${
                    isDark ? "text-zinc-100" : "text-zinc-800"
                  }`}
                >
                  {item.name}
                </Link>
                <p className={`text-xs mt-0.5 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {item.category}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div
                    className={`flex items-center rounded-lg overflow-hidden ${
                      isDark
                        ? "bg-surface-dark-3 border border-purple-500/20"
                        : "bg-purple-50 border border-purple-200"
                    }`}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className={`p-2 transition-colors cursor-pointer disabled:opacity-40 ${
                        isDark ? "hover:bg-purple-500/20" : "hover:bg-purple-100"
                      }`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className={`w-8 text-center text-sm font-medium ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={`p-2 transition-colors cursor-pointer ${
                        isDark ? "hover:bg-purple-500/20" : "hover:bg-purple-100"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}
                    >
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                        isDark
                          ? "text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                          : "text-zinc-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div
            className={`rounded-2xl p-6 sticky top-24 ${
              isDark ? "card-dark" : "card-light"
            }`}
          >
            <h2
              className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}
            >
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>Subtotal</span>
                <span className={isDark ? "text-zinc-200" : "text-zinc-700"}>
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>Shipping</span>
                <span className={shipping === 0 ? "text-green-500 font-medium" : isDark ? "text-zinc-200" : "text-zinc-700"}>
                  {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>Tax</span>
                <span className={isDark ? "text-zinc-200" : "text-zinc-700"}>
                  ₹{tax.toFixed(2)}
                </span>
              </div>
              <div className={`border-t pt-4 ${isDark ? "border-purple-500/10" : "border-purple-100"}`}>
                <div className="flex justify-between">
                  <span className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Total
                  </span>
                  <span className={`text-xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="block mt-6">
              <Button className="w-full" size="lg">
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link
              to="/products"
              className={`block text-center text-sm mt-4 transition-colors ${
                isDark ? "text-zinc-400 hover:text-purple-400" : "text-zinc-500 hover:text-purple-600"
              }`}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
