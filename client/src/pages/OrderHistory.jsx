import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaHistory, FaCalendar, FaReceipt } from "react-icons/fa";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/my-orders");
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-orange-600">Loading orders...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-8">
            <FaHistory className="text-4xl text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-800">Order History</h1>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FaReceipt className="text-6xl text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No orders yet
              </h2>
              <p className="text-gray-600">
                Your order history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaCalendar />
                        <span>
                          {new Date(order.orderDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {order.status}
                      </span>
                      <p className="text-2xl font-bold text-orange-600 mt-2">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Items Ordered:
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-600">{item.name}</span>
                            <span className="text-gray-500 text-sm">
                              × {item.quantity}
                            </span>
                          </div>
                          <span className="text-gray-800 font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Subtotal</span>
                      <span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>GST (5%)</span>
                      <span>₹{order.gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
