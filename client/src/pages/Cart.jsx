import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } =
    useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some delicious items to your cart
            </p>
            <Link
              to="/dashboard"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition inline-block"
            >
              Browse Menu
            </Link>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-orange-600 font-bold text-lg mt-1">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      <FaMinus />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Cart Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span>₹{(getCartTotal() * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span>₹{(getCartTotal() * 1.05).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/dashboard"
                  className="block text-center text-orange-600 mt-4 hover:text-orange-700"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
