import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiPackage,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiCheck,
  FiUsers,
} from "react-icons/fi";
import { Location, Rider } from "../../types";

interface ErrandFormProps {
  userLocation: Location;
  selectedRider: Rider | null;
  orderType: "marketplace" | "direct";
  onClose: () => void;
  onCreateErrand: (errandDetails: ErrandDetails) => void;
}

export interface ErrandDetails {
  pickupLocation: Location;
  pickupAddress: string;
  dropoffLocation: Location;
  dropoffAddress: string;
  itemDescription: string;
  packageSize: "small" | "medium" | "large";
  isFragile: boolean;
  urgency: "normal" | "express";
  estimatedPrice: number;
  estimatedDuration: number;
  riderId: number | null;
  notes: string;
}

const ErrandForm = ({
  userLocation,
  selectedRider,
  orderType,
  onClose,
  onCreateErrand,
}: ErrandFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [errandDetails, setErrandDetails] = useState<ErrandDetails>({
    pickupLocation: userLocation,
    pickupAddress: "Current Location",
    dropoffLocation: {
      lat: userLocation.lat + 0.01,
      lng: userLocation.lng + 0.01,
    },
    dropoffAddress: "",
    itemDescription: "",
    packageSize: "small",
    isFragile: false,
    urgency: "normal",
    estimatedPrice: 0,
    estimatedDuration: 0,
    riderId: selectedRider?.id || null,
    notes: "",
  });

  useEffect(() => {
    // Calculate price and duration whenever relevant fields change
    calculatePriceAndDuration();
  }, [
    errandDetails.pickupLocation,
    errandDetails.dropoffLocation,
    errandDetails.packageSize,
    errandDetails.urgency,
  ]);

  const calculatePriceAndDuration = () => {
    // Calculate distance
    const distance =
      Math.sqrt(
        Math.pow(errandDetails.dropoffLocation.lat - userLocation.lat, 2) +
          Math.pow(errandDetails.dropoffLocation.lng - userLocation.lng, 2)
      ) * 111; // Convert to kilometers roughly

    // Calculate duration in minutes
    const duration = distance * 5; // Assume 5 minutes per kilometer

    // Base price in Naira
    let price = 500 + distance * 200;

    // Add package size cost
    if (errandDetails.packageSize === "medium") price += 300;
    if (errandDetails.packageSize === "large") price += 700;

    // Add urgency cost
    if (errandDetails.urgency === "express") price *= 1.5;

    // Add fragility cost
    if (errandDetails.isFragile) price += 500;

    // Update state
    setErrandDetails({
      ...errandDetails,
      estimatedDuration: Math.ceil(duration),
      estimatedPrice: Math.round(price),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setErrandDetails({
        ...errandDetails,
        [name]: checkbox.checked,
      });
    } else {
      setErrandDetails({
        ...errandDetails,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmation(true);
    }, 1500);
  };

  const handleConfirm = () => {
    onCreateErrand(errandDetails);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 1
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          1
        </div>
        <div
          className={`w-12 h-1 ${
            currentStep >= 2 ? "bg-primary" : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 2
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          2
        </div>
        <div
          className={`w-12 h-1 ${
            currentStep >= 3 ? "bg-primary" : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 3
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          3
        </div>
      </div>
    </div>
  );

  // Step 1: Location Details
  const renderLocationStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Location Details</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pickup Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMapPin className="text-gray-400" />
          </div>
          <input
            type="text"
            name="pickupAddress"
            value={errandDetails.pickupAddress}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Pickup location"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dropoff Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMapPin className="text-gray-400" />
          </div>
          <input
            type="text"
            name="dropoffAddress"
            value={errandDetails.dropoffAddress}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Dropoff location"
            required
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={!errandDetails.dropoffAddress.trim()}
          className={`w-full py-3 px-6 bg-primary text-white rounded-xl font-medium transition-colors ${
            !errandDetails.dropoffAddress.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary/90"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 2: Package Details
  const renderPackageStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Package Details</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item Description
        </label>
        <textarea
          name="itemDescription"
          value={errandDetails.itemDescription}
          onChange={handleChange}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Describe the item(s) to be delivered"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Package Size
        </label>
        <select
          name="packageSize"
          value={errandDetails.packageSize}
          onChange={handleChange}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="small">Small (fits in a bag)</option>
          <option value="medium">Medium (fits on a bike rack)</option>
          <option value="large">Large (needs tricycle)</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isFragile"
          id="isFragile"
          checked={errandDetails.isFragile}
          onChange={handleChange}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="isFragile" className="ml-2 block text-sm text-gray-700">
          This package is fragile and requires special handling
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Priority
        </label>
        <div className="flex space-x-4">
          <label
            className={`flex-1 border rounded-lg p-3 flex items-center cursor-pointer ${
              errandDetails.urgency === "normal"
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="urgency"
              value="normal"
              checked={errandDetails.urgency === "normal"}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="ml-2 flex-1">
              <span className="block font-medium">Standard</span>
              <span className="block text-xs text-gray-500">
                Regular delivery time
              </span>
            </span>
          </label>

          <label
            className={`flex-1 border rounded-lg p-3 flex items-center cursor-pointer ${
              errandDetails.urgency === "express"
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="urgency"
              value="express"
              checked={errandDetails.urgency === "express"}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="ml-2 flex-1">
              <span className="block font-medium">Express</span>
              <span className="block text-xs text-gray-500">
                Faster delivery (1.5x price)
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!errandDetails.itemDescription.trim()}
          className={`flex-1 py-3 px-6 bg-primary text-white rounded-xl font-medium transition-colors ${
            !errandDetails.itemDescription.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary/90"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 3: Confirmation
  const renderRiderOrMarketplace = () => {
    if (orderType === "direct" && selectedRider) {
      return (
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <img
              src={selectedRider.photo}
              alt={selectedRider.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h4 className="font-medium">{selectedRider.name}</h4>
              <div className="text-sm text-gray-600">
                {selectedRider.vehicleType === "bike" ? "Bike" : "Tricycle"} •{" "}
                {selectedRider.rating.toFixed(1)} ★
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium">Marketplace Order</h4>
              <p className="text-sm text-gray-600">
                Your errand will be visible to all nearby riders
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Confirm Your Errand</h3>

      {renderRiderOrMarketplace()}

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="flex">
          <FiMapPin className="text-primary mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Pickup</p>
            <p className="text-gray-800">{errandDetails.pickupAddress}</p>
          </div>
        </div>

        <div className="flex">
          <FiMapPin className="text-red-500 mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Dropoff</p>
            <p className="text-gray-800">{errandDetails.dropoffAddress}</p>
          </div>
        </div>

        <div className="flex">
          <FiPackage className="text-primary mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Package</p>
            <p className="text-gray-800">
              {errandDetails.packageSize.charAt(0).toUpperCase() +
                errandDetails.packageSize.slice(1)}
              {errandDetails.isFragile ? " (Fragile)" : ""}
            </p>
            <p className="text-gray-600 text-sm">
              {errandDetails.itemDescription}
            </p>
          </div>
        </div>

        <div className="flex">
          <FiClock className="text-primary mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Estimated Time</p>
            <p className="text-gray-800">
              {errandDetails.urgency === "express" ? "Express: " : ""}
              {errandDetails.estimatedDuration} mins
            </p>
          </div>
        </div>

        <div className="flex">
          <FiDollarSign className="text-primary mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Price</p>
            <p className="text-gray-800 font-medium">
              ₦{errandDetails.estimatedPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={errandDetails.notes}
          onChange={handleChange}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Any special instructions for the rider"
          rows={2}
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
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
              Processing...
            </>
          ) : (
            "Create Errand"
          )}
        </button>
      </div>
    </div>
  );

  // Confirmation Success Modal
  const renderConfirmationModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Errand Created!
          </h2>
          <p className="text-gray-medium">
            Your errand request has been created successfully. A rider will be
            assigned shortly.
          </p>
        </div>
        <button
          onClick={handleConfirm}
          className="w-full py-3 px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Done
        </button>
      </motion.div>
    </motion.div>
  );

  // Add a function to get submit button text based on order type
  const getSubmitButtonText = () => {
    if (isLoading) return "Processing...";
    if (currentStep < 3) return "Next";
    return orderType === "direct" ? "Create Errand" : "Submit to Marketplace";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-xl shadow-xl flex flex-col h-full"
    >
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-secondary">
          {currentStep === 1
            ? "New Errand"
            : currentStep === 2
            ? "Package Details"
            : "Confirm Errand"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {renderStepIndicator()}

          {currentStep === 1 && renderLocationStep()}
          {currentStep === 2 && renderPackageStep()}
          {currentStep === 3 && renderConfirmationStep()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="button"
              onClick={currentStep < 3 ? handleNext : handleSubmit}
              disabled={isLoading}
              className={`px-6 py-2 ${
                isLoading ? "bg-gray-400" : "bg-primary"
              } text-white rounded-lg flex items-center space-x-2`}
            >
              <span>{getSubmitButtonText()}</span>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                currentStep === 3 && <FiCheck className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {showConfirmation && renderConfirmationModal()}
      </AnimatePresence>
    </motion.div>
  );
};

export default ErrandForm;
