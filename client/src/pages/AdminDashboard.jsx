import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit, FaTimes } from "react-icons/fa";

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [couponForm, setCouponForm] = useState({
    code: "",
    discountPercent: "",
    minOrderAmount: "",
    description: "",
  });

  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    isAvailable: true,
  });

  const [editCategoryForm, setEditCategoryForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [editItemForm, setEditItemForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, itemsRes, couponsRes] = await Promise.all([
        api.get("/menu/categories"),
        api.get("/menu/items"),
        api.get("/coupons/all"),
      ]);

      setCategories(categoriesRes.data);
      setFoodItems(itemsRes.data);
      setCoupons(couponsRes.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post("/menu/category", categoryForm);
      toast.success("Category added successfully");
      setCategoryForm({ name: "", description: "", imageUrl: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post("/menu/item", {
        ...itemForm,
        price: parseFloat(itemForm.price),
      });
      toast.success("Food item added successfully");
      setItemForm({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        imageUrl: "",
        isAvailable: true,
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category._id);
    setEditCategoryForm({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
    });
    setShowEditCategoryModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/menu/category/${editingCategory}`, editCategoryForm);
      toast.success("Category updated successfully");
      setShowEditCategoryModal(false);
      setEditingCategory(null);
      setEditCategoryForm({ name: "", description: "", imageUrl: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleCancelCategoryEdit = () => {
    setShowEditCategoryModal(false);
    setEditingCategory(null);
    setEditCategoryForm({ name: "", description: "", imageUrl: "" });
  };

  const handleEditItem = (item) => {
    setEditingItem(item._id);
    setEditItemForm({
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
    });
    setShowEditItemModal(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/menu/item/${editingItem}`, editItemForm);
      toast.success("Item updated successfully");
      setShowEditItemModal(false);
      setEditingItem(null);
      setEditItemForm({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        imageUrl: "",
        isAvailable: true,
      });
      fetchData();
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const handleCancelItemEdit = () => {
    setShowEditItemModal(false);
    setEditingItem(null);
    setEditItemForm({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      imageUrl: "",
      isAvailable: true,
    });
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/menu/item/${itemId}`);
      toast.success("Item deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await api.delete(`/menu/category/${categoryId}`);
      toast.success("Category deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.post("/coupons/create", couponForm);
      toast.success("Coupon created successfully");
      setCouponForm({
        code: "",
        discountPercent: "",
        minOrderAmount: "",
        description: "",
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await api.delete(`/coupons/${couponId}`);
      toast.success("Coupon deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleToggleCoupon = async (couponId) => {
    try {
      await api.put(`/coupons/${couponId}/toggle`);
      toast.success("Coupon status updated");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update coupon");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-orange-600">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Add Category Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <FaPlus className="text-orange-600" />
                <span>Add New Category</span>
              </h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={categoryForm.imageUrl}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        imageUrl: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition"
                >
                  Add Category
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <FaPlus className="text-orange-600" />
                <span>Add Food Item</span>
              </h2>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={itemForm.description}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={itemForm.price}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, price: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={itemForm.categoryId}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, categoryId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={itemForm.imageUrl}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, imageUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={itemForm.isAvailable}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        isAvailable: e.target.checked,
                      })
                    }
                    className="mr-2 h-4 w-4 text-orange-600"
                  />
                  <label
                    htmlFor="isAvailable"
                    className="text-sm font-medium text-gray-700"
                  >
                    Available
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition"
                >
                  Add Item
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Manage Categories
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {category.description}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Manage Food Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {foodItems.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.categoryId?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ₹{item.price}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <FaPlus className="text-orange-600" />
                <span>Add New Coupon</span>
              </h2>
              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={couponForm.code}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
                    placeholder="SAVE20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    value={couponForm.discountPercent}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        discountPercent: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="10"
                    min="1"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={couponForm.minOrderAmount}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        minOrderAmount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={couponForm.description}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Get 10% off on orders above ₹500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition"
                >
                  Add Coupon
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Manage Coupons
              </h2>
              {coupons.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No coupons available
                </p>
              ) : (
                <div className="space-y-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className={`p-4 rounded-lg border-2 ${
                        coupon.isActive
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-800">
                              {coupon.code}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                coupon.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {coupon.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {coupon.description}
                          </p>
                          <div className="flex space-x-4 text-sm">
                            <span className="text-orange-600 font-semibold">
                              {coupon.discountPercent}% OFF
                            </span>
                            <span className="text-gray-600">
                              Min: ₹{coupon.minOrderAmount}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => handleToggleCoupon(coupon._id)}
                            className={`px-3 py-1 rounded text-xs font-semibold transition ${
                              coupon.isActive
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {coupon.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaEdit className="mr-2 text-orange-600" />
                Edit Category
              </h2>
              <button
                onClick={handleCancelCategoryEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editCategoryForm.name}
                  onChange={(e) =>
                    setEditCategoryForm({
                      ...editCategoryForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editCategoryForm.description}
                  onChange={(e) =>
                    setEditCategoryForm({
                      ...editCategoryForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editCategoryForm.imageUrl}
                  onChange={(e) =>
                    setEditCategoryForm({
                      ...editCategoryForm,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition"
                >
                  Update Category
                </button>
                <button
                  type="button"
                  onClick={handleCancelCategoryEdit}
                  className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaEdit className="mr-2 text-orange-600" />
                Edit Food Item
              </h2>
              <button
                onClick={handleCancelItemEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editItemForm.name}
                  onChange={(e) =>
                    setEditItemForm({ ...editItemForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editItemForm.description}
                  onChange={(e) =>
                    setEditItemForm({
                      ...editItemForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editItemForm.price}
                    onChange={(e) =>
                      setEditItemForm({
                        ...editItemForm,
                        price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={editItemForm.categoryId}
                    onChange={(e) =>
                      setEditItemForm({
                        ...editItemForm,
                        categoryId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editItemForm.imageUrl}
                  onChange={(e) =>
                    setEditItemForm({
                      ...editItemForm,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsAvailable"
                  checked={editItemForm.isAvailable}
                  onChange={(e) =>
                    setEditItemForm({
                      ...editItemForm,
                      isAvailable: e.target.checked,
                    })
                  }
                  className="mr-2 h-4 w-4 text-orange-600"
                />
                <label
                  htmlFor="editIsAvailable"
                  className="text-sm font-medium text-gray-700"
                >
                  Available
                </label>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition"
                >
                  Update Item
                </button>
                <button
                  type="button"
                  onClick={handleCancelItemEdit}
                  className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
