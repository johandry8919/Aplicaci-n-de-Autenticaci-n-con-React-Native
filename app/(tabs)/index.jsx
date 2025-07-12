import { View, Text, StyleSheet, Image} from "react-native";
import { useAuth } from "../../context/AuthContext";


export default function HomeScreen() {
  const {user} = useAuth();
  return (
    <View style={styles.container}>
      {user ? (
        <Text style={styles.welcomeText}>Bienvenido, {user.email}</Text>
        
      ) : (
        <Text style={styles.welcomeText}>No has iniciado sesión</Text>
      )}

      <Text style={styles.welcomeText}>app en En construcción</Text>
      <Image
        source={require("../../assets/images/construction.jpg")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 350,
    height: 200,
    resizeMode: "contain",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
});
