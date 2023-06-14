import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { LocationSender } from './LocationSender';

const baseUrl = "http://cargauy-tse23.web.elasticloud.uy" //TODO PONER TODO ESTO EN UN SOLO LADO
const urlViajes = baseUrl + "/services/rest/viaje"

const idChofer = 1;

let trips = [
  {
    "guia_viaje": {
      "destino": "Colonia",
      "fechaHora": "17/09/2021 10:00",
      "id": 1,
      "idViajes": [17],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 10.17
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "17/09/2021 10:00",
      "id": 1,
      "idChoferes": [1],
      "idGuiaViaje": 1,
      "idVehiculo": 1
    }
  },
  {
    "guia_viaje": {
      "destino": "Buenos Aires",
      "fechaHora": "20/09/2021 14:30",
      "id": 2,
      "idViajes": [21],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 15.8
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "20/09/2021 14:30",
      "id": 21,
      "idChoferes": [1],
      "idGuiaViaje": 2,
      "idVehiculo": 3
    }
  },
  {
    "guia_viaje": {
      "destino": "Punta del Este",
      "fechaHora": "25/09/2021 08:00",
      "id": 3,
      "idViajes": [31],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 7.2
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "25/09/2021 08:00",
      "id": 31,
      "idChoferes": [1],
      "idGuiaViaje": 3,
      "idVehiculo": 2
    }
  },
  {
    "guia_viaje": {
      "destino": "Salto",
      "fechaHora": "30/09/2021 12:15",
      "id": 4,
      "idViajes": [42],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 12.5
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "30/09/2021 12:15",
      "id": 42,
      "idChoferes": [1],
      "idGuiaViaje": 4,
      "idVehiculo": 5
    }
  },
  {
    "guia_viaje": {
      "destino": "Rivera",
      "fechaHora": "05/10/2021 16:45",
      "id": 5,
      "idViajes": [52],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 9.3
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "05/10/2021 16:45",
      "id": 52,
      "idChoferes": [5],
      "idGuiaViaje": 5,
      "idVehiculo": 4
    }
  },
  // Additional items
  {
    "guia_viaje": {
      "destino": "Tacuarembó",
      "fechaHora": "10/10/2021 09:30",
      "id": 6,
      "idViajes": [61],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 8.7
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "10/10/2021 09:30",
      "id": 61,
      "idChoferes": [3],
      "idGuiaViaje": 6,
      "idVehiculo": 2
    }
  },
  {
    "guia_viaje": {
      "destino": "Maldonado",
      "fechaHora": "15/10/2021 14:45",
      "id": 7,
      "idViajes": [73],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 11.2
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "15/10/2021 14:45",
      "id": 73,
      "idChoferes": [2],
      "idGuiaViaje": 7,
      "idVehiculo": 1
    }
  },
  {
    "guia_viaje": {
      "destino": "Artigas",
      "fechaHora": "20/10/2021 11:30",
      "id": 8,
      "idViajes": [85],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 6.5
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "20/10/2021 11:30",
      "id": 85,
      "idChoferes": [4],
      "idGuiaViaje": 8,
      "idVehiculo": 3
    }
  },
  {
    "guia_viaje": {
      "destino": "Treinta y Tres",
      "fechaHora": "25/10/2021 16:15",
      "id": 9,
      "idViajes": [92],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 13.1
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "25/10/2021 16:15",
      "id": 92,
      "idChoferes": [5],
      "idGuiaViaje": 9,
      "idVehiculo": 4
    }
  },
  {
    "guia_viaje": {
      "destino": "Rocha",
      "fechaHora": "30/10/2021 13:45",
      "id": 10,
      "idViajes": [105],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 9.8
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "30/10/2021 13:45",
      "id": 105,
      "idChoferes": [3],
      "idGuiaViaje": 10,
      "idVehiculo": 5
    }
  },
  {
    "guia_viaje": {
      "destino": "Durazno",
      "fechaHora": "05/11/2021 09:00",
      "id": 11,
      "idViajes": [118],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 7.9
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "05/11/2021 09:00",
      "id": 118,
      "idChoferes": [2],
      "idGuiaViaje": 11,
      "idVehiculo": 1
    }
  },
  {
    "guia_viaje": {
      "destino": "Canelones",
      "fechaHora": "10/11/2021 15:30",
      "id": 12,
      "idViajes": [122],
      "origen": "Montevideo",
      "rubroCarga": "Carga general",
      "tipoCarga": "Carga general",
      "volumenCarga": 10.5
    },
    "viaje": {
      "estado": "EN_CURSO",
      "fechaHoraFin": null,
      "fechaHoraInicio": "10/11/2021 15:30",
      "id": 122,
      "idChoferes": [4],
      "idGuiaViaje": 12,
      "idVehiculo": 3
    }
  },
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
      trips = viajes;
      setRefreshing(false);
    }
    );
    
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
                <Text style={styles.tableHeader}>Origen</Text>
                <Text style={styles.tableHeader}>Destino</Text>
                <Text style={styles.tableHeader}>Fecha</Text>
                <Text style={styles.tableHeader}>Chapa</Text>
                <Text style={styles.tableHeader}>Estado</Text>
              </View>
              {trips.map((item) => {return (
                  <TouchableOpacity key={item.viaje.id} onPress={() => {item.viaje.id === selectedTrip ? setSelectedTrip(null) : setSelectedTrip(item.viaje.id)}}>
                    <View style={styles.tableRow}>
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
