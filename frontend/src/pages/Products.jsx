import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ProductCard from "../components/ui/ProductCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import axiosInstance from "../utils/axiosInstance";
import { categories } from "../data/placeholder";
import { useSearchParams } from "react-router-dom";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];


export default function Products() {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) {
      setSelectedCategory(catFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          search: search || undefined,
          category: selectedCategory.toLowerCase(),
          sort: sortBy,
        };

        const response = await axiosInstance.get("/products/filter", { params });
        setProducts(response.data);
      } catch (err) {
        console.log("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory, sortBy]);

  const { theme } = useTheme();
  const isDark = theme === "dark";


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
          All Products
        </h1>
        <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Showing {products.length} products
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
              isDark ? "input-dark" : "input-light"
            }`}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`appearance-none pl-4 pr-10 py-3 rounded-xl text-sm cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
              isDark ? "input-dark" : "input-light"
            }`}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`sm:hidden flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
            isDark
              ? "bg-surface-dark-3 text-zinc-300 border border-purple-500/20"
              : "bg-purple-50 text-zinc-600 border border-purple-200"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside
          className={`hidden sm:block w-56 shrink-0 space-y-6 ${
            showFilters ? "!block" : ""
          }`}
        >
          <div>
            <h3
              className={`text-sm font-semibold mb-3 ${
                isDark ? "text-zinc-200" : "text-zinc-800"
              }`}
            >
              Categories
            </h3>
            <div className="space-y-1">
              {["All", ...categories.map((c) => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? isDark
                        ? "bg-purple-500/15 text-purple-400 font-medium"
                        : "bg-purple-50 text-purple-600 font-medium"
                      : isDark
                      ? "text-zinc-400 hover:text-purple-300 hover:bg-purple-500/10"
                      : "text-zinc-500 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className={`text-lg ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                No products found
              </p>
              <p className={`text-sm mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
