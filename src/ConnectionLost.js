import * as React from "react";
import { View, StyleSheet,Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { ScrollView, RefreshControl, TextInput, Button, SafeAreaView } from "react-native";
import { PantallaReact } from './PantallaReact';
import { encode } from 'base-64';
import { useState, useEffect } from 'react';


export const ConnectionLost = (onConectionBack) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [viewport, setViewport] = useState(<Text>Loading</Text>);
    const handleCloseSesion = () => {
      setViewport(
        <>
          <ConnectionLost onConectionBack={onConectionBack.onConectionBack}/>
        </>
      );
    }


    const openGubUy = () =>{
      console.log("http://cargauy-tse23.web.elasticloud.uy/services/rest/gubUy/backdoor/"+input)
      fetch("http://cargauy-tse23.web.elasticloud.uy/services/rest/gubUy/backdoor/"+input,{method: 'GET'}).then(
        (responce)=>{
          return responce.text();
        }
      ).then((json)=>{
        console.log("json",json)
        token = encode(json.toString())
        console.log(token)
        console.log("setViewport", setViewport)
        setViewport(
          <>
            <PantallaReact token={token}/>
            <Button title="Cerrar Sesión" onPress={handleCloseSesion} />
          </>
          );
      })
    }
    const prueba = (t) =>{
      input =t 
    }
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      fetch("https://www.google.com")
      .then((response) => {
        console.log(onConectionBack)
        onConectionBack.onConectionBack();
      })
      .catch((error) => {
        console.log("error", error)
      });

      setRefreshing(false);


    }, []);

    useEffect (() => {
      setViewport (
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <View style={styles.container}>
              <MaterialCommunityIcons name="access-point-network-off" size={100} />
              <Text style={styles.head}>Ups! Parece que no tienes conexión a internet</Text>
              <Text>Activa tus datos o utiliza Wifi para acceder a la App</Text>
          </View>
          <View style={styles.container}>
            <TextInput onChangeText={prueba} style={styles.input}/>
            <Button onPress={openGubUy} title="Abrir GubUY"/>
          </View>
        </ScrollView>
      );
    }, []);
    
    

    return (
      <SafeAreaView style={ { flex: 1} }>
        {viewport}
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    head: {
      fontSize: 18,
      textAlign: "center",
      marginTop: 50,
      marginBottom: 10
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },

  });