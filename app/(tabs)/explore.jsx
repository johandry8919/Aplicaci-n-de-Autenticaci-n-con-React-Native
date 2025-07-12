
import { View ,Text ,StyleSheet , Image} from 'react-native';

export default function Roles() {
  return (
   <View style={styles.container}>
      <Text style={styles.title}>En construcción</Text>
      <Image 
              source={require('../../assets/images/construction.jpg')} 
              style={styles.logo}
            />
   </View>
  );
}



const styles = StyleSheet.create({
  container: {
    color: '#808080',
    flex:1,
    justifyContent:'center',
    alignItems:'center'
    
  },
  title:{
    fontSize:25,
    fontWeight:800
  },
  logo: {
    width: 380,
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
 
});
