import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = () => {
    if (!email || !password) {
      alert('Por favor ingresa email y contraseña');
      return;
    }
    
    login(email, password);
  };

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#CC151A" 
      />
      <View style={styles.container}>
        {/* Contenedor principal con padding superior para evitar el status bar */}
        <View style={styles.content}>
          {/* Contenedor del logo y título */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo_header.jpg')} 
              style={styles.logo}
            />
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Enlace de registro */}
          <View style={styles.footer}>
            <Link href="/register" asChild>
              <Text style={styles.link}>
                ¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text>
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CC151A',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50, // Asegura espacio para la barra de estado
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 350,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  link: {
    color: '#fff',
    fontSize: 14,
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#fff',
  },
});