import { View, Text, TouchableOpacity, Linking, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { OrderStatusBadge } from '@/components/client/OrderStatusBadge';
import { useDriverStore } from '@/stores/driverStore';
import { orderService } from '@/services/orderService';
import { formatCOP } from '@/lib/pricing';
import { useState } from 'react';
import { Alert as RNAlert } from 'react-native';

export default function ActiveOrderScreen() {
  const { activeOrder, setActiveOrder, setAvailability } = useDriverStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStartTrip = async () => {
    if (!activeOrder) return;
    setIsUpdating(true);
    try {
      const updated = await orderService.updateOrderStatus(activeOrder.id, 'in_transit');
      setActiveOrder(updated);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al actualizar';
      Alert.alert('Error', message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeliver = () => {
    RNAlert.alert(
      'Confirmar entrega',
      '¿Confirmas que el pedido fue entregado al cliente?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, entregado',
          onPress: async () => {
            if (!activeOrder) return;
            setIsUpdating(true);
            try {
              const updated = await orderService.updateOrderStatus(
                activeOrder.id,
                'delivered'
              );
              setActiveOrder(updated);
              setAvailability(true);
              Alert.alert(
                'Entregado',
                'El pedido fue marcado como entregado. Ya puedes aceptar nuevos pedidos.'
              );
            } catch (error: unknown) {
              const message =
                error instanceof Error ? error.message : 'Error al actualizar';
              Alert.alert('Error', message);
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleCallClient = () => {
    const phone = activeOrder?.client?.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  if (!activeOrder) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="navigate-outline" size={64} color="#E5E7EB" />
        <Text className="text-secondary font-bold text-lg mt-4 mb-2">
          Sin pedido activo
        </Text>
        <Text className="text-muted text-center">
          Cuando aceptes un pedido podrás ver sus detalles aquí.
        </Text>
      </View>
    );
  }

  const isDelivered = activeOrder.status === 'delivered';

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      <View className="px-5 pt-14 pb-8">
        <Text className="text-2xl font-bold text-secondary mb-1">Pedido activo</Text>
        <Text className="text-muted text-sm mb-4">
          #{activeOrder.id.slice(-8).toUpperCase()}
        </Text>

        {/* Estado */}
        <Card className="mb-4">
          <OrderStatusBadge status={activeOrder.status} size="lg" />
        </Card>

        {/* Cliente */}
        {activeOrder.client && (
          <Card className="mb-4">
            <Text className="font-bold text-secondary mb-3">Cliente</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center">
                  <Text className="text-primary font-bold text-base">
                    {activeOrder.client.full_name?.charAt(0)?.toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text className="text-secondary font-semibold">
                    {activeOrder.client.full_name}
                  </Text>
                  {activeOrder.client.phone && (
                    <Text className="text-muted text-sm">{activeOrder.client.phone}</Text>
                  )}
                </View>
              </View>
              {activeOrder.client.phone && (
                <TouchableOpacity
                  onPress={handleCallClient}
                  className="w-10 h-10 bg-green-50 rounded-full items-center justify-center"
                >
                  <Ionicons name="call" size={18} color="#27AE60" />
                </TouchableOpacity>
              )}
            </View>
          </Card>
        )}

        {/* Ruta */}
        <Card className="mb-4">
          <Text className="font-bold text-secondary mb-3">Ruta</Text>
          <View className="gap-3">
            <View className="flex-row items-start gap-3">
              <View className="mt-1">
                <View className="w-3 h-3 rounded-full bg-success" />
              </View>
              <View className="flex-1">
                <Text className="text-muted text-xs">Recoger en</Text>
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
                <Text className="text-muted text-xs">Entregar en</Text>
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

        {/* Paquete */}
        {activeOrder.package_description && (
          <Card className="mb-4">
            <Text className="font-bold text-secondary mb-1">Descripción del paquete</Text>
            <Text className="text-muted text-sm">{activeOrder.package_description}</Text>
          </Card>
        )}

        {/* Ganancia */}
        <Card className="mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-secondary font-medium">Tu ganancia</Text>
            <Text className="text-primary font-bold text-xl">
              {formatCOP(activeOrder.total_price)}
            </Text>
          </View>
        </Card>

        {/* Acciones */}
        {!isDelivered && (
          <>
            {activeOrder.status === 'accepted' && (
              <Button
                label="Iniciar viaje"
                onPress={handleStartTrip}
                loading={isUpdating}
                size="lg"
              />
            )}
            {activeOrder.status === 'in_transit' && (
              <Button
                label="Marcar como entregado"
                variant="secondary"
                onPress={handleDeliver}
                loading={isUpdating}
                size="lg"
              />
            )}
          </>
        )}

        {isDelivered && (
          <View className="bg-green-50 p-4 rounded-2xl items-center">
            <Ionicons name="checkmark-circle" size={40} color="#27AE60" />
            <Text className="text-success font-bold text-base mt-2">
              Pedido completado
            </Text>
            <Text className="text-muted text-sm text-center mt-1">
              Ya puedes aceptar nuevos pedidos desde la pestaña Pedidos.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
