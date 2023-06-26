import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { LocationSender } from './LocationSender';

const baseUrl = "http://cargauy-tse23.web.elasticloud.uy" //TODO PONER TODO ESTO EN UN SOLO LADO
const urlViajes = baseUrl + "/services/rest/viaje"

const idChofer = 1;

let trips = [
];

const returnViajesFromGuiaViajes = () => {
  const viajes = new Map();
  trips.forEach((trip) => {
    if (viajes.get(trip.guia_viaje.id) === undefined) {
      viajes.set(trip.guia_viaje.id, new Map());
    }
    viajes.get(trip.guia_viaje.id).set(trip.viaje.id, trip.viaje);
  });
  return viajes;
};

const guia_viajes = trips.map((trip) => trip.guia_viaje);

const viajes = returnViajesFromGuiaViajes();

export const PantallaReact = (tokenObj) => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripStarted, setTripStarted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  let token = tokenObj.token;

  const cambiarEstado = (idViaje, estado) => {
    let url = baseUrl + "/services/rest/viaje/" + idViaje + "?estado=" + estado;
    console.log(url);
    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: token,
      },
    }).then((response) => {
      if (response.ok) {
        console.log("Estado cambiado");
      } else {
        console.log("Error al cambiar estado");
      }
    }
    );
  }

  const handleStartTrip = () => {
    // Code to start the selected trip
    setTripStarted(true);
    cambiarEstado(selectedTrip, "COMENZADO");
  };

  const handleCancelTrip = () => {
    // Code to cancel the selected trip
    setSelectedTrip(null);
    setTripStarted(false);
    cambiarEstado(selectedTrip, "CANCELADO");
  };

  const handleEndTrip = () => {
    // Code to end the selected trip
    setTripStarted(false);
    cambiarEstado(selectedTrip, "FINALIZADO");
    onRefresh();
  };

  const renderTripDetails = () => {
    if (!selectedTrip) return null;

    const trip = trips.find((t) => t.viaje.id === selectedTrip);

    return (
      <View style={styles.tripDetailsContainer}>
        <Text style={styles.tripDetailsText}>Viaje Detalles:</Text>
        <Text style={styles.tripDetailsText}>Origen: {trip.guia_viaje.origen}</Text>
        <Text style={styles.tripDetailsText}>Destino: {trip.guia_viaje.destino}</Text>
        <Text style={styles.tripDetailsText}>Fecha: {trip.guia_viaje.fechaHora}</Text>
        <Text style={styles.tripDetailsText}>Tipo: {trip.guia_viaje.tipoCarga}</Text>
        <Text style={styles.tripDetailsText}>Categoría: {trip.guia_viaje.rubroCarga}</Text>
        <Text style={styles.tripDetailsText}>Volumen: {trip.guia_viaje.volumenCarga}</Text>
        <Text style={styles.tripDetailsText}>ID: {trip.viaje.id}</Text>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Code to refresh the list
    fetch(urlViajes, {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
      },
    }).then((response) => {
      return response.json();
    }).then((viajes) => {
      console.log(viajes);
      trips = viajes.sort((a, b) => {
        return a.viaje.id - b.viaje.id;
      });
      setRefreshing(false);
    });
  };

  //executes one time when the component is mounted
  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        {!tripStarted && (
          <>
            <Text style={styles.heading}>Elige un Viaje:</Text>
            <SafeAreaView style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>ID</Text>
                <Text style={styles.tableHeader}>Origen</Text>
                <Text style={styles.tableHeader}>Destino</Text>
                <Text style={styles.tableHeader}>Fecha</Text>
                <Text style={styles.tableHeader}>Chapa</Text>
                <Text style={styles.tableHeader}>Estado</Text>
              </View>
              {trips.map((item) => {return (
                  <TouchableOpacity key={item.viaje.id} onPress={() => {item.viaje.id === selectedTrip ? setSelectedTrip(null) : setSelectedTrip(item.viaje.id)}}>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>{`${item.viaje.id}`}</Text>
                      <Text style={styles.tableCell}>{`${item.guia_viaje.origen}`}</Text>
                      <Text style={styles.tableCell}>{`${item.guia_viaje.destino}`}</Text>
                      <Text style={styles.tableCell}>{`${item.guia_viaje.fechaHora}`}</Text>
                      <Text style={styles.tableCell}>{`${item.viaje.idVehiculo}`}</Text>
                      <Text style={styles.tableCell}>{`${item.viaje.estado}`}</Text>
                    </View>
                    {selectedTrip && (selectedTrip == item.viaje.id) && (
                      <View style={styles.tripContainer}>
                        {renderTripDetails()}
                        <Button title="Empezar Viaje" onPress={handleStartTrip} />
                      </View>
                    )}
                    {/* add black line */}
                    <View style={{ height: 1, backgroundColor: 'black' }} />
                  </TouchableOpacity>
              )})}
            </SafeAreaView>
          </>
        )}
        {tripStarted && (
          <View style={styles.tripContainer}>
            {renderTripDetails()}
            <Text>Viaje comenzado!</Text>
            <LocationSender idViaje={selectedTrip} />
            <View style={styles.buttonContainer}>
              <View style={styles.buttonContainer}>
                <Button title="Cancelar Viaje" onPress={handleCancelTrip} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Terminar Viaje" onPress={handleEndTrip} />
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  tripContainer: {
    width: '100%', // Take up the full width
    height: 'auto',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  tableContainer: {
    marginBottom: 20,
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  tripDetailsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  tripDetailsText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  titleCell: {
    fontWeight: 'bold',
  },
});
