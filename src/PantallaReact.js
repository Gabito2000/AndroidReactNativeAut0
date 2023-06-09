import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LocationSender } from './LocationSender';
const trips = [
  {
    id: 1,
    destination: 'Trip 1',
    details: 'Trip 1 details',
  },
  {
    id: 2,
    destination: 'Trip 2',
    details: 'Trip 2 details',
  },
  {
    id: 3,
    destination: 'Trip 3',
    details: 'Trip 3 details',
  },
];

export const PantallaReact = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripStarted, setTripStarted] = useState(false);

  const handleStartTrip = () => {
    // Code to start the selected trip
    setTripStarted(true);
  };

  const handleCancelTrip = () => {
    // Code to cancel the selected trip
    setSelectedTrip(null);
    setTripStarted(false);
  };

  const handleEndTrip = () => {
    // Code to end the selected trip
    setTripStarted(false);
  };

  const renderTripDetails = () => {
    if (!selectedTrip) return null;

    const trip = trips.find((t) => t.id === selectedTrip);

    return (
      <View style={styles.tripDetailsContainer}>
        <Text style={styles.tripDetailsText}>Trip Details:</Text>
        <Text style={styles.tripDetailsText}>Destination: {trip.destination}</Text>
        <Text style={styles.tripDetailsText}>Details: {trip.details}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      { !tripStarted && (
        <>
        <Text style={styles.heading}>Select a Trip:</Text>
          <Picker
            selectedValue={selectedTrip}
            onValueChange={(itemValue) => setSelectedTrip(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a trip" value={null} />
            {trips.map((trip) => (
              <Picker.Item key={trip.id} label={trip.destination} value={trip.id} />
            ))}
          </Picker>
        </>
       )
      }
      {selectedTrip && (
        <View style={styles.tripContainer}>
          {renderTripDetails()}
          {tripStarted ? (
            <>
              <Text>Trip Started!</Text>
              <LocationSender idViaje = {selectedTrip} />
              <View style={styles.buttonContainer}>
                <Button title="Cancel Trip" onPress={handleCancelTrip} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="End Trip" onPress={handleEndTrip} />
              </View>
            </>
          ) : (
            <Button title="Start Trip" onPress={handleStartTrip} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  picker: {
    width: 200,
    marginBottom: 20,
  },
  tripContainer: {
    alignItems: 'center',
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
});