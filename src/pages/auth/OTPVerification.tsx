import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiRefreshCw } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Redirect if no phone number is provided
    if (!phone) {
      navigate("/signup", { replace: true });
    }
  }, [phone, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pastedData.forEach((value, index) => {
      if (index < 6) {
        newOtp[index] = value;
      }
    });
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get stored user data
      const tempUserData = sessionStorage.getItem("tempUserData");
      if (tempUserData) {
        const userData = JSON.parse(tempUserData);
        // Store the complete user data (in a real app, this would come from your backend)
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...userData,
            id: Date.now(), // Simulate user ID
            verified: true,
          })
        );
        localStorage.setItem("isAuthenticated", "true");

        // Clean up temp storage
        sessionStorage.removeItem("tempUserData");

        // Navigate to dashboard
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Error:", error);
      // TODO: Show error message to user
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setCountdown(30);
    // TODO: Implement resend OTP API call
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-primary/10 w-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FiCheck className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Verify Your Phone
          </h2>
          <p className="text-gray-medium">
            We've sent a verification code to{" "}
            <span className="font-medium">{phone}</span>
          </p>
        </div>

        <div className="space-y-8">
          {/* OTP Input Grid */}
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl font-bold bg-gray-50 rounded-xl border border-transparent focus:border-primary/20 focus:bg-white outline-none transition-colors"
                  autoFocus={index === 0}
                />
              </motion.div>
            ))}
          </div>

          {/* Verify Button */}
          <motion.button
            onClick={handleVerify}
            disabled={!isComplete || isVerifying}
            className={`w-full py-4 px-6 rounded-xl flex items-center justify-center space-x-2 text-white font-medium transition-all duration-300 ${
              isComplete && !isVerifying
                ? "bg-primary hover:bg-primary/90"
                : "bg-gray-200 cursor-not-allowed"
            }`}
            whileTap={{ scale: isComplete && !isVerifying ? 0.98 : 1 }}
          >
            <span>Verify Code</span>
            {isVerifying && <FiRefreshCw className="w-5 h-5 animate-spin" />}
          </motion.button>

          {/* Resend Option */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-gray-medium">
                Resend code in{" "}
                <span className="text-primary font-medium">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-primary font-medium hover:underline"
              >
                Resend Code
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
