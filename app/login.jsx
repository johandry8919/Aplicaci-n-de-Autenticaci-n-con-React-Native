import { Link } from 'expo-router';
import { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Error', 'Email o Clave incorrectas');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo_header.jpg')} 
              style={styles.logo}
            />
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isSubmitting}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isSubmitting}
            />
            
            <TouchableOpacity 
              style={[styles.button, isSubmitting && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Link href="/register" asChild>
              <TouchableOpacity disabled={isSubmitting}>
                <Text style={styles.link}>
                  ¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text>
                </Text>
              </TouchableOpacity>
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
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50,
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
    marginBottom: -60,
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
    justifyContent: 'center',
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: '#7fb3ff',
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