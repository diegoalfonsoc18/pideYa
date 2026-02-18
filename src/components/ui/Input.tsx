import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
}

export function Input({ label, error, helper, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-secondary font-medium mb-1 text-sm">{label}</Text>
      )}
      <TextInput
        className={`bg-white border rounded-xl px-4 py-3 text-secondary text-base ${
          error ? 'border-danger' : 'border-gray-200'
        }`}
        placeholderTextColor="#8E8E93"
        {...props}
      />
      {error && <Text className="text-danger text-xs mt-1">{error}</Text>}
      {helper && !error && (
        <Text className="text-muted text-xs mt-1">{helper}</Text>
      )}
    </View>
  );
}
