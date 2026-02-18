import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DriverLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2C3E50',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F1F1',
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="motorbike" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="active-order"
        options={{
          title: 'Activo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="navigate-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Viajes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
