import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { OrderStatusBadge } from '@/components/client/OrderStatusBadge';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { useDriverStore } from '@/stores/driverStore';
import { driverService } from '@/services/driverService';
import { formatCOP, VEHICLE_LABELS } from '@/lib/pricing';
import { Order } from '@/types/database.types';

export default function DriverTripsScreen() {
  const { profile } = useAuthStore();
  const { tripHistory, setTripHistory } = useDriverStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      try {
        const trips = await driverService.getDriverTrips(profile.id);
        setTripHistory(trips);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [profile, setTripHistory]);

  const renderTrip = ({ item }: { item: Order }) => (
    <Card className="mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-muted text-xs">
          {format(new Date(item.created_at), "d 'de' MMMM, HH:mm", { locale: es })}
        </Text>
        <OrderStatusBadge status={item.status} />
      </View>

      <View className="gap-1.5 mb-3">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 rounded-full bg-success" />
          <Text className="text-secondary text-sm flex-1" numberOfLines={1}>
            {item.origin_address}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="location" size={10} color="#FF6B35" />
          <Text className="text-secondary text-sm flex-1" numberOfLines={1}>
            {item.destination_address}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-gray-100 pt-2">
        <Text className="text-muted text-sm">{VEHICLE_LABELS[item.vehicle_type]}</Text>
        <Text className="text-primary font-bold">{formatCOP(item.total_price)}</Text>
      </View>
    </Card>
  );

  const totalEarnings = tripHistory
    .filter((t) => t.status === 'delivered')
    .reduce((sum, t) => sum + t.total_price, 0);

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
        <Text className="text-2xl font-bold text-secondary">Mis viajes</Text>
        <Text className="text-muted text-sm mt-1">
          {tripHistory.length} viaje{tripHistory.length !== 1 ? 's' : ''}
        </Text>

        {totalEarnings > 0 && (
          <View className="bg-secondary rounded-2xl p-4 mt-4 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-400 text-xs">Total ganado</Text>
              <Text className="text-white font-bold text-xl">
                {formatCOP(totalEarnings)}
              </Text>
            </View>
            <Ionicons name="wallet-outline" size={32} color="#FF6B35" />
          </View>
        )}
      </View>

      {tripHistory.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="time-outline" size={64} color="#E5E7EB" />
          <Text className="text-secondary font-bold text-lg mt-4 mb-2">
            Sin viajes aún
          </Text>
          <Text className="text-muted text-center">
            Cuando completes tus primeros pedidos aparecerán aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tripHistory}
          renderItem={renderTrip}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
