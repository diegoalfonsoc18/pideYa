import { useState } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  icon?: string;
}

export function Input({ label, error, helper, icon, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={{ marginBottom: 18 }}>
      {label && (
        <Text
          style={{
            color: '#2C3E50',
            fontSize: 13,
            fontWeight: '700',
            marginBottom: 8,
            letterSpacing: 0.3,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isFocused ? '#FFFFFF' : '#F8F6F3',
          borderWidth: 1.5,
          borderColor: error
            ? '#E74C3C'
            : isFocused
            ? '#FF6B35'
            : '#EEEBE7',
          borderRadius: 14,
          paddingHorizontal: 16,
          // Glow on focus
          ...(isFocused
            ? {
                shadowColor: '#FF6B35',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 4,
              }
            : {}),
        }}
      >
        {icon && (
          <Text style={{ fontSize: 16, marginRight: 10, opacity: 0.7 }}>{icon}</Text>
        )}
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: '#2C3E50',
            paddingVertical: 15,
          }}
          placeholderTextColor="#B0ADA8"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
      {error && (
        <Text style={{ color: '#E74C3C', fontSize: 12, marginTop: 5, marginLeft: 4 }}>
          {error}
        </Text>
      )}
      {helper && !error && (
        <Text style={{ color: '#8E8E93', fontSize: 12, marginTop: 5, marginLeft: 4 }}>
          {helper}
        </Text>
      )}
    </View>
  );
}
