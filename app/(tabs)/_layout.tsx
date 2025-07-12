import { Drawer } from 'expo-router/drawer';
import { useAuth } from '../../context/AuthContext';
import { Button } from 'react-native';

export default function Layout() {
  const { logout } = useAuth();

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <Button onPress={logout} title="Cerrar sesion" color="#000" />
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />

      <Drawer.Screen
        name="explore"
        options={{
          title: 'Roles',
        }}
      />
      <Drawer.Screen
        name="Validar_Comuna"
        options={{
          title: 'Validar Comuna ',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Configuración',
        }}
      />
    </Drawer>
  );
}