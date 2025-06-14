import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiLock,
  FiMail,
  FiPhone,
  FiInfo,
  FiUser,
  FiPackage,
  FiShoppingBag,
  FiFileText,
  FiShoppingCart,
  FiCoffee,
} from "react-icons/fi";
import { RiMotorbikeFill, RiFileListLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

// Floating elements data
const floatingElements = [
  {
    Icon: RiMotorbikeFill,
    color: "text-primary",
    size: "w-12 h-12",
    delay: 0,
    startPosition: "left",
  },
  {
    Icon: FiPackage,
    color: "text-secondary",
    size: "w-10 h-10",
    delay: 2,
    startPosition: "right",
  },
  {
    Icon: FiShoppingBag,
    color: "text-primary",
    size: "w-14 h-14",
    delay: 4,
    startPosition: "top",
  },
  {
    Icon: FiFileText,
    color: "text-secondary",
    size: "w-12 h-12",
    delay: 6,
    startPosition: "bottom",
  },
  {
    Icon: RiMotorbikeFill,
    color: "text-primary",
    size: "w-16 h-16",
    delay: 8,
    startPosition: "left",
  },
  {
    Icon: FiShoppingCart,
    color: "text-secondary",
    size: "w-10 h-10",
    delay: 10,
    startPosition: "right",
  },
  {
    Icon: RiFileListLine,
    color: "text-primary",
    size: "w-14 h-14",
    delay: 12,
    startPosition: "top",
  },
  {
    Icon: FiCoffee,
    color: "text-secondary",
    size: "w-12 h-12",
    delay: 14,
    startPosition: "bottom",
  },
  {
    Icon: FiPackage,
    color: "text-primary",
    size: "w-16 h-16",
    delay: 16,
    startPosition: "left",
  },
];

const getRandomPosition = (startPosition: string) => {
  const width = typeof window !== "undefined" ? window.innerWidth : 1000;
  const height = typeof window !== "undefined" ? window.innerHeight : 1000;

  switch (startPosition) {
    case "left":
      return { x: -100, y: Math.random() * height };
    case "right":
      return { x: width + 100, y: Math.random() * height };
    case "top":
      return { x: Math.random() * width, y: -100 };
    case "bottom":
      return { x: Math.random() * width, y: height + 100 };
    default:
      return { x: Math.random() * width, y: Math.random() * height };
  }
};

const FloatingElement = ({ Icon, color, size, delay, startPosition }: any) => {
  const start = getRandomPosition(startPosition);
  const mid1 = getRandomPosition("random");
  const mid2 = getRandomPosition("random");
  const end = getRandomPosition(
    startPosition === "left"
      ? "right"
      : startPosition === "right"
      ? "left"
      : "bottom"
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: start.x,
        y: start.y,
      }}
      animate={{
        opacity: [0, 0.4, 0.4, 0],
        x: [start.x, mid1.x, mid2.x, end.x],
        y: [start.y, mid1.y, mid2.y, end.y],
        rotate: [0, 45, -45, 0],
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.2, 0.8, 1],
      }}
      className={`fixed ${size} ${color} blur-[0.5px] drop-shadow-lg`}
    >
      <Icon className="w-full h-full" />
    </motion.div>
  );
};

// Demo user types with credentials
const demoUsers = [
  {
    type: "Regular User",
    email: "user@example.com",
    phone: "+1234567890",
    password: "password123",
    points: 125,
    tier: "Bronze",
    completedRides: 3,
    role: "user",
  },
  {
    type: "Premium User",
    email: "premium@example.com",
    phone: "+1987654321",
    password: "premium456",
    points: 550,
    tier: "Silver",
    completedRides: 25,
    role: "user",
  },
  {
    type: "Power User",
    email: "power@example.com",
    phone: "+1555123456",
    password: "power789",
    points: 1250,
    tier: "Gold",
    completedRides: 78,
    role: "user",
  },
];

