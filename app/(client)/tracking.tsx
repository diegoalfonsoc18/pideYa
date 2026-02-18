import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { OrderStatusBadge } from '@/components/client/OrderStatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useOrderStore } from '@/stores/orderStore';
import { useRealtimeOrder } from '@/hooks/useRealtimeOrder';
import { orderService } from '@/services/orderService';
import { formatCOP, VEHICLE_LABELS } from '@/lib/pricing';

export default function TrackingScreen() {
  const { activeOrder, setActiveOrder } = useOrderStore();

  useRealtimeOrder(activeOrder?.id ?? null);

  const handleCancel = async () => {
    if (!activeOrder) return;
    Alert.alert(
      'Cancelar pedido',
      '¿Estás seguro de que quieres cancelar este pedido?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await orderService.cancelOrder(activeOrder.id);
              setActiveOrder(null);
              router.replace('/(client)/home');
            } catch (error: unknown) {
              const message =
                error instanceof Error ? error.message : 'Error al cancelar';
              Alert.alert('Error', message);
            }
          },
        },
      ]
    );
  };

  const handleCallDriver = () => {
    const phone = activeOrder?.driver?.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  if (!activeOrder) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="location-outline" size={64} color="#E5E7EB" />
        <Text className="text-secondary font-bold text-lg mt-4 mb-2">
          Sin pedido activo
        </Text>
        <Text className="text-muted text-center mb-6">
          Cuando realices un pedido podrás ver su estado aquí en tiempo real.
        </Text>
        <Button
          label="Hacer un pedido"
          onPress={() => router.push('/(client)/home')}
        />
      </View>
    );
  }

  const isCompleted = activeOrder.status === 'delivered' || activeOrder.status === 'cancelled';

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      <View className="px-5 pt-14 pb-8">
        {/* Header */}
        <Text className="text-2xl font-bold text-secondary mb-1">
          Seguimiento
        </Text>
        <Text className="text-muted text-sm mb-6">
          Pedido #{activeOrder.id.slice(-8).toUpperCase()}
        </Text>

        {/* Estado actual */}
        <Card className="mb-4">
          <OrderStatusBadge status={activeOrder.status} size="lg" />

          {activeOrder.status === 'pending' && (
            <Text className="text-muted text-sm mt-3">
              Estamos buscando un mensajero disponible para tu pedido...
            </Text>
          )}

          {activeOrder.status === 'accepted' && activeOrder.driver && (
            <View className="mt-3">
              <Text className="text-secondary font-semibold">
                {activeOrder.driver.full_name}
              </Text>
              <Text className="text-muted text-sm">{VEHICLE_LABELS[activeOrder.vehicle_type]}</Text>
              {activeOrder.driver.phone && (
                <TouchableOpacity
                  onPress={handleCallDriver}
                  className="flex-row items-center gap-2 mt-2"
                >
                  <Ionicons name="call-outline" size={16} color="#FF6B35" />
                  <Text className="text-primary font-medium text-sm">
                    Llamar al mensajero
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {activeOrder.status === 'delivered' && (
            <Text className="text-success font-medium text-sm mt-3">
              Tu pedido fue entregado exitosamente
            </Text>
          )}
        </Card>

        {/* Detalles de ruta */}
        <Card className="mb-4">
          <Text className="font-bold text-secondary mb-3">Ruta</Text>
          <View className="gap-3">
            <View className="flex-row items-start gap-3">
              <View className="mt-1">
                <View className="w-3 h-3 rounded-full bg-success" />
              </View>
              <View className="flex-1">
                <Text className="text-muted text-xs">Recogida</Text>
                <Text className="text-secondary font-medium text-sm">
                  {activeOrder.origin_address}
                </Text>
                {activeOrder.origin_reference && (
                  <Text className="text-muted text-xs mt-0.5">
                    {activeOrder.origin_reference}
                  </Text>
                )}
              </View>
            </View>
            <View className="flex-row items-start gap-3">
              <View className="mt-1">
                <Ionicons name="location" size={14} color="#FF6B35" />
              </View>
              <View className="flex-1">
                <Text className="text-muted text-xs">Entrega</Text>
                <Text className="text-secondary font-medium text-sm">
                  {activeOrder.destination_address}
                </Text>
                {activeOrder.destination_reference && (
                  <Text className="text-muted text-xs mt-0.5">
                    {activeOrder.destination_reference}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Card>

        {/* Precio */}
        <Card className="mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-secondary font-medium">Total a pagar</Text>
            <Text className="text-primary font-bold text-xl">
              {formatCOP(activeOrder.total_price)}
            </Text>
          </View>
        </Card>

        {/* Acciones */}
        {isCompleted ? (
          <Button
            label="Hacer otro pedido"
            onPress={() => {
              setActiveOrder(null);
              router.replace('/(client)/home');
            }}
          />
        ) : (
          activeOrder.status === 'pending' && (
            <Button
              label="Cancelar pedido"
              variant="danger"
              onPress={handleCancel}
            />
          )
        )}
      </View>
    </ScrollView>
  );
}
