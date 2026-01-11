import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTag, FaTimes } from "react-icons/fa";
import Confetti from "react-confetti";

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await api.get("/coupons");
      setCoupons(response.data);
    } catch (error) {
      console.error("Failed to fetch coupons");
    }
  };

  const calculateBill = () => {
    let subtotal = 0;
    let gstAmount = 0; 
    let vatAmount = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      if (item.isAlcoholic) {
        vatAmount += itemTotal * 0.2;
      } else {
        gstAmount += itemTotal * 0.05;
      }
    });

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const totalBeforeDiscount = subtotal + gstAmount + vatAmount;

    let discountAmount = 0;
    if (appliedCoupon) {
      discountAmount =
        (totalBeforeDiscount * appliedCoupon.discountPercent) / 100;
    }

    const finalTotal = totalBeforeDiscount - discountAmount;

    return {
      subtotal,
      cgst,
      sgst,
      gstAmount,
      vatAmount,
      totalBeforeDiscount,
      discountAmount,
      finalTotal,
    };
  };

  const bill = calculateBill();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const response = await api.post("/coupons/apply", {
        code: couponCode,
        orderAmount: bill.totalBeforeDiscount,
      });

      setAppliedCoupon(response.data.coupon);
      setShowCelebration(true);
      toast.success(response.data.message);

      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          foodItemId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: parseFloat(bill.subtotal.toFixed(2)),
        gst: parseFloat(bill.gstAmount.toFixed(2)),
        vat: parseFloat(bill.vatAmount.toFixed(2)),
        discount: parseFloat(bill.discountAmount.toFixed(2)),
        couponCode: appliedCoupon?.code || null,
        totalAmount: parseFloat(bill.finalTotal.toFixed(2)),
      };

      await api.post("/orders/create", orderData);

      setOrderPlaced(true);
      clearCart();

      setTimeout(() => {
        navigate("/orders");
      }, 3000);
    } catch (error) {
      toast.error("Failed to place order");
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-12 text-center max-w-md">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. Redirecting to order history...
            </p>
            <div className="animate-pulse text-orange-600">Please wait...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Items
                </h2>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center border-b pb-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          ₹{item.price} × {item.quantity}
                        </p>
                        <p className="font-bold text-gray-800">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 overflow-hidden">
                {showCelebration && (
                  <Confetti
                    width={400}
                    height={600}
                    recycle={false}
                    numberOfPieces={80}
                    gravity={0.25}
                    wind={0}
                    confettiSource={{ x: 200, y: 0, w: 0, h: 0 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 10,
                    }}
                  />
                )}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Bill Summary
                </h2>

                {!appliedCoupon ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Have a Coupon?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode || loading}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>
                    {coupons.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">
                          Available Coupons:
                        </p>
                        <div className="space-y-1">
                          {coupons.map((coupon) => (
                            <button
                              key={coupon._id}
                              onClick={() => {
                                setCouponCode(coupon.code);
                              }}
                              className="w-full text-left px-3 py-2 bg-orange-50 hover:bg-orange-100 rounded border border-orange-200 transition text-xs"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-orange-700">
                                  {coupon.code}
                                </span>
                                <span className="text-orange-600">
                                  {coupon.discountPercent}% OFF
                                </span>
                              </div>
                              <div className="text-gray-600 text-xs">
                                {coupon.description}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-600" />
                          <span className="font-bold text-green-700">
                            {appliedCoupon.code}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {appliedCoupon.description}
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{bill.subtotal.toFixed(2)}</span>
                  </div>

                  {bill.gstAmount > 0 && (
                    <>
                      <div className="flex justify-between text-gray-600 text-sm pl-4">
                        <span>CGST (2.5%)</span>
                        <span>₹{bill.cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-sm pl-4">
                        <span>SGST (2.5%)</span>
                        <span>₹{bill.sgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700 font-medium">
                        <span>Total GST (5%)</span>
                        <span>₹{bill.gstAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  {bill.vatAmount > 0 && (
                    <div className="flex justify-between text-gray-700 font-medium">
                      <span>VAT (20% - Alcoholic)</span>
                      <span>₹{bill.vatAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {bill.discountAmount > 0 && (
                    <>
                      <div className="flex justify-between text-gray-600">
                        <span>Total Before Discount</span>
                        <span>₹{bill.totalBeforeDiscount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>
                          Discount ({appliedCoupon?.discountPercent}%)
                        </span>
                        <span>-₹{bill.discountAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-2xl font-bold text-gray-800">
                      <span>Total Amount</span>
                      <span>₹{bill.finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
