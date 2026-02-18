import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

export function useAuth() {
  const { session, user, profile, isLoading } = useAuthStore();

  const signOut = async () => {
    await authService.signOut();
  };

  return {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!session,
    isClient: profile?.role === 'client',
    isDriver: profile?.role === 'driver',
    signOut,
  };
}
