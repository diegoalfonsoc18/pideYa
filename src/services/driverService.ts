import { supabase } from '@/lib/supabase';
import { DriverStatus, Order, Vehicle, VehicleType } from '@/types/database.types';

export const driverService = {
  async setAvailability(
    driverId: string,
    isAvailable: boolean,
    vehicleType?: VehicleType
  ): Promise<DriverStatus> {
    const { data, error } = await supabase
      .from('driver_status')
      .upsert({
        driver_id: driverId,
        is_available: isAvailable,
        vehicle_type: vehicleType ?? null,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getDriverStatus(driverId: string): Promise<DriverStatus | null> {
    const { data } = await supabase
      .from('driver_status')
      .select('*')
      .eq('driver_id', driverId)
      .single();
    return data ?? null;
  },

  async getDriverTrips(driverId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, client:client_id(full_name, phone)')
      .eq('driver_id', driverId)
      .in('status', ['accepted', 'in_transit', 'delivered', 'cancelled'])
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async registerVehicle(
    driverId: string,
    vehicle: {
      vehicle_type: VehicleType;
      plate: string;
      brand?: string;
      model?: string;
      color?: string;
    }
  ): Promise<Vehicle> {
    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        driver_id: driverId,
        vehicle_type: vehicle.vehicle_type,
        plate: vehicle.plate.toUpperCase(),
        brand: vehicle.brand ?? null,
        model: vehicle.model ?? null,
        color: vehicle.color ?? null,
        is_active: true,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getDriverVehicles(driverId: string): Promise<Vehicle[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('driver_id', driverId)
      .eq('is_active', true);
    if (error) throw error;
    return data ?? [];
  },
};
