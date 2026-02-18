import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

const schema = z.object({
  email: z.string().email('Email inválido'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email);
      if (error) throw error;
      Alert.alert(
        'Correo enviado',
        'Revisa tu bandeja de entrada para restablecer tu contraseña.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al enviar el correo';
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <View className="flex-1 px-6 pt-16">
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <Text className="text-primary text-base">← Volver</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-secondary mb-2">
          Olvidé mi contraseña
        </Text>
        <Text className="text-muted mb-8">
          Ingresa tu correo y te enviaremos las instrucciones para restablecerla.
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Correo electrónico"
              placeholder="tucorreo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.email?.message}
            />
          )}
        />

        <Button
          label="Enviar instrucciones"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          size="lg"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
