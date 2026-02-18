import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { OrderStatusBadge } from '@/components/client/OrderStatusBadge';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { orderService } from '@/services/orderService';
import { formatCOP, VEHICLE_LABELS } from '@/lib/pricing';
import { Order } from '@/types/database.types';
import { Ionicons } from '@expo/vector-icons';

export default function ClientOrdersScreen() {
  const { profile } = useAuthStore();
  const { orderHistory, setOrderHistory } = useOrderStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      try {
        const orders = await orderService.getClientOrders(profile.id);
        setOrderHistory(orders);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [profile, setOrderHistory]);

  const renderOrder = ({ item }: { item: Order }) => (
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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 pt-14 pb-4">
        <Text className="text-2xl font-bold text-secondary">Mis pedidos</Text>
        <Text className="text-muted text-sm mt-1">
          {orderHistory.length} pedido{orderHistory.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {orderHistory.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="receipt-outline" size={64} color="#E5E7EB" />
          <Text className="text-secondary font-bold text-lg mt-4 mb-2">
            Sin pedidos aún
          </Text>
          <Text className="text-muted text-center">
            Tus pedidos aparecerán aquí una vez que hagas el primero.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orderHistory}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
