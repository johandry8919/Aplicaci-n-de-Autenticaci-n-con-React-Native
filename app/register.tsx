import { View, Text, StyleSheet } from 'react-native';
import AuthForm from '../components/AuthForm';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <AuthForm isLogin={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});