// Demo rider accounts
const demoRiders = [
  {
    type: "Bike Rider",
    email: "rider@example.com",
    phone: "+1333444555",
    password: "rider123",
    rating: 4.7,
    vehicleType: "bike",
    completedRides: 142,
    isOnline: true,
    earnings: 1250,
    role: "rider",
  },
  {
    type: "Tricycle Rider",
    email: "tricycle@example.com",
    phone: "+1666777888",
    password: "tricycle456",
    rating: 4.9,
    vehicleType: "tricycle",
    completedRides: 356,
    isOnline: true,
    earnings: 3200,
    role: "rider",
  },
  {
    type: "New Rider",
    email: "newrider@example.com",
    phone: "+1999000111",
    password: "newrider789",
    rating: 4.2,
    vehicleType: "bike",
    completedRides: 18,
    isOnline: false,
    earnings: 250,
    role: "rider",
  },
];

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (loginMethod === "email") {
      if (!formData.email) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
        valid = false;
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
        valid = false;
      } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Phone number is invalid";
        valid = false;
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const useDemoCredentials = (account: any) => {
    setFormData({
      email: account.email,
      phone: account.phone,
      password: account.password,
    });
    setLoginMethod("email");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Find if credentials match any demo user or rider
    const demoUser = demoUsers.find(
      (user) =>
        ((loginMethod === "email" && user.email === formData.email) ||
          (loginMethod === "phone" && user.phone === formData.phone)) &&
        user.password === formData.password
    );

    const demoRider = demoRiders.find(
      (rider) =>
        ((loginMethod === "email" && rider.email === formData.email) ||
          (loginMethod === "phone" && rider.phone === formData.phone)) &&
        rider.password === formData.password
    );

    // Simulate API call
    setTimeout(() => {
      // Store auth status
      localStorage.setItem("isAuthenticated", "true");

      if (demoUser) {
        // Store user data and role
        localStorage.setItem("accountType", "user");
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: demoUsers.indexOf(demoUser) + 1,
            fullName: `Demo ${demoUser.type}`,
            email: demoUser.email,
            phone: demoUser.phone,
            verified: true,
            points: demoUser.points,
            tier: demoUser.tier,
            favorites: [],
            completedRides: demoUser.completedRides,
          })
        );
        setIsLoading(false);
        navigate("/dashboard");
      } else if (demoRider) {
        // Store rider data and role
        localStorage.setItem("accountType", "rider");
        localStorage.setItem(
          "rider",
          JSON.stringify({
            id: demoRiders.indexOf(demoRider) + 1,
            fullName: `Demo ${demoRider.type}`,
            email: demoRider.email,
            phone: demoRider.phone,
            verified: true,
            rating: demoRider.rating,
            vehicleType: demoRider.vehicleType,
            completedRides: demoRider.completedRides,
            isOnline: demoRider.isOnline,
            earnings: demoRider.earnings,
            joinedDate: "2023-01-15",
          })
        );
        setIsLoading(false);
        navigate("/rider-dashboard");
      } else {
        // For unknown credentials, default to user account
        localStorage.setItem("accountType", "user");
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: 999,
            fullName: "User",
            email: formData.email || "user@example.com",
            phone: formData.phone || "+1234567890",
            verified: true,
            points: 125,
            tier: "Bronze",
            favorites: [],
            completedRides: 0,
          })
        );
        setIsLoading(false);
        navigate("/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col relative w-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingElements.map((element, index) => (
          <FloatingElement key={index} {...element} />
        ))}

        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold text-primary hover:text-primary/90 transition-colors"
          >
            Peekop
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-20 px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl relative z-10 border border-white/50"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-medium">Sign in to continue using Peekop</p>
          </div>

          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 rounded-md transition-colors ${
                loginMethod === "email" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setLoginMethod("email")}
            >
              Email
            </button>
            <button
              className={`flex-1 py-2 rounded-md transition-colors ${
                loginMethod === "phone" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setLoginMethod("phone")}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {loginMethod === "email" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center text-sm text-gray-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium">
                Sign Up
              </Link>
            </div>
          </form>

          {/* Demo accounts section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-primary"
            >
              <span className="flex items-center">
                <FiInfo className="mr-2" />
                Demo Accounts
              </span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  showDemoAccounts ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDemoAccounts && (
              <div className="mt-4 space-y-5">
                <div className="border-b pb-2">
                  <div className="font-medium flex items-center mb-2 text-secondary">
                    <FiUser className="mr-1" /> User Accounts
                  </div>
                  <div className="space-y-3">
                    {demoUsers.map((user, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => useDemoCredentials(user)}
                      >
                        <div className="font-medium">{user.type}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          Email: {user.email} | Password: {user.password}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            {user.tier} • {user.points} pts
                          </span>
                          <span className="ml-2">
                            {user.completedRides} rides
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-medium flex items-center mb-2 text-secondary">
                    <RiMotorbikeFill className="mr-1" /> Rider Accounts
                  </div>
                  <div className="space-y-3">
                    {demoRiders.map((rider, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => useDemoCredentials(rider)}
                      >
                        <div className="font-medium">{rider.type}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          Email: {rider.email} | Password: {rider.password}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            ★ {rider.rating} • {rider.completedRides} rides
                          </span>
                          <span className="ml-2">₦{rider.earnings} earned</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SignIn;
