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
          timeInterval: 5000, // Update every 5 seconds
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

      const timestamp = new Date().toISOString();
      const data = { latitude, longitude, timestamp, idViaje: 1 };

      // Send location data to server
      sendLocationData(data);

      // Store location data locally
      setLocationData(prevData => [...prevData, data]);
    };

    const sendLocationData = async (data) => {
      try {
        // Simulated server request
        console.log('Sending location data to server:', data);

        // Simulating request failure for demonstration purposes
        const isSuccess = Math.random() < 0.8; // 80% success rate
        if (!isSuccess) {
          throw new Error('Failed to send location data');
        }

        // Successfully sent to the server, remove from local storage
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
