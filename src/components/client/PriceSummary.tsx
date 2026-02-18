import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VehicleType } from '@/types/database.types';
import { formatCOP, VEHICLE_LABELS } from '@/lib/pricing';

interface PriceSummaryProps {
  vehicleType: VehicleType;
  distanceKm: number;
  totalPrice: number;
  originAddress: string;
  destinationAddress: string;
}

export function PriceSummary({
  vehicleType,
  distanceKm,
  totalPrice,
  originAddress,
  destinationAddress,
}: PriceSummaryProps) {
  return (
    <View className="bg-white rounded-2xl p-4 gap-4" style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
      <Text className="font-bold text-secondary text-base">Resumen del pedido</Text>

      <View className="gap-2">
        <View className="flex-row items-start gap-3">
          <View className="w-6 items-center mt-0.5">
            <View className="w-3 h-3 rounded-full bg-success" />
          </View>
          <View className="flex-1">
            <Text className="text-muted text-xs">Origen</Text>
            <Text className="text-secondary text-sm font-medium" numberOfLines={2}>
              {originAddress}
            </Text>
          </View>
        </View>
        <View className="ml-3 border-l-2 border-dashed border-gray-300 h-4" />
        <View className="flex-row items-start gap-3">
          <View className="w-6 items-center mt-0.5">
            <Ionicons name="location" size={14} color="#FF6B35" />
          </View>
          <View className="flex-1">
            <Text className="text-muted text-xs">Destino</Text>
            <Text className="text-secondary text-sm font-medium" numberOfLines={2}>
              {destinationAddress}
            </Text>
          </View>
        </View>
      </View>

      <View className="border-t border-gray-100 pt-3 gap-2">
        <View className="flex-row justify-between">
          <Text className="text-muted text-sm">Vehículo</Text>
          <Text className="text-secondary text-sm font-medium">
            {VEHICLE_LABELS[vehicleType]}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-muted text-sm">Distancia estimada</Text>
          <Text className="text-secondary text-sm font-medium">
            {distanceKm.toFixed(1)} km
          </Text>
        </View>
        <View className="flex-row justify-between border-t border-gray-100 pt-2 mt-1">
          <Text className="text-secondary font-bold text-base">Total</Text>
          <Text className="text-primary font-bold text-xl">
            {formatCOP(totalPrice)}
          </Text>
        </View>
      </View>
    </View>
  );
}
