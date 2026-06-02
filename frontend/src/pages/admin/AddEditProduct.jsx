import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, X, Save, ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/ui/Button";
import { categories } from "../../data/placeholder";
import axiosInstance from "../../utils/axiosInstance";

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isEditing = Boolean(id);
  const [products, setProducts] = useState([])
  const [error, setError] = useState("")

  const existingProduct = isEditing
    ? products.find((p) => p._id === id)
    : null;

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: 0,
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axiosInstance.get("/products")
        if (response.data && !response.data.error) {
          setProducts(response.data.products)
        }
      } catch (err) {
        if (err.response && err.response.data) {
          console.log(err);
        }
      }
    }
    getProducts();
  }, [])

  useEffect(() => {
    if (existingProduct) {
      setForm({
        name: existingProduct.name,
        price: existingProduct.price,
        category: existingProduct.category,
        description: existingProduct.description,
        stock: existingProduct.stock,
      });

      setImages([existingProduct.imageUrl]);
    }
  }, [existingProduct]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const response = await axiosInstance.put("/products/" + id, {
          name: form.name,
          price: form.price,
          category: form.category,
          description: form.description,
          stock: form.stock,
        });
      } else {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("description", form.description);
        formData.append("stock", form.stock);
        if (images.length > 0 && images[0] instanceof File) {
          formData.append("image", images[0]);
        }
        const response = await axiosInstance.post("/products", formData);
      }
      navigate("/admin/products");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? "input-dark" : "input-light"
    }`;

  return (
    <div className="p-6 lg:p-8 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${isDark
            ? "text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10"
            : "text-zinc-500 hover:text-purple-600 hover:bg-purple-50"
            }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
            {isEditing ? "Edit Product" : "Add New Product"}
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            {isEditing
              ? "Update the product information below"
              : "Fill in the details to add a new product"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`rounded-2xl p-6 space-y-5 ${isDark ? "card-dark" : "card-light"}`}>
          <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
            Basic Information
          </h2>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
              Product Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g. Wireless Headphones Pro"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Describe the product..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange("price")}
                placeholder="2999.00"
                className={inputClass}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange("stock")}
                placeholder="50"
                className={inputClass}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                Category
              </label>
              <select
                value={form.category}
                onChange={handleChange("category")}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        <div className={`rounded-2xl p-6 space-y-5 ${isDark ? "card-dark" : "card-light"}`}>
          <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
            Product Images
          </h2>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img instanceof File ? URL.createObjectURL(img) : img}
                    alt=""
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label
            className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${isDark
              ? "border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5"
              : "border-purple-200 hover:border-purple-400 hover:bg-purple-50"
              }`}
          >
            <Upload
              className={`w-8 h-8 mb-3 ${isDark ? "text-purple-400" : "text-purple-500"}`}
            />
            <p className={`text-sm font-medium ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
              Click to upload images
            </p>
            <p className={`text-xs mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              PNG, JPG or WEBP (max 5MB)
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg">
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

