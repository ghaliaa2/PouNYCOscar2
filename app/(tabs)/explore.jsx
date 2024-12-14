import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { fetchBathrooms } from '../../lib/appwrite';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '../../config.json';
import { useRouter } from 'expo-router'; // Using expo-router's useRouter hook


const Explore = () => {
  const router = useRouter(); // Access router for navigation
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bathrooms, setBathrooms] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 40.7128,
    longitude: -74.006,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBathroom, setSelectedBathroom] = useState(null);
  const [showPath, setShowPath] = useState(false);

  // Requests location permission by showing prompt to user(does not show on if already allowed), if allowed, attempt to obtain the user's location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(coords);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // Update the map with the user's location immediately
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch current location.');
    }
  };

  // load the pins for the bathrooms by grabbing them from the database in appwrite
  const loadBathroomPins = async () => {
    try {
      // obtain information on bathrooms from appwrite
      const data = await fetchBathrooms();
      //convert bathroom data(address) into usable geolocation data through openstreetmap, then 
      const pins = await Promise.all(
        data.map(async (bathroom) => {
          const { address, bathroomName, description } = bathroom;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                address
              )}`
            );
            const geocodeData = await response.json();

            if (geocodeData.length > 0) {
              const { lat, lon } = geocodeData[0];
              return {
                name: bathroomName,
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                description,
              };
            } else {
              console.warn(`Geocoding failed for address: ${address}`);
              return null;
            }
          } catch (error) {
            console.error('Error geocoding address:', address, error.message);
            return null;
          }
        })
      );

      setBathrooms(pins.filter((pin) => pin !== null));
    } catch (error) {
      console.error('Error fetching bathroom locations:', error.message);
      Alert.alert('Error', 'Failed to load bathroom pins from the database.');
    }
  };

  //Used to manually trigger loading of bathroom pins during revisit of explore page
  const updateBathroomPinsManually = async () => {
    await loadBathroomPins(); 
    setIsLoading(false);  // Hide the loading spinner once the data is fetched
  };

  // Run when the screen loads
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getLocation(); // Get the user's location
      await updateBathroomPinsManually(); // Fetch bathroom pins
    };
    fetchData();
  }, []);

  //Centers the map to the user's current location
  const centerMapOnLocation = () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Unable to center on your location.');
      return;
    }

    mapRef.current.animateToRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  //Pans the map to the specified address
  const searchAddress = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter an address to search.');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        mapRef.current.animateToRegion({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        Keyboard.dismiss();
      } else {
        Alert.alert('No Results', 'Address not found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search for the address.');
    }
  };

  //Draws a walking path to selected bathroom pin from the user's current location
  const handleNavigateTo = () => {
    if (!selectedBathroom) {
      Alert.alert('Error', 'Please select a bathroom to navigate to.');
      return;
    }
    setShowPath((prevState) => !prevState);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: 'white', marginTop: 10 }}>Fetching location...</Text>
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Search for an address"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchAddress}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {bathrooms.map((bathroom, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: bathroom.latitude, longitude: bathroom.longitude }}
              title={bathroom.name}
              description={bathroom.description}
              onPress={() => setSelectedBathroom(bathroom)}
            />
          ))}

          {currentLocation && (
            <Circle
              center={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              radius={50}
              strokeColor="rgba(0, 122, 255, 0.7)"
              fillColor="rgba(0, 122, 255, 0.3)"
            />
          )}

          {showPath && selectedBathroom && currentLocation && (
            <MapViewDirections
              origin={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              destination={{
                latitude: selectedBathroom.latitude,
                longitude: selectedBathroom.longitude,
              }}
              mode="WALKING"
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="hotpink"
            />
          )}
        </MapView>

        <TouchableOpacity style={styles.navigateButton} onPress={handleNavigateTo}>
          <Text style={styles.buttonText}>{showPath ? 'Hide Path' : 'Navigate to'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerButton} onPress={centerMapOnLocation}>
          <Text style={styles.buttonText}>Center</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  navigateButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  centerButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
});

export default Explore;
