import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaPlus, FaTimes } from "react-icons/fa";

const CustomerDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        api.get("/menu/categories"),
        api.get("/menu/items"),
      ]);

      setCategories(categoriesRes.data);
      setFoodItems(itemsRes.data);

      if (categoriesRes.data.length > 0) {
        setSelectedCategory(categoriesRes.data[0]._id);
      }

      setLoading(false);
    } catch (error) {
      toast.error("Failed to load menu");
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory
    ? foodItems.filter(
        (item) => item.categoryId._id === selectedCategory && item.isAvailable
      )
    : foodItems.filter((item) => item.isAvailable);

  const handleAddToCart = (item) => {
    if (item.isAlcoholic) {
      setSelectedItem(item);
      setShowAgeVerification(true);
    } else {
      addToCart(item);
    }
  };

  const handleAgeConfirm = (isAdult) => {
    if (isAdult) {
      addToCart(selectedItem);
    } else {
      toast.error("You must be 18+ to purchase alcoholic beverages");
    }
    setShowAgeVerification(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-orange-600">Loading menu...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Our Menu</h1>

          <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                  selectedCategory === category._id
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 hover:bg-orange-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No items available in this category
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition flex items-center space-x-2"
                      >
                        <FaPlus />
                        <span>Add</span>
                      </button>
                    </div>
                    {item.isAlcoholic && (
                      <div className="mt-2 text-xs text-red-600 font-medium">
                        ⚠️ 18+ Only
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAgeVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Age Verification Required
              </h2>
              <button
                onClick={() => {
                  setShowAgeVerification(false);
                  setSelectedItem(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                You are about to add{" "}
                <span className="font-bold">{selectedItem?.name}</span> to your
                cart.
              </p>
              <p className="text-gray-700 mb-4">
                This is an alcoholic beverage. You must be 18 years or older to
                purchase.
              </p>
              <p className="text-lg font-semibold text-red-600">
                Are you 18 years or older?
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleAgeConfirm(true)}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Yes, I'm 18+
              </button>
              <button
                onClick={() => handleAgeConfirm(false)}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                No, I'm not
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerDashboard;
