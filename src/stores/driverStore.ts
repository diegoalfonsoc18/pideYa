import { create } from 'zustand';
import { Order, VehicleType } from '@/types/database.types';

interface DriverState {
  isAvailable: boolean;
  vehicleType: VehicleType | null;
  availableOrders: Order[];
  activeOrder: Order | null;
  tripHistory: Order[];
  isLoading: boolean;
  setAvailability: (available: boolean, vehicleType?: VehicleType) => void;
  setAvailableOrders: (orders: Order[]) => void;
  addAvailableOrder: (order: Order) => void;
  removeAvailableOrder: (orderId: string) => void;
  setActiveOrder: (order: Order | null) => void;
  setTripHistory: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  isAvailable: false,
  vehicleType: null,
  availableOrders: [],
  activeOrder: null,
  tripHistory: [],
  isLoading: false,

  setAvailability: (isAvailable, vehicleType) =>
    set((state) => ({
      isAvailable,
      vehicleType: vehicleType ?? state.vehicleType,
    })),

  setAvailableOrders: (orders) => set({ availableOrders: orders }),

  addAvailableOrder: (order) =>
    set((state) => ({
      availableOrders: [...state.availableOrders, order],
    })),

  removeAvailableOrder: (orderId) =>
    set((state) => ({
      availableOrders: state.availableOrders.filter((o) => o.id !== orderId),
    })),

  setActiveOrder: (order) => set({ activeOrder: order }),

  setTripHistory: (orders) => set({ tripHistory: orders }),

  setLoading: (isLoading) => set({ isLoading }),
}));
