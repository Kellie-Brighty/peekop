import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiArrowRight,
  FiPackage,
  FiShoppingBag,
  FiFileText,
  FiShoppingCart,
  FiCoffee,
} from "react-icons/fi";
import { RiMotorbikeFill, RiFileListLine } from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";

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

interface SignUpFormData {
  fullName: string;
  email: string;
  phone: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [currentField, setCurrentField] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = [
    {
      name: "fullName",
      label: "What's your name?",
      type: "text",
      icon: FiUser,
      placeholder: "Enter your full name",
      validation: (value: string) => value.length >= 3,
    },
    {
      name: "phone",
      label: "Your phone number",
      type: "tel",
      icon: FiPhone,
      placeholder: "Enter your phone number",
      validation: (value: string) => /^[0-9]{11}$/.test(value),
    },
    {
      name: "email",
      label: "Your email address",
      type: "email",
      icon: FiMail,
      placeholder: "Enter your email",
      validation: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      sessionStorage.setItem("tempUserData", JSON.stringify(formData));
      navigate("/verify", { state: { phone: formData.phone } });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentFieldData = fields[currentField];
  const isCurrentFieldValid = currentFieldData.validation(
    formData[currentFieldData.name as keyof SignUpFormData]
  );

  const handleNext = () => {
    if (currentField < fields.length - 1) {
      setCurrentField((prev) => prev + 1);
    } else if (isCurrentFieldValid) {
      handleSubmit(new Event("submit") as any);
    }
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
      <main className="flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-4 pt-20 md:pt-0">
        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentField + 1) / fields.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <p className="text-gray-500">
                Step {currentField + 1} of {fields.length}
              </p>
              <p className="text-primary font-medium">
                {Math.round(((currentField + 1) / fields.length) * 100)}%
              </p>
            </div>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentField}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              {/* Title */}
              <motion.h1
                className="text-[32px] font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {currentFieldData.label}
              </motion.h1>

              {/* Input Field */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <currentFieldData.icon className="w-5 h-5" />
                </div>
                <input
                  type={currentFieldData.type}
                  name={currentFieldData.name}
                  value={
                    formData[currentFieldData.name as keyof SignUpFormData]
                  }
                  onChange={handleInputChange}
                  placeholder={currentFieldData.placeholder}
                  className="w-full h-[56px] pl-12 pr-4 text-base bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-400"
                  autoFocus
                />
              </motion.div>

              {/* Continue Button */}
              <motion.button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentFieldValid || isSubmitting}
                className={`w-full h-[56px] rounded-xl flex items-center justify-center text-base font-medium transition-all ${
                  isCurrentFieldValid
                    ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98] shadow-lg shadow-primary/25"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: isCurrentFieldValid ? 1.01 : 1 }}
                whileTap={{ scale: isCurrentFieldValid ? 0.98 : 1 }}
              >
                <span>{isSubmitting ? "Processing..." : "Continue"}</span>
                <FiArrowRight className="w-5 h-5 ml-2" />
              </motion.button>

              {/* Sign In Link */}
              <motion.div
                className="pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-center text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-medium hover:text-primary/90 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
