import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMic, FiMessageSquare, FiX } from "react-icons/fi";
import { RiMotorbikeFill } from "react-icons/ri";
import { Rider } from "../../types";

interface HollerModalProps {
  rider: Rider;
  onClose: () => void;
  onHoller: (note: string) => void;
}

const HollerModal = ({ rider, onClose, onHoller }: HollerModalProps) => {
  const [note, setNote] = useState("");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showEmojiReactions, setShowEmojiReactions] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const emojis = ["👋", "🙏", "😊", "👍", "⏱️"];

  const startVoiceNote = () => {
    setIsRecordingVoice(true);
    // Would implement actual voice recording here
    setTimeout(() => {
      setIsRecordingVoice(false);
      setNote(note + " [Voice note added]");
    }, 3000);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setNote(note + " " + emoji);
    setShowEmojiReactions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="bg-white rounded-xl sm:rounded-3xl shadow-2xl p-4 sm:p-6"
    >
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-secondary">
          Holler at {rider.name}
        </h3>
        <button
          onClick={onClose}
          className="p-1 sm:p-2 text-gray-medium rounded-full hover:bg-gray-100"
        >
          <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
        <img
          src={rider.photo}
          alt={rider.name}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
        />
        <div>
          <div className="font-medium text-secondary">{rider.name}</div>
          <div className="flex items-center text-xs sm:text-sm text-gray-medium">
            {rider.vehicleType === "bike" ? (
              <RiMotorbikeFill className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            ) : (
              <span className="text-xs mr-1">🛺</span>
            )}
            <span className="capitalize mr-2 sm:mr-3">{rider.vehicleType}</span>
            <span className="text-primary font-medium">
              {rider.eta} min away
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-medium mb-1 sm:mb-2">
          Quick note (optional)
        </label>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Any special instructions?"
            className="flex-1 py-2 sm:py-3 px-3 sm:px-4 border border-gray-200 rounded-l-lg sm:rounded-l-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            onClick={startVoiceNote}
            className={`p-2 sm:p-3 ${
              isRecordingVoice ? "bg-red-500 animate-pulse" : "bg-gray-100"
            } rounded-r-lg sm:rounded-r-xl`}
          >
            <FiMic
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isRecordingVoice ? "text-white" : "text-gray-medium"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <button
          onClick={() => setShowEmojiReactions(!showEmojiReactions)}
          className="p-2 bg-gray-100 rounded-lg sm:rounded-xl text-gray-medium hover:bg-gray-200"
        >
          <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <AnimatePresence>
          {showEmojiReactions && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex space-x-1 sm:space-x-2"
            >
              {emojis.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${
                    selectedEmoji === emoji
                      ? "bg-primary/20 border border-primary"
                      : "bg-gray-100"
                  } rounded-full flex items-center justify-center text-base sm:text-xl hover:bg-gray-200`}
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onHoller(note)}
        className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-primary text-white rounded-lg sm:rounded-xl font-medium shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
      >
        <RiMotorbikeFill className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Holler Now</span>
      </motion.button>

      <div className="mt-3 sm:mt-4 text-2xs sm:text-xs text-center text-gray-medium">
        By hollering, you agree to our{" "}
        <span className="text-primary">Terms of Service</span>
      </div>
    </motion.div>
  );
};

export default HollerModal;
