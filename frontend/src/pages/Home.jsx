import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  CreditCard,
  Star,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ProductCard from "../components/ui/ProductCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import Button from "../components/ui/Button";
import { categories } from "../data/placeholder";
import axiosInstance from "../utils/axiosInstance";

const normalizeProduct = (product) => ({
  ...product,
  id: product._id || product.id,
  image: product.imageUrl || product.image,
  rating: product.ratings ?? product.rating ?? 0,
  reviews: product.numReviews ?? product.reviews ?? 0,
  inStock: product.stock !== undefined ? product.stock > 0 : product.stock ?? true,
});

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post("/subscription", {
        email: email
      })
      if (response.data && response.data.success) {
        console.log("subscribed successfully")
        setEmail("")
      }
    } catch (err) {
      if (err.response && err.response.data) {
        console.log("error : ", err)
      }
    } finally {
      setLoading(false)
    }
  }

  const categoryCounts = products.reduce((acc, product) => {
    const category = product.category;

    acc[category] = (acc[category] || 0) + 1;

    return acc;
  }, {});

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        const fetchedProducts = response.data?.products || [];
        setProducts(fetchedProducts.map(normalizeProduct));
      } catch (err) {
        if (err.response && err.response.data) {
          console.log(err);
        }
      } finally {
        setLoadingProducts(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="animate-fade-in">
      <section
        className={`relative overflow-hidden ${isDark ? "gradient-hero" : "gradient-hero-light"}`}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 ${isDark
                  ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                  : "bg-purple-50 text-purple-600 border border-purple-200"
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              New Collection 2026
            </div>

            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 ${isDark ? "text-white" : "text-zinc-900"
                }`}
            >
              Discover the
              <br />
              <span className="text-gradient">Future of Shopping</span>
            </h1>

            <p
              className={`text-lg md:text-xl mb-8 max-w-lg ${isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
            >
              Curated collections of premium products designed for the modern lifestyle.
              Experience elegance in every detail.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="xl">
                  Shop Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="secondary" size="xl">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`border-y ${isDark ? "bg-surface-dark-2 border-purple-500/10" : "bg-surface-light-2 border-purple-100"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over ₹500" },
              { icon: ShieldCheck, label: "Secure Payment", desc: "100% protected" },
              { icon: CreditCard, label: "Easy Returns", desc: "30-day returns" },
              { icon: Star, label: "Premium Quality", desc: "Handpicked items" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"
                      }`}
                  >
                    {label}
                  </p>
                  <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
              Shop by Category
            </h2>
            <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Browse our curated collections
            </p>
          </div>
          <Link to="/products">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.name}`}
              className={`group flex flex-col items-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${isDark
                  ? "card-dark hover:shadow-lg hover:shadow-purple-500/10"
                  : "card-light hover:shadow-lg hover:shadow-purple-200/30"
                }`}
            >
              <span className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
                {cat.icon}
              </span>
              <span
                className={`text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}
              >
                {cat.name}
              </span>
              <span className={`text-xs mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                {categoryCounts[cat.name.toLowerCase()] || 0} items
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className={`py-16 ${isDark ? "bg-surface-dark-2" : "bg-surface-light-2"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                Featured Products
              </h2>
              <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                Hand-picked by our team
              </p>
            </div>
            <Link to="/products">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingProducts ? (
              [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className={`col-span-full text-center ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                No products found
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl gradient-purple p-8 md:p-16 text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative">
            Join Ebazaar Today
          </h2>
          <p className="text-purple-100 text-lg mb-8 max-w-lg mx-auto relative">
            Get exclusive access to new arrivals, special offers, and members-only deals.
          </p>
          <div className="relative flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl bg-white/15 text-white placeholder:text-purple-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
            />
            <button disabled={loading} onClick={handleSubscribe} className="px-6 py-3 rounded-xl bg-white text-purple-700 font-semibold hover:bg-purple-50 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Subscribing..." : "subscribe"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
