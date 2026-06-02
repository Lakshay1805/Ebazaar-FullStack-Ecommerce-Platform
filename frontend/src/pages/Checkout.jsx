import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, MapPin, Truck, ShieldCheck, ChevronRight, CheckCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";
import axiosInstance from "../utils/axiosInstance";

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { cartItems: items, clearCart } = useCart();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
    isDark ? "input-dark" : "input-light"
  }`;

  const steps = [
    { num: 1, label: "Shipping", icon: MapPin },
    { num: 2, label: "Payment", icon: Wallet },
    { num: 3, label: "Confirm", icon: CheckCircle },
  ];

  const handleAddressChange = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const paymentRes = await axiosInstance.post("/payment/order", {
        amount: Math.round(total),
      });
      const razorpayOrder = paymentRes.data.order;

      console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Ebazaar",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await axiosInstance.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const orderItems = items.map((item) => ({
              productId: item.id,
              qty: item.quantity,
              price: item.price,
            }));

            await axiosInstance.post("/orders", {
              items: orderItems,
              totalAmount: total,
              address: {
                fullName: address.fullName,
                street: address.street,
                city: address.city,
                state: address.state,
                postalCode: Number(address.postalCode),
              },
              paymentId: response.razorpay_payment_id,
            });

            clearCart();
            navigate("/orders");
          } catch (err) {
            console.log("Order creation failed:", err);
            alert("Payment was successful but order creation failed. Please contact support.");
          }
        },
        prefill: {
          name: address.fullName,
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.log("Payment failed:", response.error);
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      console.log("Error initiating payment:", err);
      alert("Could not initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      handlePlaceOrder();
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <p className={`text-lg ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Your cart is empty. Add some products before checking out.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-zinc-900"}`}>
        Checkout
      </h1>

      <div className="flex items-center justify-center gap-4 mb-12">
        {steps.map(({ num, label, icon: Icon }, i) => (
          <div key={num} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= num
                    ? "gradient-purple text-white"
                    : isDark
                    ? "bg-surface-dark-3 text-zinc-500 border border-purple-500/10"
                    : "bg-purple-50 text-zinc-400 border border-purple-100"
                }`}
              >
                {step > num ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`hidden sm:block text-sm font-medium ${
                  step >= num
                    ? isDark
                      ? "text-purple-400"
                      : "text-purple-600"
                    : isDark
                    ? "text-zinc-500"
                    : "text-zinc-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 rounded ${
                  step > num
                    ? "gradient-purple"
                    : isDark
                    ? "bg-zinc-800"
                    : "bg-zinc-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className={`rounded-2xl p-6 space-y-5 ${isDark ? "card-dark" : "card-light"}`}>
                <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                  <MapPin className="w-5 h-5 text-purple-500" /> Shipping Address
                </h2>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={handleAddressChange("fullName")}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={handleAddressChange("street")}
                    placeholder="123 Main Street"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={handleAddressChange("city")}
                      placeholder="Mumbai"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={handleAddressChange("state")}
                      placeholder="Maharashtra"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={handleAddressChange("postalCode")}
                      placeholder="400001"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={handleAddressChange("phone")}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Continue to Payment <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className={`rounded-2xl p-6 space-y-5 ${isDark ? "card-dark" : "card-light"}`}>
                <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                  <Wallet className="w-5 h-5 text-purple-500" /> Payment Method
                </h2>

                <div
                  className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                    isDark
                      ? "border-purple-500/30 bg-purple-500/5"
                      : "border-purple-200 bg-purple-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                        Razorpay
                      </p>
                      <p className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                        Secure payment gateway
                      </p>
                    </div>
                    <span
                      className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isDark
                          ? "bg-green-500/15 text-green-400"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      Recommended
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {["UPI", "Credit Card", "Debit Card", "Netbanking", "Wallets"].map((method) => (
                      <span
                        key={method}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                          isDark
                            ? "bg-surface-dark-3 text-zinc-300 border border-purple-500/10"
                            : "bg-white text-zinc-600 border border-purple-100"
                        }`}
                      >
                        {method}
                      </span>
                    ))}
                  </div>

                  <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                    You'll be redirected to Razorpay's secure checkout page to complete your payment.
                    All major payment methods accepted.
                  </p>
                </div>

                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                  isDark ? "bg-purple-500/10 text-purple-300" : "bg-purple-50 text-purple-600"
                }`}>
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Your payment is secured with 256-bit SSL encryption
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1">
                    Review Order <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={`rounded-2xl p-6 space-y-6 ${isDark ? "card-dark" : "card-light"}`}>
                <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                  <CheckCircle className="w-5 h-5 text-purple-500" /> Review Order
                </h2>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium line-clamp-1 ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
                          {item.name}
                        </p>
                        <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className={`text-sm font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl ${
                  isDark ? "bg-surface-dark-3 border border-purple-500/10" : "bg-purple-50/50 border border-purple-100"
                }`}>
                  <p className={`text-sm font-medium mb-1 ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
                    Shipping to
                  </p>
                  <p className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {address.fullName}, {address.street}, {address.city}, {address.state} - {address.postalCode}
                  </p>
                </div>

                <div className={`flex items-center gap-3 p-4 rounded-xl ${
                  isDark ? "bg-surface-dark-3 border border-purple-500/10" : "bg-purple-50/50 border border-purple-100"
                }`}>
                  <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
                      Razorpay
                    </p>
                    <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      UPI, Cards, Netbanking, Wallets
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                  isDark ? "bg-purple-500/10 text-purple-300" : "bg-purple-50 text-purple-600"
                }`}>
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Your payment is secured with 256-bit SSL encryption
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" size="lg" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                    {loading ? "Processing..." : `Pay with Razorpay — ₹${total.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className={`rounded-2xl p-6 sticky top-24 ${isDark ? "card-dark" : "card-light"}`}>
            <h2 className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>
                  Subtotal ({items.length} items)
                </span>
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
                  <span className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>Total</span>
                  <span className={`text-xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={`flex items-center gap-2 text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                <Truck className="w-4 h-4" />
                Estimated delivery: 3–5 business days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
