import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { TextInput } from 'react-native-gesture-handler';

export default function ListaRegistrosVotos() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    estado: '',
    municipio: '',
    parroquia: '',
    organizacion: '',
    cedula: ''
  });
  const [opcionesFiltro, setOpcionesFiltro] = useState({
    estados: [],
    municipios: [],
    parroquias: []
  });
  const [estadisticas, setEstadisticas] = useState(null);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);

  const token = 'faa3dc480981bbfb734839367d2c9367';

 useEffect(() => {
  cargarRegistros();
}, []);

 useEffect(() => {
  if (registros.length > 0) {
    extraerOpcionesFiltros();
    generarEstadisticas(); 
  }
}, [registros, filtros]); 

  const extraerOpcionesFiltros = () => {
    const estadosUnicos = [...new Set(registros.map(r => r.votante_estado))].filter(Boolean);
    const municipiosUnicos = [...new Set(registros.map(r => r.votante_municipio))].filter(Boolean);
    const parroquiasUnicas = [...new Set(registros.map(r => r.votante_parroquia))].filter(Boolean);
    

    setOpcionesFiltro({
      estados: estadosUnicos,
      municipios: municipiosUnicos,
      parroquias: parroquiasUnicas
    });
  };

  const cargarRegistros = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://comunajoven.com.ve/api/Cosultarigitro?', {
        headers: {
          'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'



        }
      });

      console.log(response.data);
      setRegistros(response.data || []);
       extraerOpcionesFiltros();
        generarEstadisticas();
    } catch (error) {
      console.error('Error cargando registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarRegistros = () => {
    return registros.filter(registro => {
        const cedulaCompleta = `${registro.nacionalidad}-${registro.cedula}`;
      return (
        (!filtros.estado || registro.votante_estado === filtros.estado) &&
        (!filtros.municipio || registro.votante_municipio === filtros.municipio) &&
        (!filtros.parroquia || registro.votante_parroquia === filtros.parroquia) &&
        (!filtros.organizacion || registro.organizacion === filtros.organizacion)&&
        (!filtros.cedula || cedulaCompleta.includes(filtros.cedula))
      );
    });
  };

const generarEstadisticas = () => {
  const registrosFiltrados = filtrarRegistros();
  
  const stats = {
    total: registrosFiltrados.length,
    votaron: registrosFiltrados.filter(r => r.voto).length,
    noVotaron: registrosFiltrados.filter(r => !r.voto).length,
    porcentajeVotaron: registrosFiltrados.length > 0 ? Math.round((registrosFiltrados.filter(r => r.voto).length / registrosFiltrados.length * 100)): 0,
    porEstado: {},
    porMunicipio: {},
    porParroquia: {},
    porOrganizacion: {},
    filtrosAplicados: {
      estado: filtros.estado || 'Todos',
      municipio: filtros.municipio || 'Todos',
      parroquia: filtros.parroquia || 'Todos',
      organizacion: filtros.organizacion || 'Todas'
    }
  };

  // Solo calcular desgloses si no hay filtros aplicados (o para niveles superiores)
  if (!filtros.estado) {
    registrosFiltrados.forEach(registro => {
      if (registro.votante_estado) {
        stats.porEstado[registro.votante_estado] = (stats.porEstado[registro.votante_estado] || 0) + 1;
      }
    });
  }

  if (!filtros.municipio) {
    registrosFiltrados.forEach(registro => {
      if (registro.votante_municipio) {
        stats.porMunicipio[registro.votante_municipio] = (stats.porMunicipio[registro.votante_municipio] || 0) + 1;
      }
    });
  }

  if (!filtros.parroquia) {
    registrosFiltrados.forEach(registro => {
      if (registro.votante_parroquia) {
        stats.porParroquia[registro.votante_parroquia] = (stats.porParroquia[registro.votante_parroquia] || 0) + 1;
      }
    });
  }

  if (!filtros.organizacion) {
    registrosFiltrados.forEach(registro => {
      if (registro.organizacion) {
        stats.porOrganizacion[registro.organizacion] = (stats.porOrganizacion[registro.organizacion] || 0) + 1;
      }
    });
  }

  setEstadisticas(stats);
};

  const limpiarFiltros = () => {
    setFiltros({
      estado: '',
      municipio: '',
      parroquia: '',
      organizacion: ''
    });
  };

  const registrosMostrados = filtrarRegistros();

return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Votos Regitrados</Text>
        
        {/* Filtros */}
        <View style={[styles.filtrosContainer, {shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8}]}>
            <Text style={[styles.label, {fontSize: 18, marginBottom: 10}]}>Filtrar por:</Text>

            <TextInput
            style={styles.input}
            placeholder="Buscar por cédula (ej: V-12345678)"
            value={filtros.cedula}
            onChangeText={(text) => setFiltros({...filtros, cedula: text})}
            keyboardType="default"
            autoCapitalize="characters"
        />

            
            
            <View style={{marginBottom: 10}}>
                <Text style={styles.label}>Estado</Text>
                <Picker
                    selectedValue={filtros.estado}
                    style={styles.picker}
                    onValueChange={(itemValue) => setFiltros({...filtros, estado: itemValue, municipio: '', parroquia: ''})}>
                    <Picker.Item label="Todos los estados" value="" />
                    {opcionesFiltro.estados.map((estado, index) => (
                        <Picker.Item key={`estado-${index}`} label={estado} value={estado} />
                    ))}
                </Picker>
            </View>

            <View style={{marginBottom: 10}}>
                <Text style={styles.label}>Municipio</Text>
                <Picker
                    selectedValue={filtros.municipio}
                    style={styles.picker}
                    onValueChange={(itemValue) => setFiltros({...filtros, municipio: itemValue, parroquia: ''})}>
                    <Picker.Item label="Todos los municipios" value="" />
                    {opcionesFiltro.municipios
                        .filter(municipio => !filtros.estado || registros.some(r => r.votante_estado === filtros.estado && r.votante_municipio === municipio))
                        .map((municipio, index) => (
                            <Picker.Item key={`municipio-${index}`} label={municipio} value={municipio} />
                        ))}
                </Picker>
            </View>

            <View style={{marginBottom: 10}}>
                <Text style={styles.label}>Parroquia</Text>
                <Picker
                    selectedValue={filtros.parroquia}
                    style={styles.picker}
                    onValueChange={(itemValue) => setFiltros({...filtros, parroquia: itemValue})}>
                    <Picker.Item label="Todas las parroquias" value="" />
                    {opcionesFiltro.parroquias
                        .filter(parroquia => {
                            if (!filtros.estado && !filtros.municipio) return true;
                            return registros.some(r => 
                                (!filtros.estado || r.votante_estado === filtros.estado) &&
                                (!filtros.municipio || r.votante_municipio === filtros.municipio) &&
                                r.votante_parroquia === parroquia
                            );
                        })
                        .map((parroquia, index) => (
                            <Picker.Item key={`parroquia-${index}`} label={parroquia} value={parroquia} />
                        ))}
                </Picker>
            </View>

            <View style={{marginBottom: 10}}>
                <Text style={styles.label}>Organización</Text>
                <Picker
                    selectedValue={filtros.organizacion}
                    style={styles.picker}
                    onValueChange={(itemValue) => setFiltros({...filtros, organizacion: itemValue})}>
                    <Picker.Item label="Todas las organizaciones" value="" />
                    <Picker.Item label="Comuna joven" value="Comuna joven" />
                    <Picker.Item label="Una mujer" value="Una mujer" />
                </Picker>
            </View>

            <View style={styles.buttonGroup}>
                <View style={{flex: 1, marginRight: 5}}>
                    <Button 
                        title="Actualizar Datos" 
                        onPress={cargarRegistros} 
                        color="#2196F3"
                    />
                </View>
                <View style={{flex: 1, marginHorizontal: 5}}>
                    <Button 
                        title="Limpiar Filtros" 
                        onPress={limpiarFiltros} 
                        color="#757575" 
                    />
                </View>
                <View style={{flex: 1, marginLeft: 5}}>
                    <Button 
                        title={mostrarEstadisticas ? "Ocultar" : "Estadísticas"} 
                        onPress={() => setMostrarEstadisticas(!mostrarEstadisticas)} 
                        color="#2196F3"
                    />
                </View>
            </View>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#2196F3" style={{marginTop: 40}} />
        ) : (
            <>
                {/* Estadísticas */}
       {mostrarEstadisticas && estadisticas && (
  <View style={styles.estadisticasContainer}>
    <Text style={styles.subtitle}>Estadísticas </Text>
    
    {/* Resumen principal */}
    <View style={styles.resumenContainer}>
      <Text style={styles.filtrosAplicados}>

      </Text>
      
      <View style={styles.statRow}>
        <Text style={styles.label}>Total registros:</Text>
        <Text style={styles.statValue}>{estadisticas.total}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={{color: '#388e3c'}}>Votaron:</Text>
        <Text style={styles.statValue}>{estadisticas.votaron}</Text>
      </View>
      
     <View style={styles.statRow}>
        <Text style={{color: '#d32f2f'}}>No votaron:</Text>
        <Text style={styles.statValue}>{estadisticas.noVotaron}</Text>
      </View>
    </View>

    {/* Desgloses condicionales */}
    <View >
      <ScrollView style={styles.scrollEstadisticas}>
        {!filtros.estado && Object.keys(estadisticas.porEstado).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Distribución por Estado</Text>
            {Object.entries(estadisticas.porEstado)
              .sort((a, b) => b[1] - a[1])
              .map(([estado, count]) => (
                <View key={estado} style={styles.statRow}>
                  <Text>{estado}</Text>
                  <Text>{count}</Text>
                </View>
              ))}
          </>
        )}

        {!filtros.municipio && Object.keys(estadisticas.porMunicipio).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Distribución por Municipio</Text>
            {Object.entries(estadisticas.porMunicipio)
              .sort((a, b) => b[1] - a[1])
              .map(([municipio, count]) => (
                <View key={municipio} style={styles.statRow}>
                  <Text>{municipio}</Text>
                  <Text>{count}</Text>
                </View>
              ))}
          </>
        )}

        {Object.keys(estadisticas.porOrganizacion).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Por Organización:</Text>
            {Object.entries(estadisticas.porOrganizacion).map(([org, count]) => (
              <View key={org} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>{org}</Text>
                <Text>{count}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  </View>
)}
                <Text style={[styles.subtitle, {marginBottom: 10}]}>Registros ({registrosMostrados.length})</Text>
                {registrosMostrados.length === 0 ? (
                    <Text style={{textAlign: 'center', color: '#888', marginTop: 30}}>No hay registros que coincidan con los filtros</Text>
                ) : (
                    registrosMostrados.map((registro, index) => (
                        <View key={index} style={[styles.registroContainer, {borderLeftWidth: 5, borderLeftColor: registro.voto ? '#388e3c' : '#d32f2f', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6}]}>
                            <Text style={[styles.registroTitle, {color: '#1976d2'}]}>{registro.votante_name}</Text>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4}}>
                                <Text style={{fontWeight: 'bold'}}>Cédula: </Text>
                                <Text>{registro.cedula}</Text>
                            </View>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4}}>
                                <Text style={{fontWeight: 'bold'}}>Estado: </Text>
                                <Text>{registro.votante_estado || 'N/A'}</Text>
                            </View>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4}}>
                                <Text style={{fontWeight: 'bold'}}>Municipio: </Text>
                                <Text>{registro.votante_municipio || 'N/A'}</Text>
                            </View>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4}}>
                                <Text style={{fontWeight: 'bold'}}>Parroquia: </Text>
                                <Text>{registro.votante_parroquia || 'N/A'}</Text>
                            </View>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4}}>
                                <Text style={{fontWeight: 'bold'}}>Centro: </Text>
                                <Text>{registro.centro_votacion || 'N/A'}</Text>
                            </View>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4}}>
                                <Text style={{fontWeight: 'bold'}}>Organización: </Text>
                                <Text>{registro.organizacion || 'N/A'}</Text>
                            </View>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4}}>
                                <Text style={{fontWeight: 'bold'}}>Votó: </Text>
                                <Text style={{color: registro.voto ? '#388e3c' : '#d32f2f', fontWeight: 'bold'}}>
                                    {registro.voto ? 'Sí' : 'No'}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4}}>
                                <Text style={{fontWeight: 'bold'}}>Fecha: </Text>
                                <Text>{new Date(registro.fecha_registro).toLocaleString()}</Text>
                            </View>
                            {registro.observaciones && (
                                <View style={{marginTop: 4}}>
                                    <Text style={{fontWeight: 'bold'}}>Observaciones: </Text>
                                    <Text>{registro.observaciones}</Text>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </>
        )}
    </ScrollView>
);
}

// Estilos permanecen iguales
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  actualizacion: {
  fontSize: 12,
  color: '#666',
  textAlign: 'right',
  marginTop: 5
},
    resumenContainer: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },

   filtrosAplicados: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 10,
    fontStyle: 'italic'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  statValue: {
    fontWeight: 'bold'
  },
  input: {
  height: 40,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 5,
  paddingHorizontal: 10,
  marginBottom: 15,
  backgroundColor: '#fff'
},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#444',
  },
  filtrosContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
    fontWeight: '500',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  estadisticasContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    maxHeight: 400, // Altura máxima fija
  },
  registroContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  registroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
});