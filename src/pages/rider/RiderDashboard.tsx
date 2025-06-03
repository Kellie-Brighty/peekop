import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDollarSign,
  FiUser,
  FiSettings,
  FiClock,
  FiStar,
  FiCheck,
  FiX,
  FiToggleLeft,
  FiToggleRight,
  FiTruck,
  FiPhone,
  FiMessageSquare,
  FiLogOut,
  FiInfo,
  FiMapPin,
  FiPackage,
  FiHome,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { RiMotorbikeFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Map, Marker, ZoomControl } from "pigeon-maps";

interface Rider {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  verified: boolean;
  rating: number;
  vehicleType: "bike" | "tricycle";
  completedRides: number;
  isOnline: boolean;
  earnings: number;
  joinedDate: string;
}

interface RideRequest {
  id: number;
  customerName: string;
  customerPhoto: string;
  customerRating: number;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  dropoffLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  fare: number;
  distance: string;
  estimatedTime: number;
  requestTime: string;
  serviceType: "pickup" | "errand";
  packageDetails?: {
    size: string;
    isFragile: boolean;
  };
}

// Add new interface for marketplace orders with bidding
interface MarketplaceOrder {
  id: number;
  type: "pickup" | "errand";
  customer: {
    id: number;
    name: string;
    photo: string;
    rating: string;
  };
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  dropoffLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  distance: string;
  estimatedDuration: string;
  notes?: string;
  createdAt: string;
  bidCount: number;
  biddingOpen: boolean;
  // For "errand" type orders
  packageDetails?: {
    size: string;
    weight: string;
    isFragile: boolean;
  };
}

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [rider, setRider] = useState<Rider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [riderLocation, setRiderLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  // const [activeSection, setActiveSection] = useState<
  //   "ride-requests" | "earnings" | "account"
  // >("ride-requests");
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [acceptedRequest, setAcceptedRequest] = useState<RideRequest | null>(
    null
  );
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
  const [recentEarnings, setRecentEarnings] = useState<
    { day: string; amount: number }[]
  >([]);
  const [_ridersNearby, setRidersNearby] = useState<number>(0);
  const [marketplaceOrders, setMarketplaceOrders] = useState<
    MarketplaceOrder[]
  >([]);
  const [currentChat, setCurrentChat] = useState<any | null>(null);
  const [showChatSession, setShowChatSession] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "requests" | "marketplace" | "earnings" | "account"
  >("requests");
  const [mapExpanded, setMapExpanded] = useState(false);

  // Add new state for bidding
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(
    null
  );
  const [bidAmount, setBidAmount] = useState("");
  const [bidNote, setBidNote] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("15");
  const [myBids, setMyBids] = useState<
    { orderId: number; amount: number; status: string }[]
  >([]);

  useEffect(() => {
    // Load rider data
    const riderData = localStorage.getItem("rider");
    if (riderData) {
      const parsedRider = JSON.parse(riderData);
      setRider(parsedRider);
      setIsOnline(parsedRider.isOnline);
    } else {
      navigate("/login", { replace: true });
      return;
    }

    // Get rider location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRiderLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
        generateMockData(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoading(false);
      }
    );
  }, [navigate]);

  useEffect(() => {
    // Generate mock marketplace orders
    if (riderLocation) {
      generateMockMarketplaceOrders();
    }

    // Refresh marketplace orders every 30 seconds
    const intervalId = setInterval(() => {
      if (isOnline && riderLocation) {
        generateMockMarketplaceOrders();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [riderLocation, isOnline]);

  const generateMockData = (lat: number, lng: number) => {
    // Generate mock ride requests
    const mockRequests: RideRequest[] = [
      {
        id: 1,
        customerName: "Sarah Wilson",
        customerPhoto: "https://randomuser.me/api/portraits/women/2.jpg",
        customerRating: 4.8,
        pickupLocation: {
          lat: lat + 0.005,
          lng: lng - 0.003,
          address: "123 Main Street",
        },
        dropoffLocation: {
          lat: lat + 0.01,
          lng: lng + 0.01,
          address: "456 Market Avenue",
        },
        fare: 12.5,
        distance: "1.2km",
        estimatedTime: 8,
        requestTime: new Date().toISOString(),
        serviceType: "pickup",
      },
      {
        id: 2,
        customerName: "David Thompson",
        customerPhoto: "https://randomuser.me/api/portraits/men/4.jpg",
        customerRating: 4.5,
        pickupLocation: {
          lat: lat - 0.002,
          lng: lng + 0.004,
          address: "789 Oak Boulevard",
        },
        dropoffLocation: {
          lat: lat - 0.008,
          lng: lng - 0.003,
          address: "321 Pine Street",
        },
        fare: 18.75,
        distance: "2.4km",
        estimatedTime: 15,
        requestTime: new Date(Date.now() - 5 * 60000).toISOString(),
        serviceType: "errand",
        packageDetails: {
          size: "Medium",
          isFragile: true,
        },
      },
      {
        id: 3,
        customerName: "Emily Rodriguez",
        customerPhoto: "https://randomuser.me/api/portraits/women/6.jpg",
        customerRating: 4.9,
        pickupLocation: {
          lat: lat + 0.007,
          lng: lng + 0.006,
          address: "567 Elm Street",
        },
        dropoffLocation: {
          lat: lat + 0.012,
          lng: lng - 0.005,
          address: "890 Cherry Lane",
        },
        fare: 9.25,
        distance: "0.9km",
        estimatedTime: 6,
        requestTime: new Date(Date.now() - 12 * 60000).toISOString(),
        serviceType: "pickup",
      },
    ];
    setRideRequests(mockRequests);

    // Generate mock earnings data
    const today = new Date();
    const mockEarnings = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      }).format(date);
      return {
        day: dayName,
        amount: Math.random() * 100 + 20,
      };
    });
    setRecentEarnings(mockEarnings.reverse());

    // Set mock nearby riders
    setRidersNearby(Math.floor(Math.random() * 8) + 2);
  };

  const generateMockMarketplaceOrders = () => {
    if (!riderLocation) return;

    // Generate between 1-5 random marketplace orders
    const numOrders = Math.floor(Math.random() * 5) + 1;
    const orders: MarketplaceOrder[] = [];

    const orderTypes: ("pickup" | "errand")[] = ["pickup", "errand"];
    const customerNames = [
      "John Smith",
      "Emma Wilson",
      "Michael Brown",
      "Sophia Davis",
      "James Johnson",
      "Olivia Martinez",
      "Robert Taylor",
      "Ava Anderson",
      "William Thomas",
      "Isabella Jackson",
    ];

    const addresses = [
      "123 Main Street",
      "456 Oak Avenue",
      "789 Pine Boulevard",
      "321 Maple Road",
      "654 Cedar Lane",
      "987 Elm Court",
      "159 Birch Street",
      "753 Spruce Way",
      "264 Willow Drive",
      "873 Ash Circle",
    ];

    for (let i = 0; i < numOrders; i++) {
      const lat = riderLocation.lat + (Math.random() * 0.02 - 0.01); // ~1km radius
      const lng = riderLocation.lng + (Math.random() * 0.02 - 0.01);

      const orderType = orderTypes[Math.floor(Math.random() * 2)];
      const distance = (Math.random() * 5 + 0.5).toFixed(1) + "km";
      const duration = Math.ceil(parseFloat(distance) * 5) + " mins";

      const packageDetails =
        orderType === "errand"
          ? {
              size: ["Small", "Medium", "Large"][Math.floor(Math.random() * 3)],
              weight: ["Light", "Medium", "Heavy"][
                Math.floor(Math.random() * 3)
              ],
              isFragile: Math.random() > 0.7,
            }
          : undefined;

      // Create order with bidding support
      orders.push({
        id: Date.now() + i,
        type: orderType,
        customer: {
          id: i + 1,
          name: customerNames[Math.floor(Math.random() * customerNames.length)],
          photo: `https://randomuser.me/api/portraits/${
            Math.random() > 0.5 ? "men" : "women"
          }/${Math.floor(Math.random() * 10) + 1}.jpg`,
          rating: (4 + Math.random()).toFixed(1),
        },
        pickupLocation: {
          lat,
          lng,
          address: addresses[Math.floor(Math.random() * addresses.length)],
        },
        dropoffLocation:
          orderType === "pickup"
            ? {
                lat: lat + (Math.random() * 0.02 - 0.01),
                lng: lng + (Math.random() * 0.02 - 0.01),
                address:
                  addresses[Math.floor(Math.random() * addresses.length)],
              }
            : undefined,
        distance,
        estimatedDuration: duration,
        notes:
          Math.random() > 0.7
            ? [
                "Please come quickly",
                "Call me when you arrive",
                "Handle with care",
                "Fragile items inside",
              ][Math.floor(Math.random() * 4)]
            : undefined,
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 30 * 60000)
        ).toISOString(),
        bidCount: Math.floor(Math.random() * 5),
        biddingOpen: true,
        packageDetails,
      });
    }

    setMarketplaceOrders(orders);
  };

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    if (rider) {
      const updatedRider = { ...rider, isOnline: !isOnline };
      setRider(updatedRider);
      localStorage.setItem("rider", JSON.stringify(updatedRider));
    }
  };

  const handleAcceptRequest = (request: RideRequest) => {
    setAcceptedRequest(request);

    // Remove from pending requests
    setRideRequests((requests) => requests.filter((r) => r.id !== request.id));

    // Simulate customer confirmation
    setTimeout(() => {
      setAcceptedRequest(null);
      setCurrentRide(request);
    }, 3000);
  };

  const handleDeclineRequest = (requestId: number) => {
    setRideRequests((requests) => requests.filter((r) => r.id !== requestId));
  };

  const handleCompleteRide = () => {
    if (currentRide && rider) {
      // Add fare to earnings
      const updatedRider = {
        ...rider,
        earnings: rider.earnings + currentRide.fare,
        completedRides: rider.completedRides + 1,
      };
      setRider(updatedRider);
      localStorage.setItem("rider", JSON.stringify(updatedRider));

      // Add to today's earnings
      const updatedEarnings = [...recentEarnings];
      updatedEarnings[updatedEarnings.length - 1].amount += currentRide.fare;
      setRecentEarnings(updatedEarnings);

      // Clear current ride
      setCurrentRide(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rider");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accountType");
    navigate("/login", { replace: true });
  };

  const formatTimeDifference = (dateString: string) => {
    const requestTime = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffInMinutes = Math.floor((now - requestTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes === 1) return "1 minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    return `${diffInHours} hours ago`;
  };

  // const renderMapSection = () => {
  //   // Don't render map at all if location isn't available
  //   if (!riderLocation) return null;

  //   // Determine if map should be expanded based on ride status
  //   const shouldExpandMap = mapExpanded || currentRide || acceptedRequest;

  //   return (
  //     <div
  //       className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out ${
  //         shouldExpandMap ? "h-[calc(40vh)]" : "h-[120px]"
  //       }`}
  //     >
  //       <div className="flex justify-between items-center p-2 border-b">
  //         <h3 className="text-sm font-medium text-gray-700">
  //           {currentRide
  //             ? "Active Ride Map"
  //             : acceptedRequest
  //             ? "Accepted Request Map"
  //             : "Location Map"}
  //         </h3>
  //         <button
  //           onClick={() => setMapExpanded(!mapExpanded)}
  //           className="p-1 text-gray-500 hover:bg-gray-100 rounded"
  //         >
  //           {shouldExpandMap ? (
  //             <FiChevronDown className="w-5 h-5" />
  //           ) : (
  //             <FiChevronUp className="w-5 h-5" />
  //           )}
  //         </button>
  //       </div>

  //       {/* Map component */}
  //       <Map
  //         defaultCenter={[riderLocation.lat, riderLocation.lng]}
  //         defaultZoom={14}
  //         attribution={false}
  //       >
  //         {/* Rider Location */}
  //         <Marker
  //           width={40}
  //           anchor={[riderLocation.lat, riderLocation.lng]}
  //           color="#2563EB"
  //         />

  //         {/* Customer pickup locations */}
  //         {rideRequests.map((request) => (
  //           <Marker
  //             key={request.id}
  //             width={30}
  //             anchor={[request.pickupLocation.lat, request.pickupLocation.lng]}
  //             color="#10B981"
  //           />
  //         ))}

  //         {/* Current ride markers */}
  //         {currentRide && (
  //           <>
  //             <Marker
  //               width={35}
  //               anchor={[
  //                 currentRide.pickupLocation.lat,
  //                 currentRide.pickupLocation.lng,
  //               ]}
  //               color="#10B981"
  //             />
  //             {currentRide.dropoffLocation && (
  //               <Marker
  //                 width={35}
  //                 anchor={[
  //                   currentRide.dropoffLocation.lat,
  //                   currentRide.dropoffLocation.lng,
  //                 ]}
  //                 color="#EC4899"
  //               />
  //             )}
  //           </>
  //         )}

  //         <ZoomControl />
  //       </Map>

  //       {/* Show compact info when map is minimized */}
  //       {!shouldExpandMap && (
  //         <div className="absolute inset-0 pt-10 px-3 flex items-center justify-between bg-white/80">
  //           <div className="flex items-center">
  //             <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
  //               <FiMapPin className="text-primary w-4 h-4" />
  //             </div>
  //             <div>
  //               <p className="text-xs text-gray-500">Your Location</p>
  //               <p className="text-sm font-medium">Tracking enabled</p>
  //             </div>
  //           </div>

  //           <button
  //             onClick={() => setMapExpanded(true)}
  //             className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
  //           >
  //             Expand Map
  //           </button>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const renderRideRequestsSection = () => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-secondary mb-3">
          Ride Requests
        </h3>

        {isOnline ? (
          <>
            {acceptedRequest && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-800">
                    Request Accepted!
                  </h4>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                    <span className="text-sm text-blue-800">
                      Waiting for confirmation...
                    </span>
                  </div>
                </div>
                <p className="text-sm text-blue-700">
                  You've accepted {acceptedRequest.customerName}'s{" "}
                  {acceptedRequest.serviceType} request. Please wait for
                  customer confirmation.
                </p>
              </div>
            )}

            {currentRide && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-800">
                    Current{" "}
                    {currentRide.serviceType === "pickup" ? "Ride" : "Errand"}{" "}
                    in Progress
                  </h4>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-1"></div>
                    <span className="text-sm text-green-800">Active</span>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <img
                    src={currentRide.customerPhoto}
                    alt={currentRide.customerName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{currentRide.customerName}</p>
                    <div className="flex items-center">
                      <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                      <span className="text-xs">
                        {currentRide.customerRating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white p-2 rounded">
                    <div className="text-xs text-gray-500">Pickup</div>
                    <div className="text-sm">
                      {currentRide.pickupLocation.address}
                    </div>
                  </div>
                  {currentRide.dropoffLocation && (
                    <div className="bg-white p-2 rounded">
                      <div className="text-xs text-gray-500">Dropoff</div>
                      <div className="text-sm">
                        {currentRide.dropoffLocation.address}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm mb-3">
                  <div className="flex items-center">
                    <FiDollarSign className="text-green-700 mr-1" />
                    <span>₦{currentRide.fare.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center">
                    <FiTruck className="text-gray-700 mr-1" />
                    <span>{currentRide.distance}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="flex-1 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded"
                    onClick={() => setCurrentRide(null)}
                  >
                    <FiPhone className="mr-1" />
                    Call
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded"
                    onClick={() => setCurrentRide(null)}
                  >
                    <FiMessageSquare className="mr-1" />
                    Message
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    onClick={handleCompleteRide}
                  >
                    <FiCheck className="mr-1" />
                    Complete
                  </button>
                </div>
              </div>
            )}

            {!acceptedRequest && !currentRide && rideRequests.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <RiMotorbikeFill className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No ride requests at the moment.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Stay online to receive new requests.
                </p>
              </div>
            )}

            {!acceptedRequest && !currentRide && rideRequests.length > 0 && (
              <div className="space-y-4">
                {rideRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <img
                          src={request.customerPhoto}
                          alt={request.customerName}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">{request.customerName}</p>
                          <div className="flex items-center">
                            <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                            <span className="text-xs">
                              {request.customerRating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimeDifference(request.requestTime)}
                      </div>
                    </div>

                    <div className="flex items-center mb-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {request.serviceType === "pickup" ? "Pickup" : "Errand"}
                      </span>
                      {request.packageDetails && (
                        <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded ml-2">
                          {request.packageDetails.isFragile
                            ? "Fragile"
                            : "Package"}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Pickup</div>
                        <div className="text-sm">
                          {request.pickupLocation.address}
                        </div>
                      </div>
                      {request.dropoffLocation && (
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-xs text-gray-500">Dropoff</div>
                          <div className="text-sm">
                            {request.dropoffLocation.address}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm mb-3">
                      <div className="flex items-center font-medium">
                        <FiDollarSign className="text-green-600 mr-1" />
                        <span>₦{request.fare.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="text-gray-600 mr-1" />
                        <span>{request.estimatedTime} mins</span>
                      </div>
                      <div className="flex items-center">
                        <FiTruck className="text-gray-600 mr-1" />
                        <span>{request.distance}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className="flex-1 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded"
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        <FiX className="mr-1" />
                        Decline
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                        onClick={() => handleAcceptRequest(request)}
                      >
                        <FiCheck className="mr-1" />
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <FiToggleLeft className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">You're currently offline.</p>
            <p className="text-sm text-gray-400 mt-1">
              Go online to receive ride requests.
            </p>
            <button
              className="mt-4 bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-lg"
              onClick={handleToggleOnline}
            >
              Go Online
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderEarningsSection = () => {
    if (!rider) return null;

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-secondary mb-3">Earnings</h3>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-gray-500">Total Earnings</div>
              <div className="text-2xl font-bold text-green-600">
                ₦{rider.earnings.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Completed Rides</div>
              <div className="text-2xl font-bold text-primary">
                {rider.completedRides}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">Last 7 Days</div>
            <div className="flex justify-between items-end h-32">
              {recentEarnings.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-primary/20 rounded-t-sm"
                    style={{ height: `${(day.amount / 100) * 100}px` }}
                  >
                    <div
                      className="w-full bg-primary rounded-t-sm"
                      style={{ height: `${(day.amount / 150) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{day.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="font-medium text-secondary mb-3">
            Recent Transactions
          </h4>

          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between items-center pb-2 border-b border-gray-100"
              >
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <FiDollarSign className="text-primary w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Ride Completion</div>
                    <div className="text-xs text-gray-500">
                      {new Date(
                        Date.now() - index * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-green-600 font-medium">
                  +₦{(Math.random() * 20 + 5).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAccountSection = () => {
    if (!rider) return null;

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-secondary mb-3">Account</h3>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <FiUser className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-medium">{rider.fullName}</h4>
              <div className="flex items-center text-sm text-gray-500">
                <FiStar className="text-yellow-500 w-4 h-4 mr-1" />
                <span>
                  {rider.rating.toFixed(1)} • {rider.completedRides} rides
                </span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full capitalize">
                  {rider.vehicleType} Rider
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{rider.email}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Phone</div>
              <div className="font-medium">{rider.phone}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Joined</div>
              <div className="font-medium">{rider.joinedDate}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Status</div>
              <div className="font-medium flex items-center">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  } mr-1`}
                ></span>
                {isOnline ? "Online" : "Offline"}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FiSettings className="w-5 h-5 text-gray-500 mr-3" />
                <span>Account Settings</span>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FiInfo className="w-5 h-5 text-gray-500 mr-3" />
                <span>Help & Support</span>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <button
              className="w-full flex items-center justify-center mt-4 bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-lg"
              onClick={handleLogout}
            >
              <FiLogOut className="mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleAcceptMarketplaceOrder = (order: MarketplaceOrder) => {
    // Remove from marketplace
    setMarketplaceOrders(marketplaceOrders.filter((o) => o.id !== order.id));

    // Add to accepted requests with status accepted
    const acceptedOrder = {
      ...order,
      id: Math.floor(Math.random() * 1000) + 1,
      customerName: order.customer.name,
      customerPhoto: order.customer.photo,
      customerRating: parseFloat(order.customer.rating),
      pickupLocation: order.pickupLocation,
      dropoffLocation: order.dropoffLocation,
      fare: calculateFare(order.distance), // Calculate fare from distance
      distance: order.distance,
      estimatedTime: Math.ceil(parseFloat(order.distance) * 5), // 5 min per km
      requestTime: order.createdAt,
      serviceType: order.type,
    };

    setRideRequests([acceptedOrder, ...rideRequests]);

    // Show chat
    setCurrentChat(acceptedOrder);
    setShowChatSession(true);

    // Alert user
    alert(
      `You've accepted ${order.customer.name}'s ${order.type} request! You can now chat with them.`
    );
  };

  // Add helper function to calculate fare based on distance
  const calculateFare = (distance: string): number => {
    const distanceValue = parseFloat(distance);
    const baseFare = 500; // Base fare in Naira
    const perKmRate = 200; // Per km rate in Naira
    return Math.round(baseFare + distanceValue * perKmRate);
  };

  const handleOpenChat = (request: any) => {
    setCurrentChat(request);
    setShowChatSession(true);
  };

  // Add new method to open bid modal
  const handleOpenBidModal = (order: MarketplaceOrder) => {
    setSelectedOrder(order);
    // Set default bid amount based on distance
    const distanceValue = parseFloat(order.distance);
    const baseFare = 500; // Base fare in Naira
    const perKmRate = 200; // Per km rate in Naira
    const suggestedBid = Math.round(baseFare + distanceValue * perKmRate);
    setBidAmount(suggestedBid.toString());
    setEstimatedTime(Math.ceil(distanceValue * 5).toString()); // 5 mins per km
    setBidNote("");
    setShowBidModal(true);
  };

  // Add method to place a bid
  const handlePlaceBid = () => {
    if (!selectedOrder || !bidAmount || parseInt(bidAmount) < 100) {
      alert("Please enter a valid bid amount (minimum ₦100)");
      return;
    }

    // Add bid to my bids
    setMyBids([
      ...myBids,
      {
        orderId: selectedOrder.id,
        amount: parseInt(bidAmount),
        status: "pending",
      },
    ]);

    // Update marketplace orders to show bid was placed
    setMarketplaceOrders(
      marketplaceOrders.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, bidCount: order.bidCount + 1 }
          : order
      )
    );

    // Close modal and show confirmation
    setShowBidModal(false);
    alert(
      `Your bid of ₦${bidAmount} has been placed. You'll be notified if the customer accepts.`
    );
  };

  // Add method to render bid modal
  const renderBidModal = () => {
    if (!selectedOrder) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-secondary">Place Your Bid</h3>
            <button
              onClick={() => setShowBidModal(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <img
                src={selectedOrder.customer.photo}
                alt={selectedOrder.customer.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{selectedOrder.customer.name}</p>
                <div className="flex items-center">
                  <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                  <span className="text-xs">
                    {selectedOrder.customer.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Order Type:</span>
                <span className="font-medium">
                  {selectedOrder.type === "pickup" ? "Pickup" : "Errand"}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Distance:</span>
                <span className="font-medium">{selectedOrder.distance}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Other Bids:</span>
                <span className="font-medium">{selectedOrder.bidCount}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Bid Amount (₦)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter amount in Naira"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                min="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Arrival Time (minutes)
              </label>
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="Estimated minutes to arrival"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note to Customer (Optional)
              </label>
              <textarea
                value={bidNote}
                onChange={(e) => setBidNote(e.target.value)}
                placeholder="Add a short message to the customer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowBidModal(false)}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePlaceBid}
              className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Place Bid
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderMarketplaceSection = () => {
    if (!isOnline) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <FiToggleLeft className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">You're currently offline.</p>
          <p className="text-sm text-gray-400 mt-1">
            Go online to view available marketplace orders.
          </p>
          <button
            className="mt-4 bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-lg"
            onClick={handleToggleOnline}
          >
            Go Online
          </button>
        </div>
      );
    }

    if (marketplaceOrders.length === 0 && myBids.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <RiMotorbikeFill className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No marketplace orders available.</p>
          <p className="text-sm text-gray-400 mt-1">
            Check back soon for new orders.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {myBids.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">Your Bids</h4>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {myBids.length} active
              </span>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                You have {myBids.length} pending bid
                {myBids.length !== 1 ? "s" : ""}. You'll be notified if a
                customer accepts your bid.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-700">Available Orders</h4>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {marketplaceOrders.length} orders
          </span>
        </div>

        {marketplaceOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <img
                  src={order.customer.photo}
                  alt={order.customer.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <div className="flex items-center">
                    <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                    <span className="text-xs">{order.customer.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {formatTimeDifference(order.createdAt)}
              </div>
            </div>

            <div className="flex items-center mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {order.type === "pickup" ? "Pickup" : "Errand"}
              </span>
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded ml-2">
                {order.distance}
              </span>
              {order.bidCount > 0 && (
                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded ml-2">
                  {order.bidCount} bid{order.bidCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 mb-3">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Pickup</div>
                <div className="text-sm">{order.pickupLocation.address}</div>
              </div>
              {order.dropoffLocation && (
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-500">Dropoff</div>
                  <div className="text-sm">{order.dropoffLocation.address}</div>
                </div>
              )}
            </div>

            {order.notes && (
              <div className="bg-yellow-50 p-2 rounded text-sm text-yellow-800 mb-3">
                <span className="font-medium">Note:</span> {order.notes}
              </div>
            )}

            {/* Show bid-related UI */}
            <div className="flex space-x-2">
              <button
                className="flex-1 flex items-center justify-center bg-primary hover:bg-primary/90 text-white py-2 rounded"
                onClick={() => handleOpenBidModal(order)}
              >
                <FiDollarSign className="w-4 h-4 mr-1" />
                Place Bid
              </button>

              <button
                className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded"
                onClick={() => handleAcceptMarketplaceOrder(order)}
              >
                <FiCheck className="w-4 h-4 mr-1" />
                Accept Directly
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChatSession = () => {
    if (!currentChat) return null;

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
                src={currentChat.customerPhoto}
                alt={currentChat.customerName}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium">{currentChat.customerName}</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                  <span>
                    {currentChat.customerRating} •{" "}
                    {currentChat.serviceType === "pickup" ? "Pickup" : "Errand"}
                  </span>
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
                  Chat started for this {currentChat.serviceType} order
                </div>
              </div>

              {/* Your message */}
              <div className="flex justify-end">
                <div className="bg-primary text-white p-3 rounded-lg shadow-sm max-w-[80%]">
                  <p className="text-sm">
                    Hi, I've accepted your {currentChat.serviceType} request and
                    I'm on my way to your location.
                  </p>
                  <span className="text-xs text-white/80">Just now</span>
                </div>
              </div>

              {/* Automated suggestion buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm">
                  I'll be there in {currentChat.estimatedTime} mins
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm">
                  I've arrived at your location
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm">
                  Can you provide more details?
                </button>
              </div>
            </div>
          </div>

          {/* Chat input */}
          <div className="p-4 border-t">
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
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 w-screen">
        <div className="text-center">
          <RiMotorbikeFill className="w-12 h-12 text-primary animate-bounce mx-auto mb-4" />
          <p className="text-gray-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative w-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">Peekop Rider</h1>
            <div className="flex items-center">
              <div
                className={`mr-4 px-2 py-1 rounded-full flex items-center ${
                  isOnline
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span className="text-xs mr-1">
                  {isOnline ? "Online" : "Offline"}
                </span>
                {isOnline ? (
                  <FiToggleRight
                    className="w-4 h-4 text-green-600"
                    onClick={handleToggleOnline}
                  />
                ) : (
                  <FiToggleLeft
                    className="w-4 h-4 text-gray-600"
                    onClick={handleToggleOnline}
                  />
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-primary"
              >
                <FiLogOut />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* Map section with toggle */}
        {riderLocation && (
          <div
            className={`${
              mapExpanded ? "h-screen" : "h-48"
            } transition-all duration-300 relative`}
          >
            <Map
              defaultCenter={[riderLocation.lat, riderLocation.lng]}
              defaultZoom={15}
              attribution={false}
              metaWheelZoom={true}
              animate={true}
            >
              {/* Rider Location Marker */}
              <Marker
                width={40}
                anchor={[riderLocation.lat, riderLocation.lng]}
                color="#2563EB"
              />

              {/* Customer Location Markers */}
              {currentRide && (
                <>
                  <Marker
                    width={32}
                    anchor={[
                      currentRide.pickupLocation.lat,
                      currentRide.pickupLocation.lng,
                    ]}
                    color="#10B981"
                  />
                  {currentRide.dropoffLocation && (
                    <Marker
                      width={32}
                      anchor={[
                        currentRide.dropoffLocation.lat,
                        currentRide.dropoffLocation.lng,
                      ]}
                      color="#EC4899"
                    />
                  )}
                </>
              )}

              {/* Marketplace Orders */}
              {isOnline &&
                !currentRide &&
                marketplaceOrders.map((order) => (
                  <Marker
                    key={order.id}
                    width={32}
                    anchor={[
                      order.pickupLocation.lat,
                      order.pickupLocation.lng,
                    ]}
                    color="#F59E0B"
                  />
                ))}

              <ZoomControl />
            </Map>
            {/* Map toggle button */}
            <button
              onClick={() => setMapExpanded(!mapExpanded)}
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md z-10"
            >
              {mapExpanded ? <FiChevronDown /> : <FiChevronUp />}
            </button>
          </div>
        )}

        {/* Main content area */}
        <div className="px-4 py-4">
          {/* Active ride section */}
          {currentRide && (
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <img
                    src={currentRide.customerPhoto}
                    alt={currentRide.customerName}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{currentRide.customerName}</p>
                    <div className="flex items-center">
                      <FiStar className="text-yellow-500 w-3 h-3 mr-1" />
                      <span className="text-xs">
                        {currentRide.customerRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    ₦{currentRide.fare.toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentRide.distance}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg flex items-start">
                  <FiMapPin className="text-green-600 w-5 h-5 mr-2 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Pickup</div>
                    <div className="text-sm font-medium">
                      {currentRide.pickupLocation.address}
                    </div>
                  </div>
                </div>
                {currentRide.dropoffLocation && (
                  <div className="bg-gray-50 p-3 rounded-lg flex items-start">
                    <FiMapPin className="text-pink-600 w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Dropoff</div>
                      <div className="text-sm font-medium">
                        {currentRide.dropoffLocation.address}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mb-4">
                <button
                  className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg flex items-center justify-center"
                  onClick={() => handleOpenChat(currentRide)}
                >
                  <FiMessageSquare className="w-4 h-4 mr-1" />
                  <span>Chat</span>
                </button>
                <button
                  className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg flex items-center justify-center"
                  onClick={() => {
                    window.open(`tel:+1234567890`);
                  }}
                >
                  <FiPhone className="w-4 h-4 mr-1" />
                  <span>Call</span>
                </button>
              </div>

              <button
                className="w-full bg-primary text-white py-3 rounded-lg font-medium"
                onClick={handleCompleteRide}
              >
                Complete Ride
              </button>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "requests" && renderRideRequestsSection()}
          {activeTab === "marketplace" && renderMarketplaceSection()}
          {activeTab === "earnings" && renderEarningsSection()}
          {activeTab === "account" && renderAccountSection()}
        </div>

        {/* Chat Session */}
        <AnimatePresence>
          {showChatSession && renderChatSession()}
        </AnimatePresence>

        {/* Add Bid Modal */}
        <AnimatePresence>{showBidModal && renderBidModal()}</AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "requests" ? "text-primary" : "text-gray-500"
            }`}
          >
            <FiHome className="w-5 h-5 mb-1" />
            <span className="text-xs">Requests</span>
            {activeTab === "requests" && (
              <div className="absolute bottom-0 w-6 h-1 bg-primary rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "marketplace" ? "text-primary" : "text-gray-500"
            }`}
          >
            <FiPackage className="w-5 h-5 mb-1" />
            <span className="text-xs">Marketplace</span>
            {activeTab === "marketplace" && (
              <div className="absolute bottom-0 w-6 h-1 bg-primary rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === "earnings" ? "text-primary" : "text-gray-500"
            }`}
          >
            <FiDollarSign className="w-5 h-5 mb-1" />
            <span className="text-xs">Earnings</span>
            {activeTab === "earnings" && (
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
    </div>
  );
};

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

export default RiderDashboard;
