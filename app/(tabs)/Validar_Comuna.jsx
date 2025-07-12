import React, { useState } from 'react';
import { View, Button, StyleSheet,Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
// import { useAuth } from '../../context/AuthContext';

const LOCATION_OPTIONS = {
  estados: [
    { label: 'Seleccione un estado', value: '' },
    { label: 'Estado 1', value: 'estado1' },
    { label: 'Estado 2', value: 'estado2' },
  ],
  municipios: [
    { label: 'Seleccione un municipio', value: '' },
    { label: 'Municipio 1', value: 'municipio1' },
    { label: 'Municipio 2', value: 'municipio2' },
  ],
  parroquias: [
    { label: 'Seleccione una parroquia', value: '' },
    { label: 'Parroquia 1', value: 'parroquia1' },
    { label: 'Parroquia 2', value: 'parroquia2' },
  ],
};

export default function ValidarComuna() {
    // const { user } = useAuth();
  const [location, setLocation] = useState({
    estado: '',
    municipio: '',
    parroquia: '',
  });

  const handleLocationChange = (field, value) => {
    setLocation(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Datos enviados:', location);
    // Aquí iría la lógica para procesar los datos
  };

  const renderPicker = (field, options, placeholder) => (
    <Picker
      selectedValue={location[field]}
      style={styles.input}
      onValueChange={(value) => handleLocationChange(field, value)}
    >
      {options.map((option) => (
        <Picker.Item 
          key={option.value} 
          label={option.label} 
          value={option.value} 
        />
      ))}
    </Picker>
  );

  return (
    <View style={styles.container}>
    
      <View style={styles.formContainer}>
        {renderPicker('estado', LOCATION_OPTIONS.estados)}
        {renderPicker('municipio', LOCATION_OPTIONS.municipios)}
        {renderPicker('parroquia', LOCATION_OPTIONS.parroquias)}
        
        <Button
          title="Buscar"
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    fontSize: 16,
  },
});