import { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiMapPin, FiMic, FiPackage, FiUsers } from "react-icons/fi";
import { RiMotorbikeFill } from "react-icons/ri";
import { Rider } from "../../types";

interface HollerModalProps {
  rider?: Rider;
  orderType: "marketplace" | "direct";
  onClose: () => void;
  onHoller: (note: string) => void;
}

const HollerModal = ({
  rider,
  orderType,
  onClose,
  onHoller,
}: HollerModalProps) => {
  const [note, setNote] = useState("");
  const [showEmojiReactions, setShowEmojiReactions] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const emojis = ["👋", "🙏", "😊", "👍", "⏱️"];

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setNote((prev) => prev + " " + emoji);
    setShowEmojiReactions(false);
  };

  const startVoiceNote = () => {
    setIsRecordingVoice(true);
    // Would implement actual voice recording here
    setTimeout(() => {
      setIsRecordingVoice(false);
      setNote((prev) => prev + " [Voice note]");
    }, 3000);
  };

  // Calculate estimated fare based on distance and ETA
  const estimatedFare = () => {
    if (!rider) return "varies";

    const baseFare = 500; // Base fare in Naira
    const distanceMultiplier = parseFloat(rider.distance) * 100;
    const timeMultiplier = rider.eta * 20;

    return (baseFare + distanceMultiplier + timeMultiplier).toFixed(2);
  };

  const renderRiderInfo = () => {
    if (!rider) return null;

    return (
      <div className="flex items-center mb-3 sm:mb-4">
        <img
          src={rider.photo}
          alt={rider.name}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-cover"
        />
        <div className="ml-3 sm:ml-4">
          <div className="flex items-center text-sm sm:text-base">
            <RiMotorbikeFill
              className={`w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 ${
                rider.vehicleType === "bike"
                  ? "text-green-600"
                  : "text-amber-600"
              }`}
            />
            <span className="capitalize">{rider.vehicleType}</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-medium">
            <span className="font-medium">₦{estimatedFare()}</span> •{" "}
            {rider.eta} mins • {rider.distance}
          </div>
        </div>
      </div>
    );
  };

  const renderMarketplaceInfo = () => {
    return (
      <div className="flex items-center mb-3 sm:mb-4 bg-blue-50 p-3 rounded-lg">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
          <FiUsers className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        </div>
        <div className="ml-3 sm:ml-4">
          <h4 className="font-medium">Marketplace Order</h4>
          <p className="text-xs sm:text-sm text-gray-600">
            Your request will be available to all nearby riders
          </p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5"
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-secondary">
          {orderType === "direct"
            ? `Holler at ${rider?.name}`
            : "Create Pickup Request"}
        </h3>
        <button
          onClick={onClose}
          className="p-1 sm:p-2 text-gray-medium rounded-full hover:bg-gray-100"
        >
          <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {orderType === "direct" ? renderRiderInfo() : renderMarketplaceInfo()}

      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Add a note (optional)
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setShowEmojiReactions(!showEmojiReactions)}
              className="text-gray-500 hover:text-gray-700"
            >
              😊
            </button>
            <button
              type="button"
              onClick={startVoiceNote}
              className={`text-gray-500 hover:text-gray-700 ${
                isRecordingVoice ? "text-red-500 animate-pulse" : ""
              }`}
            >
              <FiMic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showEmojiReactions && (
          <div className="flex justify-center space-x-2 mb-2 bg-gray-50 p-2 rounded-lg">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className="text-xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary text-sm sm:text-base"
          rows={3}
          placeholder="Any special instructions..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>

      <div className="flex items-center justify-between mb-3 sm:mb-4 text-xs sm:text-sm bg-blue-50 text-blue-800 p-2 sm:p-3 rounded-lg">
        <div className="flex items-center">
          <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span>Current Location</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onHoller(note)}
        className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-primary text-white rounded-lg sm:rounded-xl font-medium shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
      >
        {orderType === "direct" ? (
          <>
            <RiMotorbikeFill className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Holler Now</span>
          </>
        ) : (
          <>
            <FiPackage className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Submit to Marketplace</span>
          </>
        )}
      </motion.button>

      <div className="mt-3 sm:mt-4 text-2xs sm:text-xs text-center text-gray-medium">
        {selectedEmoji ? (
          <div className="flex items-center justify-center">
            <span className="mr-2">Quick response:</span>
            <span className="text-lg">{selectedEmoji}</span>
          </div>
        ) : (
          "By hollering, you agree to the terms of service"
        )}
      </div>
    </motion.div>
  );
};

export default HollerModal;
