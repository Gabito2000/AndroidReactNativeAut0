import { ActivityIndicator, BackHandler, Dimensions, SafeAreaView, View, Text, Alert, Picker, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import NetInfo from "@react-native-community/netinfo";
import { ConnectionLost } from './src/ConnectionLost';
import { PantallaReact } from './src/PantallaReact';
export default function App() {
  const [viewport, setViewport] = useState(<ActivityIndicator size="large" color="#0000ff" />);
  const [visible, setVisible] = useState(true);
  const webViewRef = useRef();
  const [token, setToken] = useState(null);
  const [location, setLocation] = useState(null);
  const callbackUrl = 'http://localhost:8080';
  const handleBackButtonPress = () => {
    try {
        webViewRef.current?.goBack()
        return true
    } catch (err) {
        console.log("[handleBackButtonPress] Error : ", err.message)
    }
  }
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonPress)
    return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackButtonPress)
    };
  }, []);
  const onCallbackSaveTocken = (navState)=>{
    console.log ('navState', navState);
    if (navState.url.startsWith(callbackUrl)) {
      setViewport(<PantallaReact />);
    }
  }
  useEffect(() => {
    // Retorna funcion para borrar el evento.
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected){
        setViewport(<WebView
          onLoad={() => hideSpinner()}
          style={{ flex: 1 }}
          source={{ uri: 'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?&scope=openid%20personal_info%20email%20document&client_id=890192&response_type=code&redirect_uri=http://localhost:8080' }}
          javaScriptEnabled = {true}
          geolocationEnabled={true}
          setBuiltInZoomControls={false}
          ref={webViewRef}
          onNavigationStateChange={onCallbackSaveTocken}
        />);
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

  const hideSpinner = () => {
      setVisible(false);
    };

  return (
    <SafeAreaView style={ { flex: 1} }>
      {viewport}
    </SafeAreaView>
  );

}

