import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiMail,
  FiUser,
  FiUserPlus,
  FiArrowRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const menuItems = [
    { path: "/", icon: FiHome, label: "Home" },
    { path: "/about", icon: FiInfo, label: "About" },
    { path: "/contact", icon: FiMail, label: "Contact" },
  ];

  const authItems = [
    { path: "/login", icon: FiUser, label: "Login", style: "btn-outline" },
    {
      path: "/signup",
      icon: FiUserPlus,
      label: "Sign Up",
      style: "btn-primary",
    },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1 },
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-primary relative z-[60] group"
          >
            <span className="inline-block transition-transform duration-300 group-hover:scale-110">
              Peekop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {authItems.map((item) => (
              <Link key={item.path} to={item.path} className={item.style}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden relative z-[60] w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
              isMenuOpen
                ? "bg-white text-primary shadow-lg"
                : "text-gray-medium"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiX className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMenu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Moved outside container but still within nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden"
            style={{ top: "0", height: "100vh" }} // Ensure full viewport height
          >
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-primary/10 backdrop-blur-lg"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute inset-x-4 top-20 bottom-4 bg-white rounded-3xl shadow-2xl p-6 overflow-y-auto flex flex-col"
            >
              {/* Menu Header */}
              <motion.div
                variants={itemVariants}
                className="text-center mb-8 pb-6 border-b border-gray-100"
              >
                <h2 className="text-2xl font-bold text-primary mb-2">Menu</h2>
                <p className="text-gray-medium">What would you like to do?</p>
              </motion.div>

              {/* Menu Items */}
              <div className="flex-1">
                <div className="grid gap-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.div key={item.path} variants={itemVariants}>
                        <Link
                          to={item.path}
                          className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                          <span className="ml-4 font-medium">{item.label}</span>
                          <FiArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Auth Buttons */}
                <motion.div variants={itemVariants} className="mt-8 space-y-4">
                  {authItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`${item.style} w-full text-center flex items-center justify-center space-x-3 p-4`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        <FiArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    );
                  })}
                </motion.div>
              </div>

              {/* Bottom Info */}
              <motion.div
                variants={itemVariants}
                className="mt-8 pt-6 border-t border-gray-100 text-center"
              >
                <p className="text-sm text-gray-medium">
                  Need help? Call us at
                  <a
                    href="tel:+2348000000000"
                    className="text-primary ml-1 font-medium"
                  >
                    0800 000 0000
                  </a>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
