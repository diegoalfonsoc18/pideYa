import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VehicleSelector } from '@/components/client/VehicleSelector';
import { PriceSummary } from '@/components/client/PriceSummary';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { orderService } from '@/services/orderService';
import {
  calculatePrice,
  estimateDistancePlaceholder,
} from '@/lib/pricing';
import { orderAddressSchema, OrderAddressFormData } from '@/lib/validators';
import { VehicleType } from '@/types/database.types';

type Step = 1 | 2 | 3;

export default function ClientHomeScreen() {
  const { profile } = useAuthStore();
  const { draft, updateDraft, resetDraft, setActiveOrder } = useOrderStore();
  const [step, setStep] = useState<Step>(1);
  const [isCreating, setIsCreating] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderAddressFormData>({
    resolver: zodResolver(orderAddressSchema),
    defaultValues: {
      origin_address: draft.originAddress,
      origin_reference: draft.originReference,
      destination_address: draft.destinationAddress,
      destination_reference: draft.destinationReference,
      package_description: draft.packageDescription,
    },
  });

  const handleVehicleSelect = (type: VehicleType) => {
    updateDraft({ vehicleType: type });
    setStep(2);
  };

  const handleAddresses = async (data: OrderAddressFormData) => {
    updateDraft({
      originAddress: data.origin_address,
      originReference: data.origin_reference ?? '',
      destinationAddress: data.destination_address,
      destinationReference: data.destination_reference ?? '',
      packageDescription: data.package_description ?? '',
    });

    if (!draft.vehicleType) return;

    const km = estimateDistancePlaceholder(
      data.origin_address,
      data.destination_address
    );
    const price = await calculatePrice(draft.vehicleType, km);

    updateDraft({ estimatedKm: km, estimatedPrice: price });
    setStep(3);
  };

  const handleConfirmOrder = async () => {
    if (!profile || !draft.vehicleType || !draft.estimatedPrice || !draft.estimatedKm) return;

    setIsCreating(true);
    try {
      const order = await orderService.createOrder({
        clientId: profile.id,
        vehicleType: draft.vehicleType,
        originAddress: draft.originAddress,
        originReference: draft.originReference || undefined,
        destinationAddress: draft.destinationAddress,
        destinationReference: draft.destinationReference || undefined,
        packageDescription: draft.packageDescription || undefined,
        estimatedDistanceKm: draft.estimatedKm,
        basePrice: draft.estimatedPrice,
        totalPrice: draft.estimatedPrice,
      });

      setActiveOrder(order);
      resetDraft();
      setStep(1);
      router.push('/(client)/tracking');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al crear el pedido';
      Alert.alert('Error', message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-5 pt-14 pb-8 flex-1">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-muted text-sm">Hola, {profile?.full_name?.split(' ')[0]} 👋</Text>
            <Text className="text-2xl font-bold text-secondary">
              ¿Qué necesitas enviar?
            </Text>
          </View>

          {/* Indicador de pasos */}
          <View className="flex-row gap-2 mb-6">
            {([1, 2, 3] as Step[]).map((s) => (
              <View
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  s <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </View>

          {/* Paso 1: Selección de vehículo */}
          {step === 1 && (
            <View>
              <Text className="text-secondary font-semibold text-base mb-3">
                Selecciona el tipo de vehículo
              </Text>
              <VehicleSelector
                value={draft.vehicleType}
                onSelect={handleVehicleSelect}
              />
            </View>
          )}

          {/* Paso 2: Direcciones */}
          {step === 2 && (
            <View>
              <Text className="text-secondary font-semibold text-base mb-3">
                ¿Dónde recogemos y entregamos?
              </Text>

              <Controller
                control={control}
                name="origin_address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Dirección de recogida"
                    placeholder="Calle 10 # 15-20, Barrio Centro"
                    multiline
                    numberOfLines={2}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.origin_address?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="origin_reference"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Referencia (opcional)"
                    placeholder="Ej: Local 3, junto al banco"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value ?? ''}
                  />
                )}
              />

              <Controller
                control={control}
                name="destination_address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Dirección de entrega"
                    placeholder="Carrera 5 # 30-45, Barrio Norte"
                    multiline
                    numberOfLines={2}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.destination_address?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="destination_reference"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Referencia del destino (opcional)"
                    placeholder="Ej: Casa azul con reja negra"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value ?? ''}
                  />
                )}
              />

              <Controller
                control={control}
                name="package_description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Descripción del paquete (opcional)"
                    placeholder="Ej: Caja pequeña, frágil"
                    multiline
                    numberOfLines={2}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value ?? ''}
                  />
                )}
              />

              <View className="flex-row gap-3 mt-2">
                <Button
                  label="Atrás"
                  variant="outline"
                  onPress={() => setStep(1)}
                  className="flex-1"
                />
                <Button
                  label="Ver precio"
                  onPress={handleSubmit(handleAddresses)}
                  className="flex-1"
                />
              </View>
            </View>
          )}

          {/* Paso 3: Confirmación */}
          {step === 3 && draft.vehicleType && draft.estimatedKm && draft.estimatedPrice && (
            <View>
              <Text className="text-secondary font-semibold text-base mb-3">
                Confirma tu pedido
              </Text>

              <PriceSummary
                vehicleType={draft.vehicleType}
                distanceKm={draft.estimatedKm}
                totalPrice={draft.estimatedPrice}
                originAddress={draft.originAddress}
                destinationAddress={draft.destinationAddress}
              />

              <View className="flex-row gap-3 mt-4">
                <Button
                  label="Atrás"
                  variant="outline"
                  onPress={() => setStep(2)}
                  className="flex-1"
                />
                <Button
                  label="Confirmar pedido"
                  onPress={handleConfirmOrder}
                  loading={isCreating}
                  className="flex-1"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
