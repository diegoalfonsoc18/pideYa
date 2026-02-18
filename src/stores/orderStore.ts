import { create } from 'zustand';
import { Order, VehicleType } from '@/types/database.types';

interface NewOrderDraft {
  vehicleType: VehicleType | null;
  originAddress: string;
  originReference: string;
  destinationAddress: string;
  destinationReference: string;
  packageDescription: string;
  estimatedKm: number | null;
  estimatedPrice: number | null;
}

interface OrderState {
  draft: NewOrderDraft;
  activeOrder: Order | null;
  orderHistory: Order[];
  isLoading: boolean;
  updateDraft: (updates: Partial<NewOrderDraft>) => void;
  resetDraft: () => void;
  setActiveOrder: (order: Order | null) => void;
  setOrderHistory: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
}

const initialDraft: NewOrderDraft = {
  vehicleType: null,
  originAddress: '',
  originReference: '',
  destinationAddress: '',
  destinationReference: '',
  packageDescription: '',
  estimatedKm: null,
  estimatedPrice: null,
};

export const useOrderStore = create<OrderState>((set) => ({
  draft: initialDraft,
  activeOrder: null,
  orderHistory: [],
  isLoading: false,

  updateDraft: (updates) =>
    set((state) => ({ draft: { ...state.draft, ...updates } })),

  resetDraft: () => set({ draft: initialDraft }),

  setActiveOrder: (order) => set({ activeOrder: order }),

  setOrderHistory: (orders) => set({ orderHistory: orders }),

  setLoading: (isLoading) => set({ isLoading }),
}));
