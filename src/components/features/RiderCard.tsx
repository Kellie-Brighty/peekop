import { motion } from "framer-motion";
import { FiStar, FiHeart } from "react-icons/fi";
import { RiMotorbikeFill, RiTruckFill } from "react-icons/ri";
import { Rider } from "../../types";

interface RiderCardProps {
  rider: Rider;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (rider: Rider) => void;
  onToggleFavorite: (riderId: number) => void;
}

const RiderCard = ({
  rider,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: RiderCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-3 sm:p-4 mb-2 sm:mb-3 rounded-lg sm:rounded-xl border ${
        isSelected ? "border-primary bg-primary/5" : "border-gray-100"
      }`}
      onClick={() => onSelect(rider)}
    >
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="relative">
          <img
            src={rider.photo}
            alt={rider.name}
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover"
          />
          <div
            className={`absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              rider.isOnline ? "bg-green-500" : "bg-gray-400"
            } border-2 border-white`}
          ></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-secondary text-sm sm:text-base truncate pr-2">
              {rider.name}
            </h4>
            <button
              className="text-gray-400 hover:text-red-500 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(rider.id);
              }}
            >
              <FiHeart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-medium flex-wrap">
            <div className="flex items-center mr-2 sm:mr-3">
              <FiStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mr-0.5 sm:mr-1" />
              <span>{rider.rating.toFixed(1)}</span>
            </div>
            {rider.vehicleType === "bike" ? (
              <RiMotorbikeFill className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
            ) : (
              <RiTruckFill className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
            )}
            <span className="capitalize mr-2 sm:mr-3">{rider.vehicleType}</span>
            <span className="hidden sm:inline">
              {rider.completedRides} rides
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-medium text-primary text-sm sm:text-base">
            {rider.eta} min
          </div>
          <div className="text-xs sm:text-sm text-gray-medium">
            {rider.distance}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RiderCard;
