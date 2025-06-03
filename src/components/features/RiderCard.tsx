import { FiStar, FiClock, FiHeart } from "react-icons/fi";
import { RiMotorbikeFill } from "react-icons/ri";
import { Rider } from "../../types";

interface RiderCardProps {
  rider: Rider;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect: (rider: Rider) => void;
  onToggleFavorite: (riderId: number) => void;
}

const RiderCard = ({
  rider,
  isSelected = false,
  isFavorite = false,
  onSelect,
  onToggleFavorite,
}: RiderCardProps) => {
  const renderRating = () => {
    const fullStars = Math.floor(rider.rating);
    const hasHalfStar = rider.rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="text-yellow-400">
            {i < fullStars ? (
              <FiStar className="w-3 h-3 fill-current" />
            ) : i === fullStars && hasHalfStar ? (
              <div className="relative">
                <FiStar className="w-3 h-3" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <FiStar className="w-3 h-3 fill-current" />
                </div>
              </div>
            ) : (
              <FiStar className="w-3 h-3" />
            )}
          </div>
        ))}
        <span className="text-xs text-gray-500 ml-1">
          {rider.rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const getStatusColor = () => {
    return rider.isOnline ? "bg-green-500" : "bg-gray-400";
  };

  // Calculate estimated fare
  const estimatedFare = () => {
    const baseFare = 500; // Base fare in Naira
    const distanceMultiplier = parseFloat(rider.distance) * 100;
    const timeMultiplier = rider.eta * 20;

    return (baseFare + distanceMultiplier + timeMultiplier).toFixed(0);
  };

  return (
    <div
      className={`relative mb-2 p-3 sm:p-4 rounded-xl cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary/10 border border-primary/30"
          : "bg-white border border-gray-100 hover:bg-gray-50"
      }`}
      onClick={() => onSelect(rider)}
    >
      <div className="absolute top-2 right-2">
        <div className="relative">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
          <div className="absolute -top-1 -right-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(rider.id);
              }}
              className={`p-1.5 rounded-full ${
                isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-400"
              } shadow-sm`}
            >
              <FiHeart className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <img
          src={rider.photo}
          alt={rider.name}
          className="w-14 h-14 rounded-lg object-cover mr-3"
        />
        <div>
          <h3 className="font-medium text-secondary">{rider.name}</h3>
          <div className="flex items-center text-xs text-gray-medium mt-1">
            {renderRating()}
            <span className="mx-1">•</span>
            <span>{rider.completedRides} rides</span>
          </div>
          <div className="flex items-center text-xs mt-1">
            <RiMotorbikeFill
              className={`w-3 h-3 mr-1 ${
                rider.vehicleType === "bike"
                  ? "text-green-600"
                  : "text-amber-600"
              }`}
            />
            <span className="capitalize mr-2">{rider.vehicleType}</span>
            <span className="mr-1">•</span>
            <span className="text-primary">₦{estimatedFare()}</span>
            <span className="mx-1">•</span>
            <FiClock className="w-3 h-3 mr-1" />
            <span>{rider.eta} min</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelect(rider)}
        className={`mt-2 w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
          isSelected
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {isSelected ? "Selected" : "Select"}
      </button>
    </div>
  );
};

export default RiderCard;
