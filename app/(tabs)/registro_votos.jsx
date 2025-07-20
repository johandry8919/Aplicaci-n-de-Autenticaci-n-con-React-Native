import React, { use, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { ScrollView } from 'react-native';

export default function Registro_voto() {
  const [nacionalidad, setNacionalidad] = useState('V');
  const [cedula, setCedula] = useState('');
  const [votante, setVotante] = useState(null);
  const [voto, setVoto] = useState(false);
  const [organizacion, setOrganizacion] = useState('Comuna joven');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const token = 'faa3dc480981bbfb734839367d2c9367'; 

  console.log(votante);

   useEffect(() => {
    setVotante(null);
   
  }, []);

  const buscarPorCedula = () => {
  if (!cedula) {
    Alert.alert('Error', 'Por favor ingrese un número de cédula');
    return;
  }

  setSearching(true);
  
  
  
  axios.get(`https://comunajoven.com.ve/api/consultaCedula?nacionalidad=${nacionalidad}&cedula=${cedula}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(response => {

     
      if (response.status === 200) {
        setVotante(response.data);
      } else {
        Alert.alert('Error', response.data.message || 'No se encontró el votante');
      }
    })
    .catch(error => {
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert('Error', 'No autorizado - Por favor inicie sesión nuevamente');
        } else {
          Alert.alert('Error', error.response.data.message || 'Error al buscar el votante');
        }
      } else if (error.request) {
        Alert.alert('Error', 'No se recibió respuesta del servidor');
      } else {
        Alert.alert('Error', 'Error al configurar la solicitud');
        console.error('Error:', error.message);
      }
    })
    .finally(() => {
      setSearching(false);
    });
};

  const enviarRegistro = () => {
    if (!votante) {
      Alert.alert('Error', 'Primero debe buscar un votante');
      return;
    }

    setLoading(true);
    
    axios.post('https://comunajoven.com.ve/api/registroVotos', {
      cedula: votante.data.cedula,
      votante_name: votante.data.name + ' ' + votante.data.lastname,
      votante_estado: votante.data.name_estado,
      votante_municipio: votante.data.name_municipio,
      votante_parroquia: votante.data.name_parroquia,
      voto,
      centro_votacion: votante.data.votingCenterName,
      codigo_centro_votacion: votante.data.votingCenterCode,
      observaciones, 
      organizacion,
      nacionalidad,
      fecha_registro: new Date().toISOString(),
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'},
        
    })
      .then(response => {
        if (response.status === 200) {
          Alert.alert('Éxito', 'Registro de voto guardado correctamente');
          setNacionalidad('V');
          setCedula('');
          setVotante(null);
          setVoto(false);
          setObservaciones('');

          console.log('Registro guardado:', response.data);
        } else {
          Alert.alert('Error', response.data.message || 'Error al guardar el registro');
        }
      })
      .catch(error => {
        if (error.response) {
          Alert.alert('Error', error.response.data.message || 'Error al guardar el registro');
        } else if (error.request) {
          Alert.alert('Error', 'No se recibió respuesta del servidor');
        } else {
          Alert.alert('Error', 'Error al configurar la solicitud');
          console.error('Error:', error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro de votos de centro de votación</Text>
        
        {!votante ? (
          <View style={styles.searchContainer}>
            <View style={styles.cedulaColumn}>
              <Text style={styles.label}>Nacionalidad:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={nacionalidad}
                  style={styles.picker}
                  onValueChange={(itemValue) => setNacionalidad(itemValue)}>
                  <Picker.Item label="Venezolano (V)" value="V" />
                  <Picker.Item label="Extranjero (E)" value="E" />
                </Picker>
              </View>
              
              <Text style={styles.label}>Número de cédula:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: 12345678"
                keyboardType="numeric"
                value={cedula}
                onChangeText={setCedula}
              />
            </View>
            
            <Button 
              title="Buscar" 
              onPress={buscarPorCedula} 
              disabled={searching}
            />
            {searching && <ActivityIndicator size="small" color="#0000ff" />}
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.infoText}>Nombre: {votante.data.name}</Text>
            <Text style={styles.infoText}>apellido: {votante.data.lastname}</Text>
            <Text style={styles.infoText}>Cédula: {nacionalidad}-{votante.data.cedula}</Text>
            <Text style={styles.infoText}>Estado: {votante.data.name_estado}</Text>
            <Text style={styles.infoText}>Municipio: {votante.data.name_municipio}</Text>
            <Text style={styles.infoText}>Parroquia: {votante.data.name_parroquia}</Text>
            <Text style={styles.infoText}>Centro de votación: {votante.data.votingCenterName}</Text>
            <Text style={styles.infoText}>Codigo Centro de votación: {votante.data.votingCenterCode}</Text>

            <View style={styles.checkboxContainer}>
              <Text style={styles.label}>¿Votó en su centro de votación?</Text>
              <View style={styles.radioGroup}>
                <Button 
                  title="Sí" 
                  onPress={() => setVoto(true)} 
                  color={voto ? 'green' : undefined}
                />
                <Button 
                  title="No" 
                  onPress={() => setVoto(false)} 
                  color={!voto ? 'red' : undefined}
                />
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Organización a la que perteneces</Text>
                <Picker
                  selectedValue={organizacion}
                  style={styles.picker}
                  onValueChange={(itemValue) => setOrganizacion(itemValue)}>
                  <Picker.Item label="Comuna joven" value="Comuna joven" />
                  <Picker.Item label="Una mujer" value="Una mujer" />
                </Picker>
              </View>
            </View>
            
            <Text style={styles.label}>Observaciones:</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="(Opcional)"
              multiline
              numberOfLines={4}
              value={observaciones}
              onChangeText={setObservaciones}
            />
            
            <View style={styles.buttonGroup}>
              <Button 
                title="Guardar Registro" 
                onPress={enviarRegistro} 
                disabled={loading}
              />
              <Button 
                title="Cancelar" 
                onPress={() => setVotante(null)} 
                color="gray"
                disabled={loading}
              />
            </View>
            
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Los estilos permanecen iguales
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  cedulaColumn: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
  checkboxContainer: {
    marginVertical: 20,
  },
  question: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
    fontWeight: '500',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
});