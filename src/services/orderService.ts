import { supabase } from '@/lib/supabase';
import { Order, OrderStatus, VehicleType } from '@/types/database.types';

interface CreateOrderPayload {
  clientId: string;
  vehicleType: VehicleType;
  originAddress: string;
  originReference?: string;
  destinationAddress: string;
  destinationReference?: string;
  packageDescription?: string;
  estimatedDistanceKm: number;
  basePrice: number;
  totalPrice: number;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        client_id: payload.clientId,
        vehicle_type: payload.vehicleType,
        origin_address: payload.originAddress,
        origin_reference: payload.originReference ?? null,
        destination_address: payload.destinationAddress,
        destination_reference: payload.destinationReference ?? null,
        package_description: payload.packageDescription ?? null,
        estimated_distance_km: payload.estimatedDistanceKm,
        base_price: payload.basePrice,
        total_price: payload.totalPrice,
        status: 'pending',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getClientOrders(clientId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, driver:driver_id(full_name, phone)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getPendingOrders(vehicleType?: VehicleType): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select('*, client:client_id(full_name, phone)')
      .eq('status', 'pending');

    if (vehicleType) {
      query = query.eq('vehicle_type', vehicleType);
    }

    const { data, error } = await query.order('created_at', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async acceptOrder(orderId: string, driverId: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({
        driver_id: driverId,
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .eq('status', 'pending')
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const updates: Record<string, unknown> = { status };
    if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getOrderById(orderId: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, client:client_id(full_name, phone), driver:driver_id(full_name, phone)')
      .eq('id', orderId)
      .single();
    if (error) throw error;
    return data;
  },

  async cancelOrder(orderId: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId)
      .in('status', ['pending', 'accepted']);
    if (error) throw error;
  },

  async getDriverActiveOrder(driverId: string): Promise<Order | null> {
    const { data } = await supabase
      .from('orders')
      .select('*, client:client_id(full_name, phone)')
      .eq('driver_id', driverId)
      .in('status', ['accepted', 'in_transit'])
      .order('accepted_at', { ascending: false })
      .limit(1)
      .single();
    return data ?? null;
  },
};
