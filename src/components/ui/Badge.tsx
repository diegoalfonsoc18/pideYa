import { View, Text } from 'react-native';

type BadgeVariant = 'primary' | 'success' | 'danger' | 'warning' | 'muted';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-orange-100',
  success: 'bg-green-100',
  danger: 'bg-red-100',
  warning: 'bg-yellow-100',
  muted: 'bg-gray-100',
};

const textStyles: Record<BadgeVariant, string> = {
  primary: 'text-primary',
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  muted: 'text-muted',
};

export function Badge({ label, variant = 'muted' }: BadgeProps) {
  return (
    <View className={`px-3 py-1 rounded-full self-start ${variantStyles[variant]}`}>
      <Text className={`text-xs font-semibold ${textStyles[variant]}`}>{label}</Text>
    </View>
  );
}
