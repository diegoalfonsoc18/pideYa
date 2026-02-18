import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Order } from '@/types/database.types';
import { formatCOP, VEHICLE_LABELS } from '@/lib/pricing';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AvailableOrderCardProps {
  order: Order;
  onAccept: (orderId: string) => void;
  isAccepting?: boolean;
}

export function AvailableOrderCard({
  order,
  onAccept,
  isAccepting = false,
}: AvailableOrderCardProps) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3" style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons name="motorbike" size={18} color="#FF6B35" />
          <Text className="text-primary font-semibold text-sm">
            {VEHICLE_LABELS[order.vehicle_type]}
          </Text>
        </View>
        <Text className="text-muted text-xs">
          {format(new Date(order.created_at), 'HH:mm', { locale: es })}
        </Text>
      </View>

      <View className="gap-2 mb-3">
        <View className="flex-row items-start gap-2">
          <View className="mt-1">
            <View className="w-2.5 h-2.5 rounded-full bg-success" />
          </View>
          <View className="flex-1">
            <Text className="text-muted text-xs">Recoge en</Text>
            <Text className="text-secondary text-sm font-medium" numberOfLines={2}>
              {order.origin_address}
            </Text>
          </View>
        </View>
        <View className="flex-row items-start gap-2">
          <View className="mt-1">
            <Ionicons name="location" size={12} color="#FF6B35" />
          </View>
          <View className="flex-1">
            <Text className="text-muted text-xs">Entrega en</Text>
            <Text className="text-secondary text-sm font-medium" numberOfLines={2}>
              {order.destination_address}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
        <View>
          <Text className="text-muted text-xs">Ganancia estimada</Text>
          <Text className="text-primary font-bold text-lg">
            {formatCOP(order.total_price)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onAccept(order.id)}
          disabled={isAccepting}
          activeOpacity={0.8}
          className={`px-5 py-2.5 rounded-xl ${isAccepting ? 'bg-gray-300' : 'bg-primary'}`}
        >
          <Text className="text-white font-semibold text-sm">
            {isAccepting ? 'Aceptando...' : 'Aceptar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
