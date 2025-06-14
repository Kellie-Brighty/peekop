import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiDownload,
  FiUpload,
  FiStar,
  FiCheck,
  FiX,
  FiMenu,
  FiHome,
  FiBarChart,
  FiLogOut,
} from "react-icons/fi";
import { RiMotorbikeFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Rider } from "../../types";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
}

interface RiderFormData {
  name: string;
  email: string;
  phone: string;
  vehicleType: "bike" | "tricycle";
  vehicleNumber: string;
  location: string;
  specialization: string;
  biography: string;
  photo: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "riders" | "users" | "analytics"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Riders management
  const [riders, setRiders] = useState<Rider[]>([]);
  const [showAddRiderModal, setShowAddRiderModal] = useState(false);
  const [showEditRiderModal, setShowEditRiderModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "online" | "offline"
  >("all");
  const [filterVehicle, setFilterVehicle] = useState<
    "all" | "bike" | "tricycle"
  >("all");

  // Form state
  const [riderForm, setRiderForm] = useState<RiderFormData>({
    name: "",
    email: "",
    phone: "",
    vehicleType: "bike",
    vehicleNumber: "",
    location: "",
    specialization: "",
    biography: "",
    photo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState<Rider | null>(null);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem("adminUser");
    if (userData) {
      setAdminUser(JSON.parse(userData));
    } else {
      // Redirect to admin login if not authenticated
      navigate("/admin/login");
      return;
    }

    // Load riders data
    loadRiders();
  }, [navigate]);

  const loadRiders = () => {
    // In a real app, this would fetch from API
    const mockRiders: Rider[] = [
      {
        id: 1,
        name: "Michael Johnson",
        email: "michael.j@peekop.com",
        phone: "+234 801 234 5678",
        photo:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        rating: 4.8,
        completedRides: 245,
        vehicleType: "bike",
        vehicleNumber: "ABC-123-XY",
        isOnline: true,
        distance: "0.5km",
        eta: 3,
        location: { lat: 6.5244, lng: 3.3792 },
        specialization: "food delivery",
        biography: "Experienced rider, always on time and reliable.",
        joinedDate: "2023-01-15",
      },
      {
        id: 2,
        name: "Sarah Williams",
        email: "sarah.w@peekop.com",
        phone: "+234 802 345 6789",
        photo:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        rating: 4.9,
        completedRides: 189,
        vehicleType: "tricycle",
        vehicleNumber: "DEF-456-ZW",
        isOnline: false,
        distance: "1.2km",
        eta: 7,
        location: { lat: 6.5344, lng: 3.3892 },
        specialization: "package delivery",
        biography: "Friendly service with a smile. I know the city inside out!",
        joinedDate: "2023-02-20",
      },
    ];
    setRiders(mockRiders);
  };

  const handleAddRider = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate random credentials
      const password = generateRandomPassword();
      const newRider: Rider = {
        id: Date.now(),
        name: riderForm.name,
        email: riderForm.email,
        phone: riderForm.phone,
        photo:
          riderForm.photo ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            riderForm.name
          )}&background=3B82F6&color=fff`,
        rating: 5.0,
        completedRides: 0,
        vehicleType: riderForm.vehicleType,
        vehicleNumber: riderForm.vehicleNumber,
        isOnline: false,
        distance: "0km",
        eta: 0,
        location: { lat: 6.5244, lng: 3.3792 },
        specialization: riderForm.specialization,
        biography: riderForm.biography,
        joinedDate: new Date().toISOString().split("T")[0],
      };

      // Add to riders list
      setRiders([...riders, newRider]);

      // Send credentials via email/SMS (simulate)
      await sendRiderCredentials(newRider, password);

      // Reset form and close modal
      resetForm();
      setShowAddRiderModal(false);

      alert(
        `Rider ${newRider.name} has been added successfully! Credentials have been sent to their email and phone.`
      );
    } catch (error) {
      alert("Error adding rider. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRider) return;

    setIsSubmitting(true);

    try {
      const updatedRider: Rider = {
        ...selectedRider,
        name: riderForm.name,
        email: riderForm.email,
        phone: riderForm.phone,
        vehicleType: riderForm.vehicleType,
        vehicleNumber: riderForm.vehicleNumber,
        specialization: riderForm.specialization,
        biography: riderForm.biography,
        photo: riderForm.photo || selectedRider.photo,
      };

      setRiders(
        riders.map((r) => (r.id === selectedRider.id ? updatedRider : r))
      );

      resetForm();
      setShowEditRiderModal(false);
      setSelectedRider(null);

      alert(`Rider ${updatedRider.name} has been updated successfully!`);
    } catch (error) {
      alert("Error updating rider. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRider = (rider: Rider) => {
    setRiderToDelete(rider);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRider = () => {
    if (riderToDelete) {
      setRiders(riders.filter((r) => r.id !== riderToDelete.id));
      setShowDeleteConfirm(false);
      setRiderToDelete(null);
      alert(`Rider ${riderToDelete.name} has been removed from the platform.`);
    }
  };

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const sendRiderCredentials = async (rider: Rider, password: string) => {
    // Simulate sending credentials via email/SMS
    console.log(`Sending credentials to ${rider.name}:`);
    console.log(`Email: ${rider.email}`);
    console.log(`Phone: ${rider.phone}`);
    console.log(`Password: ${password}`);

    // In a real app, this would call your email/SMS service
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const resetForm = () => {
    setRiderForm({
      name: "",
      email: "",
      phone: "",
      vehicleType: "bike",
      vehicleNumber: "",
      location: "",
      specialization: "",
      biography: "",
      photo: "",
    });
  };

  const openEditModal = (rider: Rider) => {
    setSelectedRider(rider);
    setRiderForm({
      name: rider.name,
      email: rider.email,
      phone: rider.phone,
      vehicleType: rider.vehicleType,
      vehicleNumber: rider.vehicleNumber,
      location: "",
      specialization: rider.specialization ?? "",
      biography: rider.biography ?? "",
      photo: rider.photo,
    });
    setShowEditRiderModal(true);
  };

  const filteredRiders = riders.filter((rider) => {
    const matchesSearch =
      rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phone.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "online" && rider.isOnline) ||
      (filterStatus === "offline" && !rider.isOnline);

    const matchesVehicle =
      filterVehicle === "all" || rider.vehicleType === filterVehicle;

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const renderSidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <h1 className="text-xl font-bold text-primary">Peekop Admin</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-6">
        <div className="px-6 mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-medium">
                {adminUser?.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{adminUser?.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {adminUser?.role.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1 px-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              activeTab === "dashboard"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiHome className="mr-3 w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("riders")}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              activeTab === "riders"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <RiMotorbikeFill className="mr-3 w-5 h-5" />
            Riders
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              activeTab === "users"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiUsers className="mr-3 w-5 h-5" />
            Users
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              activeTab === "analytics"
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiBarChart className="mr-3 w-5 h-5" />
            Analytics
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg"
          >
            <FiLogOut className="mr-3 w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <RiMotorbikeFill className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Riders</p>
              <p className="text-2xl font-bold">{riders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Online Riders</p>
              <p className="text-2xl font-bold">
                {riders.filter((r) => r.isOnline).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiBarChart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Rides</p>
              <p className="text-2xl font-bold">5,678</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <FiPlus className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm">New rider Michael Johnson added</span>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <FiEdit3 className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm">
                Rider Sarah Williams updated profile
              </span>
            </div>
            <span className="text-xs text-gray-500">4 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRiderForm = (isEdit = false) => (
    <form
      onSubmit={isEdit ? handleEditRider : handleAddRider}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={riderForm.name}
            onChange={(e) =>
              setRiderForm({ ...riderForm, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={riderForm.email}
            onChange={(e) =>
              setRiderForm({ ...riderForm, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={riderForm.phone}
            onChange={(e) =>
              setRiderForm({ ...riderForm, phone: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type *
          </label>
          <select
            value={riderForm.vehicleType}
            onChange={(e) =>
              setRiderForm({
                ...riderForm,
                vehicleType: e.target.value as "bike" | "tricycle",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          >
            <option value="bike">Motorcycle</option>
            <option value="tricycle">Tricycle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Number *
          </label>
          <input
            type="text"
            value={riderForm.vehicleNumber}
            onChange={(e) =>
              setRiderForm({ ...riderForm, vehicleNumber: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., ABC-123-XY"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization
          </label>
          <input
            type="text"
            value={riderForm.specialization}
            onChange={(e) =>
              setRiderForm({ ...riderForm, specialization: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., food delivery, package delivery"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo URL
        </label>
        <input
          type="url"
          value={riderForm.photo}
          onChange={(e) =>
            setRiderForm({ ...riderForm, photo: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Biography
        </label>
        <textarea
          value={riderForm.biography}
          onChange={(e) =>
            setRiderForm({ ...riderForm, biography: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
          placeholder="Brief description about the rider..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowAddRiderModal(false);
            setShowEditRiderModal(false);
            setSelectedRider(null);
          }}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {isEdit ? "Updating..." : "Adding..."}
            </>
          ) : isEdit ? (
            "Update Rider"
          ) : (
            "Add Rider"
          )}
        </button>
      </div>
    </form>
  );

  const renderRiders = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Riders Management</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              const csvContent =
                "name,email,phone,vehicleType,vehicleNumber,specialization,biography\nJohn Doe,john@example.com,+234123456789,bike,ABC-123-XY,food delivery,Experienced rider\nJane Smith,jane@example.com,+234987654321,tricycle,DEF-456-ZW,package delivery,Reliable and fast";
              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "rider_template.csv";
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center text-sm"
          >
            <FiDownload className="mr-2 w-4 h-4" />
            Download Template
          </button>
          <label className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 flex items-center cursor-pointer text-sm">
            <FiUpload className="mr-2 w-4 h-4" />
            Bulk Upload CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  alert(
                    "CSV upload functionality would be implemented here. File: " +
                      file.name
                  );
                }
              }}
            />
          </label>
          <button
            onClick={() => setShowAddRiderModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center text-sm"
          >
            <FiPlus className="mr-2 w-4 h-4" />
            Add New Rider
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search riders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "online" | "offline")
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          <select
            value={filterVehicle}
            onChange={(e) =>
              setFilterVehicle(e.target.value as "all" | "bike" | "tricycle")
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Vehicles</option>
            <option value="bike">Motorcycles</option>
            <option value="tricycle">Tricycles</option>
          </select>

          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center">
            <FiDownload className="mr-2 w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Riders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRiders.map((rider) => (
                <tr key={rider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={rider.photo}
                        alt={rider.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rider.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rider.completedRides} rides
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{rider.email}</div>
                    <div className="text-sm text-gray-500">{rider.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <RiMotorbikeFill
                        className={`w-4 h-4 mr-2 ${
                          rider.vehicleType === "bike"
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      />
                      <div>
                        <div className="text-sm text-gray-900 capitalize">
                          {rider.vehicleType}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rider.vehicleNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rider.isOnline
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rider.isOnline ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {rider.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(rider)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRider(rider)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRiders.length === 0 && (
          <div className="text-center py-12">
            <RiMotorbikeFill className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No riders found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex w-screen">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold capitalize">
                {activeTab === "dashboard" ? "Dashboard" : activeTab}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                Welcome back, {adminUser?.name}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "riders" && renderRiders()}
          {activeTab === "users" && (
            <div className="text-center py-12">
              <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Users management coming soon...</p>
            </div>
          )}
          {activeTab === "analytics" && (
            <div className="text-center py-12">
              <FiBarChart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Analytics dashboard coming soon...
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Add Rider Modal */}
      <AnimatePresence>
        {showAddRiderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Add New Rider</h3>
                {renderRiderForm()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Rider Modal */}
      <AnimatePresence>
        {showEditRiderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Rider</h3>
                {renderRiderForm(true)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && riderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove{" "}
                  <strong>{riderToDelete.name}</strong> from the platform? This
                  action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteRider}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Rider
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
