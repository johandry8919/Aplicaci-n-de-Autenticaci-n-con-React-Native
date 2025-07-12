import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  

  if (isLoading) {
    return (
      <View >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="login" />}
    </Stack>
  );
}

const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};