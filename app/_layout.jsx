import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SessionProvider, useSession } from '../context/SessionContext';

export default function RootLayout() {
  return (
    <SessionProvider>
      <AuthProvider>
        <AuthSessionSync />
        <RootLayoutNav />
      </AuthProvider>
    </SessionProvider>
  );
}


function AuthSessionSync() {
  const { user } = useAuth(null);
  const { setSession } = useSession(false);

  React.useEffect(() => {
    if (user) {
      setSession({
        token: user.token,
        userId: user.id,
        // otros datos de sesión
      });
    } else {
      setSession(null);
    }
  }, [user, setSession]);

  return null;
}

function RootLayoutNav() {
  const { user, isLoading } = useAuth(null);
  const { session } = useSession(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const isAuthenticated = user && session;
      router.replace(isAuthenticated ? '/(tabs)' : '/login');
    }
  }, [user, session, isLoading, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});