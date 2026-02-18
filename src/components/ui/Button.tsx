import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

const variantBgColors: Record<string, string> = {
  primary: '#FF6B35',
  secondary: '#2C3E50',
  danger: '#E74C3C',
  outline: 'transparent',
  ghost: 'transparent',
};

const variantShadows: Record<string, object> = {
  primary: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  secondary: {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  danger: {
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  outline: {},
  ghost: {},
};

const textColors: Record<string, string> = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  danger: '#FFFFFF',
  outline: '#FF6B35',
  ghost: '#FF6B35',
};

const sizePaddings: Record<string, object> = {
  sm: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  md: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16 },
  lg: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16 },
};

const textSizes: Record<string, number> = {
  sm: 14,
  md: 16,
  lg: 17,
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  iconPosition = 'left',
  className,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center ${className ?? ''}`}
      style={[
        {
          backgroundColor: variantBgColors[variant],
          opacity: isDisabled ? 0.5 : 1,
          ...(variant === 'outline' ? { borderWidth: 2, borderColor: '#FF6B35' } : {}),
        },
        sizePaddings[size],
        isDisabled ? {} : variantShadows[variant],
        style as object,
      ]}
      disabled={isDisabled}
      activeOpacity={0.85}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? '#FF6B35' : '#fff'}
          size="small"
        />
      ) : (
        <View className="flex-row items-center">
          {icon && iconPosition === 'left' && (
            <Text style={{ color: textColors[variant], fontSize: 18, marginRight: 8 }}>
              {icon}
            </Text>
          )}
          <Text
            style={{
              color: textColors[variant],
              fontSize: textSizes[size],
              fontWeight: '700',
              letterSpacing: 0.5,
            }}
          >
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <Text style={{ color: textColors[variant], fontSize: 18, marginLeft: 8 }}>
              {icon}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
