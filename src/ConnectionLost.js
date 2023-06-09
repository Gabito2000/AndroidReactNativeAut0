import * as React from "react";
import { View, StyleSheet,Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


export const ConnectionLost = () => {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name="access-point-network-off" size={100} />
            <Text style={styles.head}>Ups! Parece que no tienes conexión a internet</Text>
            <Text>Activa tus datos o utiliza Wifi para acceder a la App</Text>
        </View>
    )
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
    }

  });