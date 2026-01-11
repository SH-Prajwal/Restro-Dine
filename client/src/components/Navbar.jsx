import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import {
  FaShoppingCart,
  FaSignOutAlt,
  FaHistory,
  FaUtensils,
  FaUser,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            to={user?.role === "admin" ? "/admin" : "/dashboard"}
            className="flex items-center space-x-2"
          >
            <FaUtensils className="text-2xl" />
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "Brush Script MT, cursive" }}
            >
              Restro-Dine
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {user && (
              <>
                {user.role === "customer" && (
                  <>
                    <Link
                      to="/dashboard"
                      className="hover:text-orange-200 transition"
                    >
                      Menu
                    </Link>

                    <Link
                      to="/cart"
                      className="relative hover:text-orange-200 transition"
                    >
                      <FaShoppingCart className="text-xl" />
                      {getCartCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getCartCount()}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center space-x-1 hover:text-orange-200 transition"
                    >
                      <FaHistory />
                      <span>Orders</span>
                    </Link>
                  </>
                )}

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 hover:text-orange-200 transition"
                  >
                    <FaUserCircle className="text-3xl" />
                    <FaChevronDown className="text-sm" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm text-gray-600">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user.email || user.mobile}
                        </p>
                        <p className="text-xs text-purple-600">{user.role}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-purple-50 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaUser className="inline mr-2" />
                        Edit Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
