import { ActivityIndicator, BackHandler, Dimensions, SafeAreaView, View, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import NetInfo from "@react-native-community/netinfo";
import { ConnectionLost } from './ConnectionLost';

export default function App() {
  const [viewport, setViewport] = useState(<View></View>);
  const [visible, setVisible] = useState(true);
  const webViewRef = useRef();
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
  useEffect(() => {
    // Retorna funcion para borrar el evento.
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected){
        setViewport(
          <WebView
            onLoad={() => hideSpinner()}
            style={{ flex: 1 }}
            source={{ uri: 'https://apexweb.2d979ceb.nip.io/' }}
            javaScriptEnabled = {true}
            geolocationEnabled={true}
            setBuiltInZoomControls={false}
            ref={webViewRef}
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

  const hideSpinner = () => {
      setVisible(false);
    };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {viewport}
      {visible && (
        <ActivityIndicator
          style={{ position: "absolute", top: Dimensions.get('window').height/2-18, left: Dimensions.get('window').width/2-18 }}
          size="large"
        />
      )}
      </SafeAreaView>
  );

}

