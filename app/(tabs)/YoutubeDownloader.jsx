import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';


const YoutubeDownloader = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [loading, setLoading] = useState(false);

  const checkStorage = async () => {
  const freeDiskStorage = await FileSystem.getFreeDiskStorageAsync();
  const MIN_SPACE_REQUIRED = 500 * 1024 * 1024; // 500MB
  
  if (freeDiskStorage < MIN_SPACE_REQUIRED) {
    throw new Error('Espacio insuficiente en el dispositivo');
  }
};

const downloadVideo = async () => {
  const controller = new AbortController();
  let downloadResumable;

  const API_URL = 'http://192.168.0.104:3000/api/download'

  try {
    setLoading(true);
    
    // 1. Verificar conexión
    const networkState = await Network.getNetworkStateAsync();
    if (!networkState.isConnected) {
      throw new Error('Se requiere conexión a internet');
    }

    // 2. Configurar timeout
    const timeout = setTimeout(() => controller.abort(), 45000);

    // 3. Petición al servidor
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const result = await response.json();
    if (!result.downloadUrl) throw new Error('URL no válida');

    // 4. Configurar descarga
    const filePath = `${FileSystem.cacheDirectory}video_${Date.now()}.mp4`;
    downloadResumable = FileSystem.createDownloadResumable(
      result.downloadUrl,
      filePath,
      {},
      (progress) => {
        console.log(`Progreso: ${(progress.totalBytesWritten / progress.totalBytesExpectedToWrite * 100).toFixed(1)}%`);
      }
    );

    // 5. Ejecutar descarga
    const { uri } = await downloadResumable.downloadAsync();
    Alert.alert('Éxito', `Video descargado en: ${uri}`);

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Operación cancelada');
      // Opcional: Preguntar si quiere reintentar
    } else {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Error en la descarga');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Pega la URL de YouTube aquí"
        value={url}
        onChangeText={setUrl}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      <Button
        title={format === 'mp4' ? 'Descargar Video (MP4)' : 'Descargar Audio (MP3)'}
        onPress={() => setFormat(format === 'mp4' ? 'mp3' : 'mp4')}
      />
      
      <Button
        title={loading ? 'Descargando...' : 'Iniciar Descarga'}
        onPress={downloadVideo}
        disabled={loading || !url}
      />
    </View>
  );
};

export default YoutubeDownloader;