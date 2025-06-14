import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiMapPin,
  FiNavigation2,
  FiClock,
  FiDollarSign,
  FiCheck,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { RiMotorbikeFill } from "react-icons/ri";
import { Rider, Location } from "../../types";

interface PickupFormProps {
  userLocation: Location;
  selectedRider: Rider | null;
  orderType: "marketplace" | "direct";
  onClose: () => void;
  onCreatePickup: (pickupDetails: PickupDetails) => void;
}

export interface PickupDetails {
  pickupLocation: Location;
  pickupAddress: string;
  destination: Location;
  destinationAddress: string;
  passengerCount: number;
  urgency: "normal" | "express";
  estimatedPrice: number;
  estimatedDuration: number;
  riderId: number | null;
  notes: string;
  specialRequests: {
    waitingTime: boolean;
    helpWithLuggage: boolean;
    childSeat: boolean;
    wheelchairAccessible: boolean;
  };
}

const PickupForm = ({
  userLocation,
  selectedRider,
  orderType,
  onClose,
  onCreatePickup,
}: PickupFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [pickupDetails, setPickupDetails] = useState<PickupDetails>({
    pickupLocation: userLocation,
    pickupAddress: "Current Location",
    destination: {
      lat: userLocation.lat + 0.01,
      lng: userLocation.lng + 0.01,
    },
    destinationAddress: "",
    passengerCount: 1,
    urgency: "normal",
    estimatedPrice: 0,
    estimatedDuration: 0,
    riderId: selectedRider?.id || null,
    notes: "",
    specialRequests: {
      waitingTime: false,
      helpWithLuggage: false,
      childSeat: false,
      wheelchairAccessible: false,
    },
  });

  useEffect(() => {
    calculatePriceAndDuration();
  }, [
    pickupDetails.pickupLocation,
    pickupDetails.destination,
    pickupDetails.passengerCount,
    pickupDetails.urgency,
    pickupDetails.specialRequests,
  ]);

  const calculatePriceAndDuration = () => {
    // Calculate distance
    const distance =
      Math.sqrt(
        Math.pow(
          pickupDetails.destination.lat - pickupDetails.pickupLocation.lat,
          2
        ) +
          Math.pow(
            pickupDetails.destination.lng - pickupDetails.pickupLocation.lng,
            2
          )
      ) * 111; // Convert to kilometers roughly

    // Calculate duration in minutes
    const duration = distance * 3; // Assume 3 minutes per kilometer for pickup

    // Base price in Naira
    let price = 300 + distance * 150;

    // Add passenger count cost
    if (pickupDetails.passengerCount > 1) {
      price += (pickupDetails.passengerCount - 1) * 100;
    }

    // Add urgency cost
    if (pickupDetails.urgency === "express") price *= 1.3;

    // Add special requests cost
    const specialRequestsCount = Object.values(
      pickupDetails.specialRequests
    ).filter(Boolean).length;
    price += specialRequestsCount * 200;

    // Update state
    setPickupDetails({
      ...pickupDetails,
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
      if (name.startsWith("specialRequests.")) {
        const requestName = name.split(".")[1];
        setPickupDetails({
          ...pickupDetails,
          specialRequests: {
            ...pickupDetails.specialRequests,
            [requestName]: checkbox.checked,
          },
        });
      } else {
        setPickupDetails({
          ...pickupDetails,
          [name]: checkbox.checked,
        });
      }
    } else {
      setPickupDetails({
        ...pickupDetails,
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
    onCreatePickup(pickupDetails);
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
      <h3 className="text-lg font-semibold mb-4">Trip Details</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pickup Location
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMapPin className="text-gray-400" />
          </div>
          <input
            type="text"
            name="pickupAddress"
            value={pickupDetails.pickupAddress}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Pickup location"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destination
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiNavigation2 className="text-gray-400" />
          </div>
          <input
            type="text"
            name="destinationAddress"
            value={pickupDetails.destinationAddress}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Where are you going?"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Passengers
        </label>
        <select
          name="passengerCount"
          value={pickupDetails.passengerCount}
          onChange={handleChange}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value={1}>1 Passenger</option>
          <option value={2}>2 Passengers</option>
          <option value={3}>3 Passengers</option>
          <option value={4}>4 Passengers</option>
        </select>
      </div>
    </div>
  );

  // Step 2: Trip Preferences
  const renderPreferencesStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Trip Preferences</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Trip Priority
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="urgency"
              value="normal"
              checked={pickupDetails.urgency === "normal"}
              onChange={handleChange}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Standard</div>
              <div className="text-sm text-gray-500">Regular pickup time</div>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="urgency"
              value="express"
              checked={pickupDetails.urgency === "express"}
              onChange={handleChange}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Express (+30% fee)</div>
              <div className="text-sm text-gray-500">Priority pickup</div>
            </div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Special Requests
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="specialRequests.waitingTime"
              checked={pickupDetails.specialRequests.waitingTime}
              onChange={handleChange}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Wait for me (+₦200)</div>
              <div className="text-sm text-gray-500">
                Driver will wait up to 5 minutes
              </div>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="specialRequests.helpWithLuggage"
              checked={pickupDetails.specialRequests.helpWithLuggage}
              onChange={handleChange}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Help with luggage (+₦200)</div>
              <div className="text-sm text-gray-500">
                Driver will assist with bags
              </div>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="specialRequests.childSeat"
              checked={pickupDetails.specialRequests.childSeat}
              onChange={handleChange}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Child seat required (+₦200)</div>
              <div className="text-sm text-gray-500">
                Vehicle with child safety seat
              </div>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="specialRequests.wheelchairAccessible"
              checked={pickupDetails.specialRequests.wheelchairAccessible}
              onChange={handleChange}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Wheelchair accessible (+₦200)</div>
              <div className="text-sm text-gray-500">
                Vehicle suitable for wheelchair users
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderRiderOrMarketplace = () => {
    if (orderType === "direct" && selectedRider) {
      return (
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <div className="flex items-center">
            <img
              src={selectedRider.photo}
              alt={selectedRider.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <h4 className="font-medium">{selectedRider.name}</h4>
              <div className="flex items-center text-sm text-gray-600">
                <RiMotorbikeFill className="mr-1" />
                <span className="capitalize">{selectedRider.vehicleType}</span>
                <span className="mx-2">•</span>
                <span>{selectedRider.eta} mins away</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <FiUsers className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium">Marketplace Order</h4>
            <p className="text-sm text-gray-600">
              Available to all nearby riders
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Step 3: Confirmation
  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Confirm Your Trip</h3>

      {renderRiderOrMarketplace()}

      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex">
          <FiMapPin className="text-primary mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">From</p>
            <p className="text-gray-800">{pickupDetails.pickupAddress}</p>
          </div>
        </div>

        <div className="flex">
          <FiNavigation2 className="text-primary mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">To</p>
            <p className="text-gray-800">{pickupDetails.destinationAddress}</p>
          </div>
        </div>

        <div className="flex">
          <FiUser className="text-primary mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Passengers</p>
            <p className="text-gray-800">
              {pickupDetails.passengerCount} passenger
              {pickupDetails.passengerCount > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex">
          <FiClock className="text-primary mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Estimated Time</p>
            <p className="text-gray-800">
              {pickupDetails.urgency === "express" ? "Express: " : ""}
              {pickupDetails.estimatedDuration} mins
            </p>
          </div>
        </div>

        <div className="flex">
          <FiDollarSign className="text-primary mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Estimated Fare</p>
            <p className="text-gray-800 font-medium">
              ₦{pickupDetails.estimatedPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {Object.values(pickupDetails.specialRequests).some(Boolean) && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Special Requests</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {pickupDetails.specialRequests.waitingTime && (
              <li>• Driver will wait</li>
            )}
            {pickupDetails.specialRequests.helpWithLuggage && (
              <li>• Help with luggage</li>
            )}
            {pickupDetails.specialRequests.childSeat && (
              <li>• Child seat required</li>
            )}
            {pickupDetails.specialRequests.wheelchairAccessible && (
              <li>• Wheelchair accessible</li>
            )}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={pickupDetails.notes}
          onChange={handleChange}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Any special instructions for the rider"
          rows={2}
        />
      </div>
    </div>
  );

  // Confirmation Success Modal
  const renderConfirmationModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl my-4 min-h-fit"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Pickup Requested!
          </h2>
          <p className="text-gray-medium">
            Your pickup request has been created successfully. A rider will be
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

  const getSubmitButtonText = () => {
    if (isLoading) return "Processing...";
    if (currentStep < 3) return "Next";
    return orderType === "direct" ? "Request Pickup" : "Submit to Marketplace";
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
            ? "New Pickup"
            : currentStep === 2
            ? "Trip Preferences"
            : "Confirm Pickup"}
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
          {currentStep === 2 && renderPreferencesStep()}
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
              disabled={
                isLoading ||
                (currentStep === 1 && !pickupDetails.destinationAddress)
              }
              className={`px-6 py-2 ${
                isLoading ||
                (currentStep === 1 && !pickupDetails.destinationAddress)
                  ? "bg-gray-400"
                  : "bg-primary"
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

export default PickupForm;
