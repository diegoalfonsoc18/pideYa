import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantStyles = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  danger: 'bg-danger',
  outline: 'bg-transparent border-2 border-primary',
  ghost: 'bg-transparent',
};

const textStyles = {
  primary: 'text-white',
  secondary: 'text-white',
  danger: 'text-white',
  outline: 'text-primary',
  ghost: 'text-primary',
};

const sizeStyles = {
  sm: 'py-2 px-4 rounded-lg',
  md: 'py-3 px-6 rounded-xl',
  lg: 'py-4 px-8 rounded-xl',
};

const textSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? '#FF6B35' : '#fff'}
          size="small"
        />
      ) : (
        <Text
          className={`font-semibold ${textStyles[variant]} ${textSizeStyles[size]}`}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
