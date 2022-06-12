import { StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

// import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import React, { useState } from 'react';
import placesData from '../assets/resources/placesSample.json';
// import PlaceDetail from './PlaceDetail';

const GOOGLE_PLACES_API_KEY = Constants.manifest?.ios?.config?.googleMapsApiKey || '';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		...StyleSheet.absoluteFillObject,
		justifyContent: 'flex-start',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginHorizontal: 20,
	},
	separator: {
		width: '100%',
	},
	separatorText: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	map: {
		...StyleSheet.absoluteFillObject,
		marginTop: 50,
	},
	list: {
		...StyleSheet.absoluteFillObject,
		marginTop: 100,
		backgroundColor: 'white',
		width: '100%',
	},
});

export default function MainMapScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
	const [places, setPlaces] = useState(placesData);

	const initialRegion = {
		latitude: 40.75251018277572,
		longitude: -73.97984077693457,
		latitudeDelta: 0.1,
		longitudeDelta: 0.1,
	};
	const [region, setRegion] = useState(initialRegion);

	const [showList, setShowList] = useState(false);

	return (
		<>
			<View style={styles.container}>
				<MapView
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					showsUserLocation={true}
					initialRegion={initialRegion}
					onRegionChangeComplete={(region) => setRegion(region)}
				>
					{places.map((marker, index) => (
						<Marker
							key={index}
							coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
							title={marker.title}
							description={marker.description}
						/>
					))}
				</MapView>
				<TouchableOpacity
					style={styles.separator}
					// lightColor="#eee"
					// darkColor="rgba(255,255,255,0.1)"
					onPress={() => {
						setShowList(!showList);
					}}
				>
					<Text style={styles.separatorText}>Toggle List</Text>
				</TouchableOpacity>
				{showList && (
					<ScrollView style={styles.list}>
						{places.map((place, index) => (
							<Pressable
								key={index}
								onPress={() => {
									navigation.navigate('PlaceDetail', place);
								}}
							>
								<Text style={styles.title}>{place.name}</Text>
							</Pressable>
						))}
					</ScrollView>
				)}
				<GooglePlacesAutocomplete
					GooglePlacesDetailsQuery={{ fields: 'geometry' }}
					fetchDetails={true} // you need this to fetch the details object onPress
					placeholder="Search"
					query={{
						key: GOOGLE_PLACES_API_KEY,
						location: `${region.latitude},${region.longitude}`,
						radius: 11 * region.longitudeDelta,
						language: 'en',
					}}
					debounce={900}
					onPress={(data, details: any = null) => {
						// console.log('SEARCH DATA: ', data);
						// console.log('SEARCH DETAILS: ', details);
						const place = {
							name: data.structured_formatting.main_text,
							title: data.structured_formatting.main_text,
							latitude: details.geometry.location.lat,
							longitude: details.geometry.location.lng,
							description: data.description,
							category: '',
							date: '',
						};
						navigation.navigate('PlaceDetail', place);
						// setPlaces(places)
					}}
					onFail={(error) => console.error('SEARCH ERROR: ', error)}
				/>
			</View>
			{/* <View style={styles.container}>
        <Text style={styles.title}>Tab One</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="/screens/MainMapScreen.tsx" />
      </View> */}
		</>
	);
}
