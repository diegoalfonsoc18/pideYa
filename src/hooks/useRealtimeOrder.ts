import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/database.types';
import { useOrderStore } from '@/stores/orderStore';

export function useRealtimeOrder(orderId: string | null) {
  const { setActiveOrder } = useOrderStore();

  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setActiveOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, setActiveOrder]);
}
