import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OrderStatus } from '@/types/database.types';

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: 'Buscando mensajero...',
    color: '#F39C12',
    bgColor: '#FEF3C7',
    icon: 'time-outline',
  },
  accepted: {
    label: 'Mensajero asignado',
    color: '#FF6B35',
    bgColor: '#FFF0EB',
    icon: 'person-circle-outline',
  },
  in_transit: {
    label: 'En camino',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    icon: 'bicycle-outline',
  },
  delivered: {
    label: 'Entregado',
    color: '#27AE60',
    bgColor: '#D1FAE5',
    icon: 'checkmark-circle-outline',
  },
  cancelled: {
    label: 'Cancelado',
    color: '#E74C3C',
    bgColor: '#FEE2E2',
    icon: 'close-circle-outline',
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'lg';
}

export function OrderStatusBadge({ status, size = 'sm' }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (size === 'lg') {
    return (
      <View
        className="flex-row items-center gap-2 px-4 py-3 rounded-2xl self-start"
        style={{ backgroundColor: config.bgColor }}
      >
        <Ionicons name={config.icon} size={22} color={config.color} />
        <Text className="font-semibold text-base" style={{ color: config.color }}>
          {config.label}
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-row items-center gap-1 px-2 py-1 rounded-full self-start"
      style={{ backgroundColor: config.bgColor }}
    >
      <Ionicons name={config.icon} size={12} color={config.color} />
      <Text className="text-xs font-semibold" style={{ color: config.color }}>
        {config.label}
      </Text>
    </View>
  );
}
