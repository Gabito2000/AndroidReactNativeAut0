import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

export const LocationSender = (idViaje) => {
  const [locationData, setLocationData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;

    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        const { granted: backgroundGranted } = await Location.requestBackgroundPermissionsAsync();
        if (!backgroundGranted) {
          setError('Permission to access location in the background was denied');
          return;
        }

        const options = {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 10000, // Update every 60 seconds
          distanceInterval: 0, // Update on any distance change
          pausesUpdatesAutomatically: false, // Continue updates in the background
        };

        // Start background location updates
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, options);

        // Get initial location
        const location = await Location.getLastKnownPositionAsync({});
        if (location) {
          handleLocationUpdate(location);
        }
      } catch (err) {
        console.log('Error starting location updates:', err);
        setError('Error starting location updates');
      }
    };

    const handleLocationUpdate = (location) => {
      const { latitude, longitude } = location.coords;

      let timestamp = new Date().toISOString();
      //convert timestamp to yyyy-mm-dd hh:mm format

      timestamp  = timestamp.replace('T', ' ');
      timestamp  = timestamp.replace('Z', '');
      timestamp = timestamp.substring(0, timestamp.length - 4);

      const data = [
        {
          "fechaHora": timestamp,
          "idViaje": idViaje.idViaje,
          "posicion": {
            "latitud": latitude,
            "longitud": longitude
          }
        }
      ]
      // Send location data to server
      sendLocationData(data);

      // Store location data locally
      setLocationData(prevData => [...prevData, data]);
    };

    const sendLocationData = async (data) => {
      try {
        console.log('Sending location data to server:', JSON.stringify(data));
        console.log('Sending location data to server:', JSON.stringify([
          {
            "fechaHora": "2023-06-10 09:30:00",
            "idViaje": 1,
            "posicion": {
              "latitud": 37.7749,
              "longitud": -122.4194
            }
          }
        ]));

        await fetch('http://2d979ceb.nip.io:8080/cargauy-external/hello-servlet', {
          method: 'POST',
          headers: {
            'Content-Type': 'html/text',
          },
          body: JSON.stringify(data),
        }).then((response) => console.log("sending data response",response));


        setLocationData(prevData => prevData.filter(item => item !== data));
      } catch (err) {
        console.log('Error sending location data:', err);
      }
    };

    const locationTask = async ({ data, error }) => {
      if (error) {
        console.log('Error with background location task:', error);
        return;
      }

      if (data) {
        const { locations } = data;
        if (locations && locations.length > 0) {
          handleLocationUpdate(locations[0]);
        }
      }
    };

    TaskManager.defineTask(LOCATION_TASK_NAME, locationTask);

    // Start location updates on component mount
    startLocationUpdates();

    // Clean up task on component unmount
    return () => {
      clearInterval(interval);
      TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
    };
  }, []);

  return <></>;
};

export default LocationSender;
