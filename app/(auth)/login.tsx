import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { loginSchema, LoginFormData } from '@/lib/validators';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await authService.signInWithEmail(data.email, data.password);
      router.replace('/');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al iniciar sesión';
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-16 pb-8">
          {/* Header */}
          <View className="mb-10">
            <View className="w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">pY</Text>
            </View>
            <Text className="text-3xl font-bold text-secondary">
              Bienvenido a
            </Text>
            <Text className="text-3xl font-bold text-primary">pideYa</Text>
            <Text className="text-muted mt-2">
              Inicia sesión para continuar
            </Text>
          </View>

          {/* Formulario */}
          <View className="flex-1">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Correo electrónico"
                  placeholder="tucorreo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Contraseña"
                  placeholder="••••••"
                  secureTextEntry={!showPassword}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="mb-6 self-end"
            >
              <Text className="text-primary font-medium text-sm">
                {showPassword ? 'Ocultar' : 'Mostrar'} contraseña
              </Text>
            </TouchableOpacity>

            <Button
              label="Iniciar sesión"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              size="lg"
            />

            <TouchableOpacity className="mt-4 items-center">
              <Link href="/(auth)/forgot-password">
                <Text className="text-muted text-sm">
                  ¿Olvidaste tu contraseña?
                </Text>
              </Link>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-muted">¿No tienes cuenta? </Text>
            <Link href="/(auth)/register">
              <Text className="text-primary font-semibold">Regístrate</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
