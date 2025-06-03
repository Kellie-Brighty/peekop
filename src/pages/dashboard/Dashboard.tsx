import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  FiMapPin,
  FiPlus,
  FiCrosshair,
  FiPackage,
  FiChevronUp,
  FiChevronDown,
  FiStar,
  FiUser,
  FiNavigation2,
  FiX,
  FiClock,
  FiCheck,
  FiMail,
  FiDollarSign,
  FiPhone,
  FiLogOut,
  FiMessageSquare,
} from "react-icons/fi";
import { RiMotorbikeFill } from "react-icons/ri";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { useNavigate } from "react-router-dom";
import RiderCard from "../../components/features/RiderCard";
import UserProfile from "../../components/features/UserProfile";
import HollerModal from "../../components/features/HollerModal";
import ErrandForm, {
  ErrandDetails,
} from "../../components/features/ErrandForm";
import RiderProfile from "../../components/features/RiderProfile";
import { User, Rider, Location } from "../../types";

type ServiceMode = "pickup" | "errand";

// Add interface for bids
interface Bid {
  id: number;
  riderId: number;
  riderName: string;
  riderPhoto: string;
  riderRating: number;
  orderId: number;
  amount: number;
  note: string;
  timestamp: string;
  estimatedTime: number;
}

// Add interface for marketplace orders with bid support
interface MarketplaceOrder {
  id: number;
  type: ServiceMode;
  note?: string;
  status: "pending" | "bidding" | "accepted" | "completed";
  createdAt: string;
  rider?: Rider;
  user: User | null;
  pickupLocation: Location | null;
  destination?: Location | null;
  details?: ErrandDetails;
  bids: Bid[];
}

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
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [rideInProgress, setRideInProgress] = useState(false);
  const [riderArriving, setRiderArriving] = useState(false);
  const [serviceMode, setServiceMode] = useState<ServiceMode>("pickup");
  const [showErrandForm, setShowErrandForm] = useState(false);
  const bottomSheetControls = useAnimation();
  const mapRef = useRef(null);
  const [showRiderProfile, setShowRiderProfile] = useState(false);
  const [orderType, setOrderType] = useState<"marketplace" | "direct">(
    "direct"
  );
  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<MarketplaceOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [showChatSession, setShowChatSession] = useState(false);
  const [currentChatRider, setCurrentChatRider] = useState<Rider | null>(null);
  const [currentChatOrder, setCurrentChatOrder] = useState<any | null>(null);

  // Add new state for bottom tab navigation
  const [activeTab, setActiveTab] = useState<
    "home" | "orders" | "chat" | "account"
  >("home");

  // Add new state for bidding system
  const [showBidListModal, setShowBidListModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(
    null
  );
  const [showBidConfirmation, setShowBidConfirmation] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [hasPendingBids, setHasPendingBids] = useState(false);

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
      "Charles Thompson",
      "Isabella Garcia",
      "Daniel Rodriguez",
      "Ava Robinson",
    ];

    const biographies = [
      "Experienced rider, always on time and reliable.",
      "Friendly service with a smile. I know the city inside out!",
      "Safety first! I take pride in my excellent driving record.",
      "Quick and efficient service guaranteed. Let me help you today!",
      "Professional rider with 3+ years of experience in city deliveries.",
      "Former courier with extensive knowledge of local shortcuts.",
      "Careful and considerate rider, your packages are safe with me.",
      "Top-rated rider for 3 consecutive months. I aim to please!",
    ];

    const specializations = [
      "food delivery",
      "express delivery",
      "fragile items",
      "long distance",
      "bulk orders",
      "medical supplies",
      "grocery shopping",
      "electronics",
    ];

    const mockRiders = Array.from({ length: 12 }, (_, i) => {
      // Create more varied locations - some closer, some further
      const distance = Math.random() * 0.02;
      const angle = Math.random() * Math.PI * 2;
      const location = {
        lat: center.lat + Math.cos(angle) * distance,
        lng: center.lng + Math.sin(angle) * distance,
      };

      // Calculate mock distance and ETA based on random location
      const distanceKm = calculateDistance(center, location);
      const eta = Math.max(
        2,
        Math.floor(distanceKm * 10) + Math.floor(Math.random() * 5)
      );

      // Determine vehicle type with proper distribution
      const vehicleType = vehicleTypes[Math.random() > 0.6 ? 1 : 0];

      // Create randomized but realistic rating
      const baseRating = 4.0 + Math.random() * 1.0;
      const rating = Math.round(baseRating * 10) / 10;

      // Generate varied completion counts based on experience
      const experienceLevel = Math.random();
      let completedRides;

      if (experienceLevel > 0.8) {
        // Veteran
        completedRides = 300 + Math.floor(Math.random() * 700);
      } else if (experienceLevel > 0.5) {
        // Experienced
        completedRides = 100 + Math.floor(Math.random() * 200);
      } else if (experienceLevel > 0.2) {
        // Moderate
        completedRides = 30 + Math.floor(Math.random() * 70);
      } else {
        // Novice
        completedRides = Math.floor(Math.random() * 30);
      }

      // More varied availability
      const isOnline = Math.random() > 0.2;

      // Generate specialized data
      const specialization =
        specializations[Math.floor(Math.random() * specializations.length)];
      const biography =
        biographies[Math.floor(Math.random() * biographies.length)];

      return {
        id: i + 1,
        name: names[i % names.length],
        photo: `https://randomuser.me/api/portraits/${
          i % 2 ? "men" : "women"
        }/${(i % 12) + 1}.jpg`,
        rating: rating,
        vehicleType: vehicleType,
        eta: eta,
        distance:
          distanceKm < 1
            ? `${(distanceKm * 1000).toFixed(0)}m`
            : `${distanceKm.toFixed(1)}km`,
        location: location,
        isOnline: isOnline,
        completedRides: completedRides,
        specialization: specialization,
        biography: biography,
        languages: Math.random() > 0.5 ? ["English", "Spanish"] : ["English"],
        joinedDate: new Date(
          Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
        )
          .toISOString()
          .split("T")[0],
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
    setExpandedRiderList(false);
  };

  const handleHoller = (note: string = "") => {
    if (orderType === "direct" && !selectedRider) {
      alert("Please select a rider first!");
      return;
    }

    // Create order details with bid support for marketplace orders
    const orderDetails: MarketplaceOrder = {
      id: Math.floor(Math.random() * 1000) + 1,
      type: serviceMode,
      note,
      status: orderType === "direct" ? "accepted" : "bidding",
      createdAt: new Date().toISOString(),
      rider: selectedRider ?? undefined,
      user: user,
      pickupLocation: userLocation,
      destination: destination,
      bids: [],
    };

    if (orderType === "direct") {
      // Direct order to specific rider
      alert(
        `Hollered at ${selectedRider?.name}! They'll be with you in ${selectedRider?.eta} minutes.`
      );
      setShowHollerOptions(false);

      // Add to active orders
      setActiveOrders([...activeOrders, orderDetails]);

      // Create chat session with rider
      setCurrentChatRider(selectedRider);

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
            setShowChatSession(true);

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
      // Marketplace order with bidding system
      alert(
        `Your ${serviceMode} request has been added to the marketplace. Riders will now be able to place bids.`
      );
      setShowHollerOptions(false);

      // Add to pending orders
      setPendingOrders([...pendingOrders, orderDetails]);

      // Simulate riders placing bids
      simulateRiderBids(orderDetails.id);
    }
  };

  const handleCreateErrand = (errandDetails: ErrandDetails) => {
    // Simulate errand creation
    setShowErrandForm(false);

    // Create order details
    const orderDetails: MarketplaceOrder = {
      id: Math.floor(Math.random() * 1000) + 1,
      type: "errand",
      details: errandDetails,
      status: orderType === "direct" ? "accepted" : "bidding",
      createdAt: new Date().toISOString(),
      rider: selectedRider ?? undefined,
      user: user,
      pickupLocation: userLocation,
      bids: [],
    };

    if (orderType === "direct") {
      // Direct order to specific rider
      setTimeout(() => {
        setRiderArriving(true);
        setCurrentChatRider(selectedRider);
        setShowChatSession(true);

        // After some time, set ride in progress
        setTimeout(() => {
          setRiderArriving(false);
          setRideInProgress(true);

          // Mock errand completion
          setTimeout(() => {
            setRideInProgress(false);

            // Update user points
            if (user) {
              const updatedUser = {
                ...user,
                points: (user.points || 0) + 50, // More points for errands
                completedRides: (user.completedRides || 0) + 1,
              };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }
          }, 15000);
        }, 5000);
      }, 8000);

      // Add to active orders
      setActiveOrders([...activeOrders, orderDetails]);
    } else {
      // Marketplace order with bidding
      alert(
        `Your errand request has been added to the marketplace. Riders will now be able to place bids.`
      );

      // Add to pending orders
      setPendingOrders([...pendingOrders, orderDetails]);

      // Simulate riders placing bids
      simulateRiderBids(orderDetails.id);
    }
  };

  // Add method to simulate rider bids
  const simulateRiderBids = (orderId: number) => {
    // Generate 2-5 random bids over the course of 15 seconds
    const bidCount = Math.floor(Math.random() * 4) + 2;

    // Time interval between bids (ms)
    const interval = 15000 / bidCount;

    // Generate and add bids
    for (let i = 0; i < bidCount; i++) {
      setTimeout(() => {
        // Pick a random rider
        const randomRider = riders[Math.floor(Math.random() * riders.length)];

        // Generate a random bid amount (500-2000 Naira)
        const baseAmount = 500;
        const variance = Math.floor(Math.random() * 1500);

        // Create the bid
        const newBid: Bid = {
          id: Date.now() + i,
          riderId: randomRider.id,
          riderName: randomRider.name,
          riderPhoto: randomRider.photo,
          riderRating: randomRider.rating,
          orderId: orderId,
          amount: baseAmount + variance,
          note: getRandomBidNote(),
          timestamp: new Date().toISOString(),
          estimatedTime: 5 + Math.floor(Math.random() * 20), // 5-25 minutes
        };

        // Update the pending order with the new bid
        setPendingOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, bids: [...order.bids, newBid] }
              : order
          )
        );

        // Update UI to show new bids are available
        setHasPendingBids(true);
      }, interval * i);
    }
  };

  // Helper for random bid notes
  const getRandomBidNote = () => {
    const notes = [
      "I'm nearby and can get there quickly!",
      "I know this area very well.",
      "I can handle this right away.",
      "I'm available and ready to help.",
      "I have experience with similar errands.",
      "I can complete this efficiently.",
      "",
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  };

  // Handle accepting a bid
  const handleAcceptBid = (bid: Bid) => {
    setSelectedBid(bid);
    setShowBidConfirmation(true);
  };

  // Confirm bid acceptance
  const confirmBidAcceptance = () => {
    if (!selectedBid || !selectedOrder) return;

    // Find the rider who made the bid
    const bidRider = riders.find((r) => r.id === selectedBid.riderId);
    if (!bidRider) return;

    // Close modals
    setShowBidConfirmation(false);
    setShowBidListModal(false);

    // Set selected rider
    setSelectedRider(bidRider);

    // Remove from pending orders
    setPendingOrders(
      pendingOrders.filter((order) => order.id !== selectedOrder.id)
    );

    // Add to active orders with accepted status
    const acceptedOrder = {
      ...selectedOrder,
      status: "accepted",
      rider: bidRider,
      fare: selectedBid.amount,
    };
    setActiveOrders([...activeOrders, acceptedOrder]);

    // Create chat session
    setCurrentChatRider(bidRider);
    setShowChatSession(true);

    // Notify user
    alert(
      `You've accepted ${bidRider.name}'s bid of ₦${selectedBid.amount}. They will arrive in approximately ${selectedBid.estimatedTime} minutes.`
    );

    // Simulate rider arriving
    setRiderArriving(true);
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
            points:
              (user.points || 0) + (selectedOrder.type === "errand" ? 50 : 25),
            completedRides: (user.completedRides || 0) + 1,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }, 10000);
    }, 5000);
  };

  // Cancel bid confirmation
  const cancelBidConfirmation = () => {
    setShowBidConfirmation(false);
    setSelectedBid(null);
  };

  // Open bid list modal for an order
  const openBidListModal = (order: MarketplaceOrder) => {
    setSelectedOrder(order);
    setShowBidListModal(true);
  };

  // Render bid list modal
  const renderBidListModal = () => {
    if (!selectedOrder) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-secondary">Rider Bids</h3>
            <button
              onClick={() => setShowBidListModal(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {selectedOrder.type === "pickup" ? "Pickup" : "Errand"} Request •{" "}
              {new Date(selectedOrder.createdAt).toLocaleTimeString()}
            </p>
            {selectedOrder.note && (
              <p className="mt-2 bg-gray-50 p-2 rounded text-sm">
                {selectedOrder.note}
              </p>
            )}
          </div>

          {selectedOrder.bids.length === 0 ? (
            <div className="text-center py-6">
              <FiClock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No bids yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Riders will place bids shortly
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedOrder.bids
                .sort((a, b) => a.amount - b.amount) // Sort by lowest price first
                .map((bid) => (
                  <div
                    key={bid.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <img
                          src={bid.riderPhoto}
                          alt={bid.riderName}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">{bid.riderName}</p>
                          <div className="flex items-center">
                            <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                            <span className="text-xs">
                              {bid.riderRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ₦{bid.amount}
                        </div>
                        <div className="text-xs text-gray-500">
                          {bid.estimatedTime} mins
                        </div>
                      </div>
                    </div>

                    {bid.note && (
                      <div className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
                        {bid.note}
                      </div>
                    )}

                    <button
                      onClick={() => handleAcceptBid(bid)}
                      className="w-full py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                    >
                      Accept Bid
                    </button>
                  </div>
                ))}
            </div>
          )}

          <button
            onClick={() => setShowBidListModal(false)}
            className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  };

  // Render bid confirmation modal
  const renderBidConfirmationModal = () => {
    if (!selectedBid || !selectedOrder) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">
              Confirm Bid Selection
            </h3>
            <p className="text-gray-600">
              You're about to accept a bid from {selectedBid.riderName} for ₦
              {selectedBid.amount}.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center mb-3">
              <img
                src={selectedBid.riderPhoto}
                alt={selectedBid.riderName}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <div className="font-medium">{selectedBid.riderName}</div>
                <div className="flex items-center">
                  <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                  <span className="text-xs">
                    {selectedBid.riderRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Bid Amount:</span>
              <span className="font-bold text-green-600">
                ₦{selectedBid.amount}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Estimated Time:</span>
              <span>{selectedBid.estimatedTime} mins</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={cancelBidConfirmation}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmBidAcceptance}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render bids notification badge
  const renderBidsNotification = () => {
    // Only show if there are pending bids
    if (!hasPendingBids || pendingOrders.length === 0) return null;

    // Count total bids across all pending orders
    const totalBids = pendingOrders.reduce(
      (total, order) => total + order.bids.length,
      0
    );
    if (totalBids === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white py-2 px-4 rounded-full shadow-lg z-30 flex items-center space-x-2"
      >
        <div className="relative">
          <FiMail className="w-5 h-5 text-primary" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {totalBids}
          </span>
        </div>
        <span className="font-medium text-sm">New bids available!</span>
        <button
          onClick={() => openBidListModal(pendingOrders[0])}
          className="bg-primary text-white text-xs px-2 py-1 rounded-full"
        >
          View
        </button>
      </motion.div>
    );
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

  const openRiderProfile = (rider: Rider) => {
    setSelectedRider(rider);
    setShowRiderProfile(true);
  };

  // const handleCreateMarketplaceOrder = (serviceType: ServiceMode) => {
  //   setServiceMode(serviceType);
  //   setOrderType("marketplace");

  //   if (serviceType === "pickup") {
  //     setShowHollerOptions(true);
  //   } else {
  //     setShowErrandForm(true);
  //   }
  // };

  const renderOrderTypeModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
        <h3 className="text-xl font-bold text-secondary mb-4">Create Order</h3>
        <p className="text-gray-600 mb-6">
          Choose how you want to place your {serviceMode} order:
        </p>

        <div className="space-y-4">
          <button
            onClick={() => {
              setOrderType("marketplace");
              setShowOrderTypeModal(false);
              if (serviceMode === "pickup") {
                setShowHollerOptions(true);
              } else {
                setShowErrandForm(true);
              }
            }}
            className="w-full py-4 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl flex items-center"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <FiPackage className="text-blue-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium">Marketplace Order</h4>
              <p className="text-sm text-gray-600">
                Your order will be available to all nearby riders
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setOrderType("direct");
              setShowOrderTypeModal(false);
              setExpandedRiderList(true);
            }}
            className="w-full py-4 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl flex items-center"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <FiUser className="text-green-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium">Select Specific Rider</h4>
              <p className="text-sm text-gray-600">
                Choose a rider from the available list
              </p>
            </div>
          </button>
        </div>

        <button
          onClick={() => setShowOrderTypeModal(false)}
          className="w-full mt-6 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );

  // Modify the handleCompleteRide function to move an order from active to completed
  const handleCompleteRide = (order: any) => {
    // Remove from active orders
    setActiveOrders(activeOrders.filter((o) => o.id !== order.id));

    // Add to completed orders with completed status and timestamp
    const completedOrder = {
      ...order,
      status: "completed",
      completedAt: new Date().toISOString(),
    };
    setCompletedOrders([completedOrder, ...completedOrders]);

    setRideInProgress(false);

    // Update user points
    if (user) {
      const updatedUser = {
        ...user,
        points: (user.points || 0) + (order.type === "errand" ? 50 : 25),
        completedRides: (user.completedRides || 0) + 1,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const openChatForOrder = (order: any) => {
    setCurrentChatOrder(order);
    const orderRider = order.rider;
    if (orderRider) {
      setCurrentChatRider(orderRider);
      setShowChatSession(true);
    }
  };

  // Render orders section
  const renderOrdersSection = () => {
    if (
      activeOrders.length === 0 &&
      completedOrders.length === 0 &&
      pendingOrders.length === 0
    ) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center mb-4">
          <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            No Orders Yet
          </h3>
          <p className="text-gray-500">
            You haven't placed any orders yet. Create a new order to get
            started.
          </p>
          <button
            onClick={() => {
              setActiveTab("home");
              setShowOrderTypeModal(true);
            }}
            className="mt-4 bg-primary text-white py-2 px-4 rounded-lg"
          >
            Create Order
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Pending Orders with Bids */}
        {pendingOrders.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-secondary">
                Pending Orders
              </h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {pendingOrders.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm p-4 border border-yellow-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        {order.status}
                      </span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full ml-2">
                        {order.type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                  {order.bids.length > 0 ? (
                    <div
                      className="flex items-center justify-between bg-blue-50 p-2 rounded-lg mt-2 cursor-pointer"
                      onClick={() => openBidListModal(order)}
                    >
                      <div className="flex items-center">
                        <FiMail className="text-blue-500 mr-2" />
                        <span className="text-sm font-medium">
                          {order.bids.length} bid
                          {order.bids.length !== 1 ? "s" : ""} available
                        </span>
                      </div>
                      <div className="text-blue-500 text-sm">View Bids →</div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-2 rounded-lg mt-2 text-sm text-gray-500 text-center">
                      Waiting for riders to place bids...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-secondary">
                Active Orders
              </h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {activeOrders.length}
              </span>
            </div>
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm p-4 border border-green-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full ml-2">
                        {order.type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                  {order.rider && (
                    <div className="flex items-center mb-3">
                      <img
                        src={order.rider.photo}
                        alt={order.rider.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{order.rider.name}</p>
                        <div className="flex items-center">
                          <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                          <span className="text-xs">{order.rider.rating}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-sm mb-3">
                    <div className="flex items-center">
                      <FiDollarSign className="text-green-600 mr-1" />
                      <span className="font-medium">
                        ₦
                        {typeof order.fare === "number"
                          ? order.fare.toFixed(2)
                          : order.fare}
                      </span>
                    </div>
                    {order.estimatedTime && (
                      <div className="flex items-center">
                        <FiClock className="text-gray-600 mr-1" />
                        <span>{order.estimatedTime} mins</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openChatForOrder(order)}
                      className="flex-1 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center"
                    >
                      <FiMessageSquare className="mr-1" /> Chat
                    </button>
                    <button
                      onClick={() => handleCompleteRide(order)}
                      className="flex-1 py-2 px-3 bg-green-600 text-white rounded-lg flex items-center justify-center"
                    >
                      <FiCheck className="mr-1" /> Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Orders */}
        {completedOrders.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-secondary">
                Order History
              </h3>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {completedOrders.length}
              </span>
            </div>
            <div className="space-y-3">
              {completedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        Completed
                      </span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full ml-2">
                        {order.type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(
                        order.completedAt || order.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  {order.rider && (
                    <div className="flex items-center mb-3">
                      <img
                        src={order.rider.photo}
                        alt={order.rider.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{order.rider.name}</p>
                        <div className="flex items-center">
                          <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                          <span className="text-xs">{order.rider.rating}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-sm mb-3">
                    <div className="flex items-center">
                      <FiDollarSign className="text-green-600 mr-1" />
                      <span className="font-medium">
                        ₦
                        {typeof order.fare === "number"
                          ? order.fare.toFixed(2)
                          : order.fare}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openChatForOrder(order)}
                    className="w-full py-2 px-3 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center"
                  >
                    <FiMessageSquare className="mr-1" /> View Chat History
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Update the chat session renderer to handle completed orders
  const renderChatSession = () => {
    if (!currentChatRider || !currentChatOrder) return null;

    const isOrderCompleted = currentChatOrder.status === "completed";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-x-2 sm:inset-x-4 bottom-[10%] top-[10%] sm:bottom-[5%] sm:top-[5%] z-30 overflow-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl flex flex-col h-full">
          {/* Chat header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={currentChatRider.photo}
                alt={currentChatRider.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium">{currentChatRider.name}</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                  <span>
                    {currentChatOrder.type === "pickup" ? "Pickup" : "Errand"}
                  </span>
                  {isOrderCompleted && (
                    <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowChatSession(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {/* System message */}
              <div className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 rounded-full px-4 py-1 text-xs">
                  Chat started for your {currentChatOrder.type} order
                  {isOrderCompleted ? " (Completed)" : ""}
                </div>
              </div>

              {/* Rider message */}
              <div className="flex">
                <img
                  src={currentChatRider.photo}
                  alt={currentChatRider.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                  <p className="text-sm">
                    Hi there! I'll be handling your {currentChatOrder.type}{" "}
                    order. I'm on my way to your location.
                  </p>
                  <span className="text-xs text-gray-500">Just now</span>
                </div>
              </div>

              {/* Automated suggestion buttons */}
              {!isOrderCompleted && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm">
                    What's your ETA?
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm">
                    I've changed my location
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm">
                    Thanks!
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chat input - disabled for completed orders */}
          <div className="p-4 border-t">
            {isOrderCompleted ? (
              <div className="bg-gray-100 p-3 rounded-lg text-center text-gray-500 text-sm">
                This chat is no longer active as the order has been completed
              </div>
            ) : (
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="bg-primary text-white rounded-r-full px-4 py-2">
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

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

      {/* Main Dashboard Content Based on Active Tab */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6 pb-24">
        {activeTab === "home" && (
          <>
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
                  {/* Service Mode Toggle */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-white shadow-md rounded-full p-1 flex items-center">
                      <button
                        onClick={() => setServiceMode("pickup")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          serviceMode === "pickup"
                            ? "bg-primary text-white"
                            : "text-gray-500"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <FiNavigation2 className="w-4 h-4" />
                          <span>Pickup</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setServiceMode("errand")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          serviceMode === "errand"
                            ? "bg-primary text-white"
                            : "text-gray-500"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <FiPackage className="w-4 h-4" />
                          <span>Errand</span>
                        </div>
                      </button>
                    </div>
                  </div>

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
                        color={
                          rider.vehicleType === "bike" ? "#10B981" : "#F59E0B"
                        }
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
                          onClick={() =>
                            setExpandedRiderList(!expandedRiderList)
                          }
                          className="p-2 text-gray-medium hover:text-primary"
                        >
                          {expandedRiderList ? (
                            <FiChevronDown />
                          ) : (
                            <FiChevronUp />
                          )}
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
                          onSelect={(rider) => {
                            handleRiderSelect(rider);
                            openRiderProfile(rider);
                          }}
                          onToggleFavorite={toggleFavoriteRider}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Holler Options Modal */}
                  <AnimatePresence>
                    {showHollerOptions &&
                      (orderType === "direct" ? selectedRider : true) && (
                        <div className="absolute inset-x-2 sm:inset-x-4 bottom-[30%] sm:bottom-[35%] z-20">
                          <HollerModal
                            rider={selectedRider ?? undefined}
                            orderType={orderType}
                            onClose={() => setShowHollerOptions(false)}
                            onHoller={handleHoller}
                          />
                        </div>
                      )}
                  </AnimatePresence>

                  {/* Errand Form */}
                  <AnimatePresence>
                    {showErrandForm &&
                      (orderType === "direct"
                        ? selectedRider && userLocation
                        : userLocation) && (
                        <div className="absolute inset-x-2 sm:inset-x-4 bottom-[10%] top-[10%] sm:bottom-[5%] sm:top-[5%] z-20 overflow-auto">
                          <ErrandForm
                            userLocation={userLocation}
                            selectedRider={selectedRider}
                            orderType={orderType}
                            onClose={() => setShowErrandForm(false)}
                            onCreateErrand={handleCreateErrand}
                          />
                        </div>
                      )}
                  </AnimatePresence>

                  {/* Rider Profile Modal */}
                  <AnimatePresence>
                    {showRiderProfile && selectedRider && (
                      <div className="absolute inset-x-2 sm:inset-x-4 bottom-[10%] top-[10%] sm:bottom-[5%] sm:top-[5%] z-20 overflow-auto flex items-center justify-center">
                        <RiderProfile
                          rider={selectedRider}
                          isFavorite={isRiderFavorite(selectedRider.id)}
                          onClose={() => setShowRiderProfile(false)}
                          onHoller={() => {
                            setShowRiderProfile(false);
                            setShowHollerOptions(true);
                          }}
                          onCreateErrand={() => {
                            setShowRiderProfile(false);
                            setShowErrandForm(true);
                          }}
                          onToggleFavorite={toggleFavoriteRider}
                          serviceMode={serviceMode}
                        />
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Order Type Selection Modal */}
                  <AnimatePresence>
                    {showOrderTypeModal && renderOrderTypeModal()}
                  </AnimatePresence>

                  {/* Chat Session */}
                  <AnimatePresence>
                    {showChatSession && renderChatSession()}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] flex items-center justify-center">
                  <div className="text-center">
                    <FiMapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-medium mx-auto mb-4" />
                    <p className="text-gray-medium">
                      Enable location services to view the map
                    </p>
                    <button
                      onClick={getCurrentLocation}
                      className="mt-4 bg-primary text-white py-2 px-4 rounded-lg"
                    >
                      Enable Location
                    </button>
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
          </>
        )}

        {activeTab === "orders" && (
          <div className="mt-4 pb-4">
            <h2 className="text-xl font-bold text-secondary mb-4">My Orders</h2>
            {renderOrdersSection()}
          </div>
        )}

        {activeTab === "chat" && (
          <div className="mt-4 pb-4">
            <h2 className="text-xl font-bold text-secondary mb-4">Messages</h2>

            {activeOrders.length === 0 && completedOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  No Messages Yet
                </h3>
                <p className="text-gray-500">
                  You haven't started any conversations yet. When you place an
                  order, you'll be able to chat with your rider here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...activeOrders, ...completedOrders].map((order) => (
                  <div
                    key={order.id}
                    onClick={() => openChatForOrder(order)}
                    className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      {order.rider && (
                        <img
                          src={order.rider.photo}
                          alt={order.rider.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {order.rider ? order.rider.name : "Unknown Rider"}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>
                            {order.type === "pickup" ? "Pickup" : "Errand"}
                          </span>
                          <span className="mx-1">•</span>
                          <span>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "completed"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status === "completed" ? "Completed" : "Active"}
                      </span>
                      <FiChevronRight className="ml-2 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "account" && (
          <div className="mt-4 pb-4">
            <h2 className="text-xl font-bold text-secondary mb-4">
              My Account
            </h2>
            {user && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <FiUser className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{user.fullName}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                        {user.tier} • {user.points} pts
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FiMail className="w-5 h-5 text-gray-500 mr-3" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FiPhone className="w-5 h-5 text-gray-500 mr-3" />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FiPackage className="w-5 h-5 text-gray-500 mr-3" />
                      <span>Completed Rides: {user.completedRides}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-6 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
                >
                  <FiLogOut className="mr-2" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Always visible Create Errand/Pickup Button - only on home tab */}
      {activeTab === "home" &&
        !showHollerOptions &&
        !showErrandForm &&
        !rideInProgress && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOrderTypeModal(true)}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-primary text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full font-medium shadow-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors text-sm sm:text-base z-30"
          >
            <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>
              {serviceMode === "pickup"
                ? "Holler for Pickup"
                : "Create New Errand"}
            </span>
          </motion.button>
        )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "home" ? "text-primary" : "text-gray-500"
            }`}
          >
            <FiHome className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
            {activeTab === "home" && (
              <div className="absolute bottom-0 w-6 h-1 bg-primary rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "orders" ? "text-primary" : "text-gray-500"
            }`}
          >
            <FiPackage className="w-5 h-5 mb-1" />
            <span className="text-xs">Orders</span>
            {activeTab === "orders" && (
              <div className="absolute bottom-0 w-6 h-1 bg-primary rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "chat" ? "text-primary" : "text-gray-500"
            }`}
          >
            <FiMessageSquare className="w-5 h-5 mb-1" />
            <span className="text-xs">Chat</span>
            {activeTab === "chat" && (
              <div className="absolute bottom-0 w-6 h-1 bg-primary rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "account" ? "text-primary" : "text-gray-500"
            }`}
          >
            <FiUser className="w-5 h-5 mb-1" />
            <span className="text-xs">Account</span>
            {activeTab === "account" && (
              <div className="absolute bottom-0 w-6 h-1 bg-primary rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Add Bid List Modal */}
      <AnimatePresence>
        {showBidListModal && renderBidListModal()}
      </AnimatePresence>

      {/* Add Bid Confirmation Modal */}
      <AnimatePresence>
        {showBidConfirmation && renderBidConfirmationModal()}
      </AnimatePresence>

      {/* Add Bids Notification */}
      {renderBidsNotification()}

      {/* Chat Session */}
      <AnimatePresence>
        {showChatSession && renderChatSession()}
      </AnimatePresence>
    </div>
  );
};

const FiHome = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const FiChevronRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default Dashboard;
