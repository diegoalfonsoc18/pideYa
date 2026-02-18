import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/database.types';
import { useDriverStore } from '@/stores/driverStore';

export function useRealtimePendingOrders() {
  const { vehicleType, addAvailableOrder, removeAvailableOrder } = useDriverStore();

  useEffect(() => {
    const channel = supabase
      .channel('pending-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const newOrder = payload.new as Order;
          if (newOrder.status === 'pending') {
            if (!vehicleType || newOrder.vehicle_type === vehicleType) {
              addAvailableOrder(newOrder);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          // Si el pedido ya no está pendiente, removerlo de la lista
          if (updatedOrder.status !== 'pending') {
            removeAvailableOrder(updatedOrder.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [vehicleType, addAvailableOrder, removeAvailableOrder]);
}
