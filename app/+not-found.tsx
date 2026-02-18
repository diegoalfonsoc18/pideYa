import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-6xl mb-4">🔍</Text>
      <Text className="text-2xl font-bold text-secondary mb-2">
        Página no encontrada
      </Text>
      <Text className="text-muted text-center mb-8">
        Lo que buscas no existe o fue movido.
      </Text>
      <Link href="/" className="text-primary font-semibold text-base">
        Volver al inicio
      </Link>
    </View>
  );
}
