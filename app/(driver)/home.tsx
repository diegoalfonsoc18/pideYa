import { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AvailabilityToggle } from '@/components/driver/AvailabilityToggle';
import { AvailableOrderCard } from '@/components/driver/AvailableOrderCard';
import { useAuthStore } from '@/stores/authStore';
import { useDriverStore } from '@/stores/driverStore';
import { driverService } from '@/services/driverService';
import { orderService } from '@/services/orderService';
import { useRealtimePendingOrders } from '@/hooks/useRealtimePendingOrders';
import { Order } from '@/types/database.types';

export default function DriverHomeScreen() {
  const { profile } = useAuthStore();
  const {
    isAvailable,
    vehicleType,
    availableOrders,
    setAvailability,
    setAvailableOrders,
    setActiveOrder,
  } = useDriverStore();
  const [isToggling, setIsToggling] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useRealtimePendingOrders();

  useEffect(() => {
    const init = async () => {
      if (!profile) return;
      try {
        const status = await driverService.getDriverStatus(profile.id);
        if (status) {
          setAvailability(status.is_available, status.vehicle_type ?? undefined);
          if (status.is_available && status.vehicle_type) {
            const orders = await orderService.getPendingOrders(status.vehicle_type);
            setAvailableOrders(orders);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [profile, setAvailability, setAvailableOrders]);

  const handleToggle = async (value: boolean) => {
    if (!profile) return;
    setIsToggling(true);
    try {
      const vehicles = await driverService.getDriverVehicles(profile.id);
      const activeVehicle = vehicles[0];

      await driverService.setAvailability(
        profile.id,
        value,
        activeVehicle?.vehicle_type ?? undefined
      );
      setAvailability(value, activeVehicle?.vehicle_type ?? undefined);

      if (value && activeVehicle) {
        const orders = await orderService.getPendingOrders(activeVehicle.vehicle_type);
        setAvailableOrders(orders);
      } else {
        setAvailableOrders([]);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al cambiar estado';
      Alert.alert('Error', message);
    } finally {
      setIsToggling(false);
    }
  };

  const handleAccept = async (orderId: string) => {
    if (!profile) return;
    setAcceptingId(orderId);
    try {
      const order = await orderService.acceptOrder(orderId, profile.id);
      setActiveOrder(order);
      await driverService.setAvailability(profile.id, false);
      setAvailability(false);
      setAvailableOrders([]);
      Alert.alert(
        'Pedido aceptado',
        'Ve a la pestaña "Activo" para ver los detalles del pedido.'
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'El pedido ya fue tomado por otro mensajero';
      Alert.alert('No disponible', message);
    } finally {
      setAcceptingId(null);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#2C3E50" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 pt-14 pb-4">
        <Text className="text-muted text-sm">
          Hola, {profile?.full_name?.split(' ')[0]} 👋
        </Text>
        <Text className="text-2xl font-bold text-secondary mb-4">
          Pedidos disponibles
        </Text>

        <AvailabilityToggle
          isAvailable={isAvailable}
          vehicleType={vehicleType}
          onToggle={handleToggle}
          isLoading={isToggling}
        />
      </View>

      {isAvailable ? (
        <FlatList
          data={availableOrders}
          renderItem={({ item }: { item: Order }) => (
            <AvailableOrderCard
              order={item}
              onAccept={handleAccept}
              isAccepting={acceptingId === item.id}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-12">
              <Ionicons name="hourglass-outline" size={48} color="#E5E7EB" />
              <Text className="text-secondary font-semibold text-base mt-3 mb-1">
                Esperando pedidos...
              </Text>
              <Text className="text-muted text-center text-sm">
                Cuando haya pedidos disponibles{'\n'}aparecerán aquí automáticamente.
              </Text>
            </View>
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="power-outline" size={64} color="#E5E7EB" />
          <Text className="text-secondary font-bold text-lg mt-4 mb-2">
            Estás inactivo
          </Text>
          <Text className="text-muted text-center">
            Activa tu disponibilidad para comenzar{'\n'}a recibir pedidos.
          </Text>
        </View>
      )}
    </View>
  );
}
