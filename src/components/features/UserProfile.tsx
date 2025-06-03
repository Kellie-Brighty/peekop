import { motion } from "framer-motion";
import { FiAward, FiStar, FiTrendingUp } from "react-icons/fi";
import { User } from "../../types";

interface UserProfileProps {
  user: User;
  onClose: () => void;
}

const UserProfile = ({ user, onClose }: UserProfileProps) => {
  const getNextTier = () => {
    switch (user.tier) {
      case "Bronze":
        return { name: "Silver", points: 500 };
      case "Silver":
        return { name: "Gold", points: 1000 };
      case "Gold":
        return { name: "Platinum", points: 2000 };
      default:
        return { name: "Silver", points: 500 };
    }
  };

  const nextTier = getNextTier();
  const progressPercentage = (user.points / nextTier.points) * 100;

  // Mock achievements
  const achievements = [
    { id: 1, name: "First Ride", icon: "🎯", unlocked: true },
    {
      id: 2,
      name: "5 Rides",
      icon: "🔄",
      unlocked: user.completedRides && user.completedRides >= 5,
    },
    {
      id: 3,
      name: "Favorite Rider",
      icon: "❤️",
      unlocked: user.favorites && user.favorites.length > 0,
    },
    { id: 4, name: "Quick Pickup Pro", icon: "⚡", unlocked: false },
    { id: 5, name: "Weekend Warrior", icon: "🏆", unlocked: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-secondary">
          Your Profile
        </h2>
        <button
          onClick={onClose}
          className="p-1 sm:p-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mr-3 sm:mr-4">
          <span className="text-xl sm:text-2xl font-bold text-primary">
            {user.fullName.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-secondary">
            {user.fullName}
          </h3>
          <p className="text-sm text-gray-medium">{user.phone}</p>
          <div className="flex items-center mt-1">
            <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
              <FiAward className="mr-1" />
              {user.tier} Tier
            </div>
            <div className="ml-2 text-primary-dark font-medium text-xs sm:text-sm">
              {user.points} points
            </div>
          </div>
        </div>
      </div>

      {/* Progress to next tier */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm text-gray-medium">
            Progress to {nextTier.name}
          </span>
          <span className="text-xs sm:text-sm font-medium text-primary">
            {user.points}/{nextTier.points} points
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className="h-full bg-primary"
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-bold text-secondary mb-3 sm:mb-4 flex items-center">
          <FiStar className="mr-2 text-yellow-500" />
          Achievements
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-2 sm:p-3 rounded-lg sm:rounded-xl text-center ${
                achievement.unlocked
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <div className="text-xl sm:text-2xl mb-1">{achievement.icon}</div>
              <div className="text-xs font-medium">{achievement.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-secondary mb-3 sm:mb-4 flex items-center">
          <FiTrendingUp className="mr-2 text-blue-500" />
          Your Stats
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {user.completedRides || 0}
            </div>
            <div className="text-xs sm:text-sm text-blue-800">Total Rides</div>
          </div>
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {user.favorites?.length || 0}
            </div>
            <div className="text-xs sm:text-sm text-green-800">
              Favorite Riders
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
