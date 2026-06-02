import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/ui/Button";
import axiosInstance from "../../utils/axiosInstance";

const normalizeProduct = (product) => ({
  ...product,
  id: product._id || product.id,
  image: product.imageUrl || product.image,
  inStock: product.stock !== undefined ? product.stock > 0 : product.inStock ?? true,
});

export default function ProductsList() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        const fetched = response.data?.products || [];
        setProducts(fetched.map(normalizeProduct));
      } catch (err) {
        console.log("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.log("Error deleting product:", err);
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
            Products
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Manage your product catalog
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button size="md">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
              isDark ? "input-dark" : "input-light"
            }`}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className={`rounded-2xl p-12 text-center ${isDark ? "card-dark" : "card-light"}`}
        >
          <Package
            className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-zinc-600" : "text-zinc-300"}`}
          />
          <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            {search ? "No products match your search" : "No products yet. Add your first product!"}
          </p>
        </div>
      ) : (
        <div className={`rounded-2xl overflow-hidden ${isDark ? "card-dark" : "card-light"}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-xs uppercase ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  <th className="text-left px-6 py-4 font-medium">Product</th>
                  <th className="text-left px-6 py-4 font-medium">Category</th>
                  <th className="text-left px-6 py-4 font-medium">Price</th>
                  <th className="text-left px-6 py-4 font-medium">Stock</th>
                  <th className="text-right px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-t transition-colors ${
                      isDark
                        ? "border-purple-500/5 hover:bg-purple-500/5"
                        : "border-purple-50 hover:bg-purple-50/50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <span
                          className={`font-medium line-clamp-1 ${
                            isDark ? "text-zinc-200" : "text-zinc-700"
                          }`}
                        >
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.category || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                        ₹{product.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.inStock
                            ? "text-green-500 bg-green-500/10"
                            : "text-red-500 bg-red-500/10"
                        }`}
                      >
                        {product.stock !== undefined ? `${product.stock} units` : product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? "text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10"
                              : "text-zinc-400 hover:text-purple-600 hover:bg-purple-50"
                          }`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            isDark
                              ? "text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                              : "text-zinc-400 hover:text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
