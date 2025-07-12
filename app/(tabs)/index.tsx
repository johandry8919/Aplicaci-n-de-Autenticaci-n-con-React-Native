import { View, Text, StyleSheet ,Image } from 'react-native';
// import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  // const { user } = useAuth();

  return (
    <View style={styles.container}>
       <Image 
        source={require('../../assets/images/logo_header.jpg')} 
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  logo:{
    width: 350,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,

  }
});