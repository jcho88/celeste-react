import { StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';

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
		alignContent: 'flex-end',
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginHorizontal: 10,
	},
	addIcon: {
		color: 'black',
		alignContent: 'flex-start',
	},
	menu: {
		color: 'black',
		alignContent: 'flex-end',
	},
	headerText: {
		flex: 1,
		flexGrow: 1,
		fontSize: 18,
		margin: 5,
		// color: '#007AFF',
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

export default function MainMapScreen({ navigation }: RootTabScreenProps<'MainMap'>) {
	const [places, setPlaces] = useState(placesData);

	const initialRegion = {
		latitude: 29.955105,
		longitude: -90.067493,
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
				<View style={styles.separator}>
					<Ionicons
						style={styles.addIcon}
						name="add-circle-outline"
						size={32}
						onPress={() => {
							navigation.navigate('AddNewPlace', { initialRegion: region });
						}}
					/>
					<Text style={styles.headerText}>Home</Text>
					<Ionicons
						style={styles.menu}
						name="menu"
						size={32}
						onPress={() => {
							setShowList(!showList);
						}}
					/>
				</View>
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
					GooglePlacesDetailsQuery={{ fields: 'name,geometry,formatted_address' }}
					fetchDetails={true} // you need this to fetch the details object onPress
					enablePoweredByContainer={false}
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
							name: details.name,
							address: details.formatted_address,
							latitude: details.geometry.location.lat,
							longitude: details.geometry.location.lng,
							description: '',
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
