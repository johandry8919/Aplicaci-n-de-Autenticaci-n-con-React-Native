import { Drawer } from 'expo-router/drawer';
import { useAuth } from '../../context/AuthContext';
import { View, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

export default function Layout() {
  const { logout } = useAuth();

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        {/* Encabezado del drawer */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Menú Principal</Text>
        </View>

        {/* Lista automática de pantallas con sus labels */}
        <DrawerItemList {...props} />

        {/* Botón de cerrar sesión al final */}
        <View style={{ marginTop: 'auto', paddingVertical: 16 }}>
          <DrawerItem
            label="Cerrar sesión"
            onPress={logout}
            labelStyle={{ color: 'red', fontWeight: 'bold' }}
          />
        </View>
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: '#0000ff',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Inicio',
          title: 'Inicio'
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          drawerLabel: 'Roles',
          title: 'Roles'
        }}
      />
      <Drawer.Screen
        name="Validar_Comuna"
        options={{
          drawerLabel: 'Validar Comuna',
          title: 'Validar Comuna'
        }}
      />
      
    </Drawer>
  );
}