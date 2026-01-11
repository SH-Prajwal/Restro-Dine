import { Link } from "react-router-dom";
import {
  FaUtensils,
  FaShoppingCart,
  FaHistory,
  FaUserShield,
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaUtensils className="text-3xl text-orange-600" />
            <span
              className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"
              style={{ fontFamily: "Brush Script MT, cursive" }}
            >
              Restro-Dine
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 text-orange-600 font-semibold hover:text-orange-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Welcome to{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"
              style={{ fontFamily: "Brush Script MT, cursive" }}
            >
              Restro-Dine
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience authentic Indian cuisine. Browse our delicious menu and order your favorite dishes
            online.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-orange-700 hover:to-orange-600 transition shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-xl border-2 border-orange-600"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaUtensils className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Authentic Cuisine
            </h3>
            <p className="text-gray-600">
              Explore a wide variety of traditional Indian dishes prepared with
              authentic spices and recipes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaShoppingCart className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Easy Ordering
            </h3>
            <p className="text-gray-600">
              Simple and intuitive cart system. Add items, customize quantities,
              and checkout seamlessly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaHistory className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Order History
            </h3>
            <p className="text-gray-600">
              Track all your orders and reorder your favorite meals with just
              one click.
            </p>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-orange-600 to-orange-500 rounded-3xl p-12 text-center shadow-2xl">
          <FaUserShield className="text-6xl text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Restaurant Owner?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Manage your menu, track orders, and grow your business with our
            powerful admin dashboard.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-xl"
          >
            Admin Login
          </Link>
        </div>
      </div>

      <footer className="bg-white mt-20 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 Restro-Dine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
