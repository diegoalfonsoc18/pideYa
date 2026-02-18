import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VehicleType } from '@/types/database.types';
import { VEHICLE_DESCRIPTIONS, VEHICLE_LABELS } from '@/lib/pricing';

interface VehicleOption {
  type: VehicleType;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  { type: 'moto', icon: 'motorbike' },
  { type: 'moto_carguero', icon: 'truck-cargo-container' },
];

interface VehicleSelectorProps {
  value: VehicleType | null;
  onSelect: (type: VehicleType) => void;
}

export function VehicleSelector({ value, onSelect }: VehicleSelectorProps) {
  return (
    <View className="gap-3">
      {VEHICLE_OPTIONS.map((option) => {
        const isSelected = value === option.type;
        return (
          <TouchableOpacity
            key={option.type}
            onPress={() => onSelect(option.type)}
            activeOpacity={0.8}
            className={`flex-row items-center p-4 rounded-2xl border-2 bg-white ${
              isSelected ? 'border-primary' : 'border-gray-200'
            }`}
          >
            <View
              className={`w-14 h-14 rounded-xl items-center justify-center mr-4 ${
                isSelected ? 'bg-orange-100' : 'bg-gray-100'
              }`}
            >
              <MaterialCommunityIcons
                name={option.icon}
                size={28}
                color={isSelected ? '#FF6B35' : '#8E8E93'}
              />
            </View>
            <View className="flex-1">
              <Text
                className={`font-semibold text-base ${
                  isSelected ? 'text-primary' : 'text-secondary'
                }`}
              >
                {VEHICLE_LABELS[option.type]}
              </Text>
              <Text className="text-muted text-sm mt-0.5">
                {VEHICLE_DESCRIPTIONS[option.type]}
              </Text>
            </View>
            <View
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                isSelected ? 'border-primary bg-primary' : 'border-gray-300'
              }`}
            >
              {isSelected && (
                <View className="w-2 h-2 rounded-full bg-white" />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
