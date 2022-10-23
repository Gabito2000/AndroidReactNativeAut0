import { SafeAreaView, View, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useState,useEffect } from 'react'
import * as Location from 'expo-location';
import NetInfo from "@react-native-community/netinfo";
import { ConnectionLost } from './ConnectionLost';


export default function App() {
  const [viewport, setViewport] = useState(<View><Text>Cargando...</Text></View>);
  
  useEffect(() => {
    // Retorna funcion para borrar el evento.
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected){
        setViewport(
          <WebView
            style={{ flex: 1 }}
            source={{ uri: 'https://apexweb.2d979ceb.nip.io/' }}
            javaScriptEnabled = {true}
            geolocationEnabled={true}
            setBuiltInZoomControls={false}
        />)
      } else {
        setViewport(<ConnectionLost />)
      }
    });

    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Localización",
          "Para una mejor experiencia, activa la ubicación de esta App desde la configuración de tu celular",
          [
            { text: "OK" }
          ]
        );
      }
    }
    requestLocationPermission();
    return () => unsubscribe();
  },[]);
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {viewport}
    </SafeAreaView>
  );

}

