import { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaEnvelope, FaPhone, FaLock, FaUtensils } from "react-icons/fa";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const [loginType, setLoginType] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const credentials = {
      password: formData.password,
    };

    if (loginType === "email") {
      credentials.email = formData.email;
    } else {
      credentials.mobile = formData.mobile;
    }

    const result = await login(credentials);

    if (!result.success) {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <FaUtensils className="text-5xl text-orange-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setLoginType("email")}
            className={`flex-1 py-2 rounded-lg transition ${
              loginType === "email"
                ? "bg-white text-orange-600 shadow"
                : "text-gray-600"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginType("mobile")}
            className={`flex-1 py-2 rounded-lg transition ${
              loginType === "mobile"
                ? "bg-white text-orange-600 shadow"
                : "text-gray-600"
            }`}
          >
            Mobile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginType === "email" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="9876543210"
                  pattern="[6-9][0-9]{9}"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-600 font-semibold hover:text-orange-700"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-700 font-semibold mb-2">
            Demo Admin Credentials:
          </p>
          <p className="text-xs text-gray-600">Email: admin@restaurant.com</p>
          <p className="text-xs text-gray-600">Password: Admin@123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
