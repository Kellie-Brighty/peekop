import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  FiMapPin,
  FiPlus,
  FiCrosshair,
  FiPackage,
  // FiClock,
  FiChevronUp,
  FiChevronDown,
  FiStar,
  // FiMic,
  // FiMessageSquare,
  // FiHeart,
  FiUser,
} from "react-icons/fi";
import { RiMotorbikeFill } from "react-icons/ri";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { useNavigate } from "react-router-dom";
import RiderCard from "../../components/features/RiderCard";
import UserProfile from "../../components/features/UserProfile";
import HollerModal from "../../components/features/HollerModal";
import { User, Rider, Location } from "../../types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [expandedRiderList, setExpandedRiderList] = useState(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [showHollerOptions, setShowHollerOptions] = useState(false);
  const [destination, _setDestination] = useState<Location | null>(null);
  const [user, setUser] = useState<User | null>(null);
  // const [showEmojiReactions, setShowEmojiReactions] = useState(false);
  // const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [rideInProgress, setRideInProgress] = useState(false);
  const [riderArriving, setRiderArriving] = useState(false);
  const bottomSheetControls = useAnimation();
  const mapRef = useRef(null);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Create mock user data if not available
      const mockUser: User = {
        id: 1,
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        verified: true,
        points: 125,
        tier: "Bronze",
        favorites: [2, 5],
        completedRides: 0,
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    }

    // Check if we already have location permission
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          setShowLocationPrompt(false);
          getCurrentLocation();
        }
      });
  }, []);

  useEffect(() => {
    if (expandedRiderList) {
      bottomSheetControls.start({ y: 0 });
    } else {
      bottomSheetControls.start({ y: "70%" });
    }
  }, [expandedRiderList, bottomSheetControls]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setShowLocationPrompt(false);
        // Generate mock riders
        generateMockRiders(location);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoading(false);
      }
    );
  };

  const generateMockRiders = (center: Location) => {
    const vehicleTypes: ("bike" | "tricycle")[] = ["bike", "tricycle"];
    const names = [
      "Michael Johnson",
      "Sarah Williams",
      "David Brown",
      "Emma Davis",
      "James Wilson",
      "Olivia Taylor",
      "Robert Anderson",
      "Sophia Martinez",
    ];

    const mockRiders = Array.from({ length: 8 }, (_, i) => {
      const location = {
        lat: center.lat + (Math.random() - 0.5) * 0.01,
        lng: center.lng + (Math.random() - 0.5) * 0.01,
      };

      // Calculate mock distance and ETA based on random location
      const distance = calculateDistance(center, location);
      const eta = Math.floor(distance * 10) + 2;

      return {
        id: i + 1,
        name: names[i],
        photo: `https://randomuser.me/api/portraits/${
          i % 2 ? "men" : "women"
        }/${i + 1}.jpg`,
        rating: 3.5 + Math.random() * 1.5,
        vehicleType: vehicleTypes[i % 2],
        eta: eta,
        distance: `${(distance * 1000).toFixed(0)}m`,
        location: location,
        isOnline: Math.random() > 0.2,
        completedRides: Math.floor(Math.random() * 500),
      };
    });

    setRiders(mockRiders);
  };

  const calculateDistance = (loc1: Location, loc2: Location) => {
    // Simple Euclidean distance for demo purposes
    return Math.sqrt(
      Math.pow(loc1.lat - loc2.lat, 2) + Math.pow(loc1.lng - loc2.lng, 2)
    );
  };

  const handleRiderSelect = (rider: Rider) => {
    setSelectedRider(rider);
    setShowHollerOptions(true);
  };

  const handleHoller = (_note: string = "") => {
    if (selectedRider) {
      // Simulate booking process
      alert(
        `Hollered at ${selectedRider.name}! They'll be with you in ${selectedRider.eta} minutes.`
      );
      setShowHollerOptions(false);

      // Simulate rider arriving
      setTimeout(() => {
        setRiderArriving(true);

        // After some time, set ride in progress
        setTimeout(() => {
          setRiderArriving(false);
          setRideInProgress(true);

          // Mock ride completion
          setTimeout(() => {
            setRideInProgress(false);

            // Update user points
            if (user) {
              const updatedUser = {
                ...user,
                points: (user.points || 0) + 25,
                completedRides: (user.completedRides || 0) + 1,
              };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }
          }, 10000);
        }, 5000);
      }, 8000);
    } else {
      alert("Please select a rider first!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/", { replace: true });
  };

  const toggleFavoriteRider = (riderId: number) => {
    if (!user) return;

    const favorites = user.favorites || [];
    const newFavorites = favorites.includes(riderId)
      ? favorites.filter((id) => id !== riderId)
      : [...favorites, riderId];

    const updatedUser = { ...user, favorites: newFavorites };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const isRiderFavorite = (riderId: number) => {
    return user?.favorites?.includes(riderId) || false;
  };

  // const startVoiceNote = () => {
  //   setIsRecordingVoice(true);
  //   // Would implement actual voice recording here
  //   setTimeout(() => {
  //     setIsRecordingVoice(false);
  //   }, 3000);
  // };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden w-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">Peekop</h1>
            {user && (
              <div className="flex items-center">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center">
                    <p className="font-medium text-secondary">
                      {user.fullName}
                    </p>
                    <div className="ml-2 px-2 py-0.5 bg-yellow-100 rounded-full text-xs text-yellow-700">
                      {user.tier} • {user.points} pts
                    </div>
                  </div>
                  <p className="text-sm text-gray-medium">{user.phone}</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => setShowUserProfile(true)}
                    className="p-2 text-gray-medium hover:text-primary transition-colors"
                  >
                    <FiUser className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 sm:px-4 sm:py-2 text-gray-medium hover:text-primary transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showUserProfile && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          >
            <div className="w-full max-w-md mx-auto">
              <UserProfile
                user={user}
                onClose={() => setShowUserProfile(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Permission Prompt */}
      <AnimatePresence>
        {showLocationPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiMapPin className="w-10 h-10 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold text-secondary mb-2">
                  Enable Location Services
                </h2>
                <p className="text-gray-medium">
                  We need your location to show you available riders nearby and
                  provide accurate delivery services.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={getCurrentLocation}
                  className="w-full py-4 px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <FiCrosshair className="w-5 h-5" />
                  <span>Allow Location Access</span>
                </button>
                <button
                  onClick={() => setShowLocationPrompt(false)}
                  className="w-full py-4 px-6 bg-gray-100 text-gray-medium rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Not Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rider Arriving Notification */}
      <AnimatePresence>
        {riderArriving && selectedRider && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-16 sm:top-20 inset-x-0 flex justify-center z-40 px-4"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-green-100 text-green-800 px-4 sm:px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base"
            >
              <RiMotorbikeFill className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="font-medium">
                {selectedRider.name} is arriving!
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ride In Progress Banner */}
      <AnimatePresence>
        {rideInProgress && selectedRider && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-16 sm:top-20 inset-x-0 flex justify-center z-40 px-4"
          >
            <motion.div className="bg-blue-100 text-blue-800 px-4 sm:px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base">
              <FiPackage className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="font-medium">
                Ride in progress with {selectedRider.name}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
        {/* Map Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] flex items-center justify-center">
              <div className="text-center">
                <RiMotorbikeFill className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-bounce mx-auto mb-4" />
                <p className="text-gray-medium">Loading map...</p>
              </div>
            </div>
          ) : userLocation ? (
            <div className="relative h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)]">
              <Map
                ref={mapRef}
                defaultCenter={[userLocation.lat, userLocation.lng]}
                defaultZoom={15}
                attribution={false}
                metaWheelZoom={true}
                animate={true}
                touchEvents={true}
              >
                {/* User Location Marker */}
                <Marker
                  width={40}
                  anchor={[userLocation.lat, userLocation.lng]}
                  color="#2563EB"
                />

                {/* Rider Markers */}
                {riders.map((rider) => (
                  <Marker
                    key={rider.id}
                    width={32}
                    anchor={[rider.location.lat, rider.location.lng]}
                    color={rider.vehicleType === "bike" ? "#10B981" : "#F59E0B"}
                    onClick={() => handleRiderSelect(rider)}
                  />
                ))}

                {/* Destination Marker (if set) */}
                {destination && (
                  <Marker
                    width={32}
                    anchor={[destination.lat, destination.lng]}
                    color="#EC4899"
                  />
                )}

                <ZoomControl />
              </Map>

              {/* Bottom Sheet for Rider List */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl sm:rounded-t-3xl shadow-2xl z-10 overflow-hidden"
                initial={{ y: "70%" }}
                animate={bottomSheetControls}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 300,
                }}
              >
                <div className="px-4 sm:px-6 py-3 sm:py-4">
                  <div
                    className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3 sm:mb-4"
                    onClick={() => setExpandedRiderList(!expandedRiderList)}
                  ></div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-secondary">
                      Available Riders
                    </h3>
                    <button
                      onClick={() => setExpandedRiderList(!expandedRiderList)}
                      className="p-2 text-gray-medium hover:text-primary"
                    >
                      {expandedRiderList ? <FiChevronDown /> : <FiChevronUp />}
                    </button>
                  </div>
                </div>

                <div className="px-3 sm:px-4 pb-6 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                  {riders.map((rider) => (
                    <RiderCard
                      key={rider.id}
                      rider={rider}
                      isSelected={selectedRider?.id === rider.id}
                      isFavorite={isRiderFavorite(rider.id)}
                      onSelect={handleRiderSelect}
                      onToggleFavorite={toggleFavoriteRider}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Holler Options Modal */}
              <AnimatePresence>
                {showHollerOptions && selectedRider && (
                  <div className="absolute inset-x-2 sm:inset-x-4 bottom-[30%] sm:bottom-[35%] z-20">
                    <HollerModal
                      rider={selectedRider}
                      onClose={() => setShowHollerOptions(false)}
                      onHoller={handleHoller}
                    />
                  </div>
                )}
              </AnimatePresence>

              {/* Create Errand Button */}
              {!showHollerOptions && !rideInProgress && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExpandedRiderList(true)}
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full font-medium shadow-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors text-sm sm:text-base"
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Holler for Pickup</span>
                </motion.button>
              )}
            </div>
          ) : (
            <div className="h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] flex items-center justify-center">
              <div className="text-center">
                <FiMapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-medium mx-auto mb-4" />
                <p className="text-gray-medium">
                  Enable location services to view the map
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-4 sm:mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <RiMotorbikeFill className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-medium">
                  Available Riders
                </p>
                <p className="text-xl sm:text-2xl font-bold text-secondary">
                  {riders.filter((r) => r.isOnline).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FiPackage className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-medium">
                  Completed Rides
                </p>
                <p className="text-xl sm:text-2xl font-bold text-secondary">
                  {user?.completedRides || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FiStar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-medium">
                  Peekop Points
                </p>
                <p className="text-xl sm:text-2xl font-bold text-secondary">
                  {user?.points || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
