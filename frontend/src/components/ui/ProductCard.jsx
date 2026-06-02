import { useState } from "react";
import { Star, ShoppingCart, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const isDark = theme === "dark";
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className={`group block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${
        isDark
          ? "card-dark hover:shadow-purple-500/10"
          : "card-light hover:shadow-purple-200/50"
      }`}
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full gradient-purple text-white shadow-lg">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {product.stock == 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm px-4 py-2 rounded-full border border-white/30">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className={`text-xs font-medium mb-1 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
          {product.category}
        </p>
        <h3
          className={`font-semibold mb-2 line-clamp-1 transition-colors duration-300 ${
            isDark
              ? "text-zinc-100 group-hover:text-purple-300"
              : "text-zinc-800 group-hover:text-purple-600"
          }`}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : isDark
                    ? "text-zinc-600"
                    : "text-zinc-300"
                }`}
              />
            ))}
          </div>
          <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            ({product.numReviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
              ₹{product.price}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            disabled={product.stock == 0}
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
              added
                ? "bg-green-500 text-white"
                : product.stock > 0
                ? isDark
                  ? "bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white"
                  : "bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
}
