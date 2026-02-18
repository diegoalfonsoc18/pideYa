import { View, Text, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VehicleType } from '@/types/database.types';
import { VEHICLE_LABELS } from '@/lib/pricing';

interface AvailabilityToggleProps {
  isAvailable: boolean;
  vehicleType: VehicleType | null;
  onToggle: (value: boolean) => void;
  isLoading?: boolean;
}

export function AvailabilityToggle({
  isAvailable,
  vehicleType,
  onToggle,
  isLoading = false,
}: AvailabilityToggleProps) {
  return (
    <View
      className={`p-5 rounded-2xl ${isAvailable ? 'bg-green-50 border-2 border-success' : 'bg-gray-50 border-2 border-gray-200'}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className={`w-12 h-12 rounded-xl items-center justify-center ${
              isAvailable ? 'bg-green-100' : 'bg-gray-200'
            }`}
          >
            <MaterialCommunityIcons
              name={isAvailable ? 'motorbike' : 'motorbike-off'}
              size={24}
              color={isAvailable ? '#27AE60' : '#8E8E93'}
            />
          </View>
          <View>
            <Text
              className={`font-bold text-base ${
                isAvailable ? 'text-success' : 'text-muted'
              }`}
            >
              {isAvailable ? 'Disponible' : 'No disponible'}
            </Text>
            {vehicleType && (
              <Text className="text-muted text-sm">
                {VEHICLE_LABELS[vehicleType]}
              </Text>
            )}
          </View>
        </View>
        <Switch
          value={isAvailable}
          onValueChange={onToggle}
          disabled={isLoading}
          trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
          thumbColor={isAvailable ? '#27AE60' : '#9CA3AF'}
          ios_backgroundColor="#E5E7EB"
        />
      </View>
    </View>
  );
}
