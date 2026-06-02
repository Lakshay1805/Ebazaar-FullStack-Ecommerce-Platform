import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";
import ProductCard from "../components/ui/ProductCard";
import axiosInstance from "../utils/axiosInstance";

export default function ProductDetails() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const [product, setProduct] = useState()
  const [products, setProducts] = useState([])
  const [addedToCart, setAddedToCart] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const isDark = theme === "dark";
  const isLoggedIn = !!localStorage.getItem("token");

  const getProductById = async () => {
    try {
      const response = await axiosInstance.get("/products/" + id)
      if (response.data && !response.data.error) {
        setProduct(response.data.product)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const getRelatedProducts = async () => {
    try {
      const response = await axiosInstance.get("/products")
      if (response.data && !response.data.error) {
        setProducts(response.data.products)
      }
    } catch (err) {
      if (err.response && err.response.data) {
        console.log(err)
      }
    }
  }
  useEffect(() => {
    getProductById();
    getRelatedProducts();
  }, [id])

  const handleRateProduct = async (rating) => {
    try {
      const response = await axiosInstance.post("/products/" + id, { rating });
      if (response.data && !response.data.error) {
        setProduct((prev) => ({
          ...prev,
          ratings: response.data.ratings,
          numReviews: response.data.numReviews,
        }));
        setRatingSubmitted(true);
        setTimeout(() => setRatingSubmitted(false), 2000);
      }
    } catch (err) {
      console.log("Rating failed:", err);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const relatedProducts = products
    .filter(
      (p) =>
        p._id !== product._id &&
        p.category === product.category
    )
    .slice(0, 4);

  const images = [product.imageUrl];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <nav className={`flex items-center gap-2 text-sm mb-8 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
        <Link to="/" className="hover:text-purple-500 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-purple-500 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className={isDark ? "text-purple-400" : "text-purple-600"}>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div
            className={`relative aspect-square rounded-2xl overflow-hidden ${isDark ? "card-dark" : "card-light"
              }`}
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-4 py-1.5 text-sm font-semibold rounded-full gradient-purple text-white shadow-lg">
                {product.badge}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${selectedImage === i
                    ? "border-purple-500 scale-105"
                    : isDark
                      ? "border-zinc-800 hover:border-purple-500/50"
                      : "border-zinc-200 hover:border-purple-300"
                  }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className={`text-sm font-medium mb-2 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
            {product.category}
          </p>
          <h1 className={`text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => {
                const starIndex = i + 1;
                const isFilled = starIndex <= (hoverRating || userRating || Math.floor(product.ratings));
                return (
                  <Star
                    key={i}
                    className={`w-5 h-5 transition-colors duration-150 ${
                      isLoggedIn ? "cursor-pointer" : ""
                    } ${
                      isFilled
                        ? "text-yellow-400 fill-yellow-400"
                        : isDark
                          ? "text-zinc-600"
                          : "text-zinc-300"
                    }`}
                    onMouseEnter={() => isLoggedIn && setHoverRating(starIndex)}
                    onMouseLeave={() => isLoggedIn && setHoverRating(0)}
                    onClick={() => {
                      if (!isLoggedIn) return;
                      setUserRating(starIndex);
                      handleRateProduct(starIndex);
                    }}
                  />
                );
              })}
            </div>
            <span className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              {product.ratings?.toFixed(1) || 0} ({product.numReviews} reviews)
            </span>
            {ratingSubmitted && (
              <span className="text-xs text-green-500 font-medium">✓ Rated</span>
            )}
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className={`text-3xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className={`text-lg line-through ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  ₹{product.originalPrice}
                </span>
                <span className="text-sm font-semibold text-green-500">
                  Save ₹{(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          <p className={`whitespace-pre-line text-sm leading-relaxed mb-8 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            {product.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div
              className={`flex items-center rounded-xl overflow-hidden ${isDark ? "bg-surface-dark-3 border border-purple-500/20" : "bg-purple-50 border border-purple-200"
                }`}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`p-3 transition-colors cursor-pointer ${isDark ? "hover:bg-purple-500/20" : "hover:bg-purple-100"
                  }`}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className={`w-12 text-center font-medium ${isDark ? "text-white" : "text-zinc-900"}`}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                className={`p-3 transition-colors cursor-pointer ${isDark ? "hover:bg-purple-500/20" : "hover:bg-purple-100"
                  }`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1 min-w-[200px]"
              disabled={product.stock == 0}
              onClick={() => {
                addToCart(product, quantity);
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
              }}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock > 0 ? (addedToCart ? "Added ✓" : "Add to Cart") : "Out of Stock"}
            </Button>

            {/* <button
              className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${isDark
                  ? "border-purple-500/20 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                  : "border-purple-200 text-zinc-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                }`}
              onClick={() => {
              }}
            >
              <Heart className="w-5 h-5" />
            </button> */}
          </div>

          <div
            className={`rounded-2xl p-5 space-y-4 ${isDark ? "card-dark" : "card-light"
              }`}
          >
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over ₹500" },
              { icon: ShieldCheck, title: "2-Year Warranty", desc: "Full coverage" },
              { icon: RotateCcw, title: "30-Day Returns", desc: "Easy returns" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
                    {title}
                  </p>
                  <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className={`text-2xl font-bold mb-8 ${isDark ? "text-white" : "text-zinc-900"}`}>
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
