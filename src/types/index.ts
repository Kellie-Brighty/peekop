export interface Location {
  lat: number;
  lng: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  verified: boolean;
  points: number;
  tier: "Bronze" | "Silver" | "Gold";
  favorites?: number[];
  achievements?: string[];
  completedRides?: number;
}

export interface Rider {
  id: number;
  name: string;
  photo: string;
  rating: number;
  vehicleType: "bike" | "tricycle";
  eta: number;
  distance: string;
  location: Location;
  isOnline: boolean;
  completedRides: number;
}

export interface Achievement {
  id: number;
  name: string;
  icon: string;
  unlocked: boolean;
  description?: string;
  points?: number;
}

export interface Errand {
  id: number;
  riderId: number;
  userId: number;
  pickup: Location;
  dropoff?: Location;
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
  completedAt?: string;
  price?: number;
  notes?: string;
}

export interface RideHistory {
  id: number;
  riderName: string;
  riderPhoto: string;
  date: string;
  pickup: string;
  dropoff?: string;
  price: number;
  status: "completed" | "cancelled";
  rating?: number;
}
