import { SafeAreaView, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useState,useEffect } from 'react'
import * as Location from 'expo-location';

export default function App() {

  const [viewport, setViewport] = useState(<View><Text>Cargando...</Text></View>);
  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Para usar la app cómodamente, permite el acceso a la configuración');
        return;
      }
      setViewport(
        <WebView
          style={{ flex: 1 }}
          source={{ uri: 'https://bee6-2800-a4-3313-7000-9cd1-739c-8a26-17bf.sa.ngrok.io/' }}
          javaScriptEnabled = {true}
          geolocationEnabled={true}
        />)
    } catch (err) {
    console.warn(err);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  },[]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {viewport}
      </SafeAreaView>
  );
}

