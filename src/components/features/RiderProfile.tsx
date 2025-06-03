import { motion } from "framer-motion";
import {
  FiX,
  FiStar,
  FiCalendar,
  FiGlobe,
  FiInfo,
  FiHeart,
} from "react-icons/fi";
import { RiMotorbikeFill, RiTruckFill } from "react-icons/ri";
import { Rider } from "../../types";

interface RiderProfileProps {
  rider: Rider;
  isFavorite: boolean;
  onClose: () => void;
  onHoller: (rider: Rider) => void;
  onCreateErrand: (rider: Rider) => void;
  onToggleFavorite: (riderId: number) => void;
  serviceMode: "pickup" | "errand";
}

const RiderProfile: React.FC<RiderProfileProps> = ({
  rider,
  isFavorite,
  onClose,
  onHoller,
  onCreateErrand,
  onToggleFavorite,
  serviceMode,
}) => {
  const renderRating = () => {
    const fullStars = Math.floor(rider.rating);
    const hasHalfStar = rider.rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="text-yellow-400">
            {i < fullStars ? (
              <FiStar className="w-4 h-4 fill-current" />
            ) : i === fullStars && hasHalfStar ? (
              <div className="relative">
                <FiStar className="w-4 h-4" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <FiStar className="w-4 h-4 fill-current" />
                </div>
              </div>
            ) : (
              <FiStar className="w-4 h-4" />
            )}
          </div>
        ))}
        <span className="text-sm text-gray-700 ml-1 font-medium">
          {rider.rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-2xl shadow-xl p-5 max-w-md w-full"
    >
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-xl font-bold text-secondary">Rider Profile</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-medium rounded-full hover:bg-gray-100"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center mb-6">
        <img
          src={rider.photo}
          alt={rider.name}
          className="w-20 h-20 rounded-xl object-cover"
        />
        <div className="ml-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-semibold text-secondary">
              {rider.name}
            </h4>
            <div
              className={`w-2 h-2 rounded-full ${
                rider.isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
          </div>
          {renderRating()}
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <span className="flex items-center">
              {rider.vehicleType === "bike" ? (
                <RiMotorbikeFill className="w-4 h-4 mr-1 text-green-600" />
              ) : (
                <RiTruckFill className="w-4 h-4 mr-1 text-amber-600" />
              )}
              <span className="capitalize">{rider.vehicleType} Rider</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500 mb-1">Distance</div>
          <div className="font-medium">{rider.distance}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500 mb-1">Estimated Arrival</div>
          <div className="font-medium">{rider.eta} minutes</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500 mb-1">Completed Rides</div>
          <div className="font-medium">{rider.completedRides}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500 mb-1">Specialization</div>
          <div className="font-medium capitalize">
            {rider.specialization || "General"}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h5 className="flex items-center text-secondary font-medium mb-2">
          <FiInfo className="mr-2" /> About
        </h5>
        <p className="text-gray-600 text-sm">
          {rider.biography || "No biography provided."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        {rider.languages && (
          <div className="flex items-center text-sm text-gray-600">
            <FiGlobe className="mr-1" />
            <span>Speaks: {rider.languages.join(", ")}</span>
          </div>
        )}
        {rider.joinedDate && (
          <div className="flex items-center text-sm text-gray-600">
            <FiCalendar className="mr-1" />
            <span>Member since {rider.joinedDate}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between py-2">
        <span className="text-gray-600">Estimated Fare</span>
        <span className="font-medium">
          ₦{(parseFloat(rider.distance) * 500 + rider.eta * 50).toFixed(2)}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onToggleFavorite(rider.id)}
          className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isFavorite
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FiHeart className={`mr-1 ${isFavorite ? "fill-current" : ""}`} />
          {isFavorite ? "Favorited" : "Add to Favorites"}
        </button>

        <button
          onClick={() =>
            serviceMode === "pickup" ? onHoller(rider) : onCreateErrand(rider)
          }
          className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {serviceMode === "pickup" ? "Holler Now" : "Create Errand"}
        </button>
      </div>
    </motion.div>
  );
};

export default RiderProfile;
