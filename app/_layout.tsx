import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import '../global.css';

export default function RootLayout() {
  const { setSession, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        try {
          const profile = await authService.getProfile(session.user.id);
          setProfile(profile);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setProfile, setLoading]);

  return (
    <PaperProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(client)" />
        <Stack.Screen name="(driver)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
