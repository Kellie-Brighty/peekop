import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiPlus,
  FiCrosshair,
  FiPackage,
  FiClock,
} from "react-icons/fi";
import { RiMotorbikeFill } from "react-icons/ri";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { useNavigate } from "react-router-dom";

interface Location {
  lat: number;
  lng: number;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  verified: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [riders, setRiders] = useState<Location[]>([]);
  // const [selectedArea, setSelectedArea] = useState<Location | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
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
        // Simulate fetching nearby riders
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
    const mockRiders = Array.from({ length: 8 }, () => ({
      lat: center.lat + (Math.random() - 0.5) * 0.01,
      lng: center.lng + (Math.random() - 0.5) * 0.01,
    }));
    setRiders(mockRiders);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden w-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">Peekop</h1>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-secondary">{user.fullName}</p>
                  <p className="text-sm text-gray-medium">{user.phone}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-medium hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

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

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Map Section */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
              <div className="text-center">
                <RiMotorbikeFill className="w-12 h-12 text-primary animate-bounce mx-auto mb-4" />
                <p className="text-gray-medium">Loading map...</p>
              </div>
            </div>
          ) : userLocation ? (
            <div className="relative h-[calc(100vh-12rem)]">
              <Map
                defaultCenter={[userLocation.lat, userLocation.lng]}
                defaultZoom={15}
                attribution={false}
                metaWheelZoom={true}
                animate={true}
              >
                {/* User Location Marker */}
                <Marker
                  width={50}
                  anchor={[userLocation.lat, userLocation.lng]}
                  color="#2563EB"
                />

                {/* Rider Markers */}
                {riders.map((rider, index) => (
                  <Marker
                    key={index}
                    width={40}
                    anchor={[rider.lat, rider.lng]}
                    color="#10B981"
                  />
                ))}

                <ZoomControl />
              </Map>

              {/* Create Errand Button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-white py-4 px-8 rounded-full font-medium shadow-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                <span>Create New Errand</span>
              </motion.button>
            </div>
          ) : (
            <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
              <div className="text-center">
                <FiMapPin className="w-12 h-12 text-gray-medium mx-auto mb-4" />
                <p className="text-gray-medium">
                  Enable location services to view the map
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <RiMotorbikeFill className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-medium">Available Riders</p>
                <p className="text-2xl font-bold text-secondary">
                  {riders.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-medium">Active Errands</p>
                <p className="text-2xl font-bold text-secondary">0</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-medium">Average Time</p>
                <p className="text-2xl font-bold text-secondary">25 mins</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
