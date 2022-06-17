import { StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';

// import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SearchBarWithAutocomplete, PredictionType } from '../components/SearchBarWithAutocomplete';
import { useDebounce } from '../hooks/useDebounce';

const GOOGLE_PLACES_API_KEY = Constants.manifest?.ios?.config?.googleMapsApiKey || '';

// https://medium.com/nerd-for-tech/react-native-custom-search-bar-with-google-places-autocomplete-api-69b1c98de6a0
const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

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
	search: {},
});

export default function AddNewPlace({ navigation, route }: RootTabScreenProps<'MainMap'>) {
	const props = route.params
		? route.params
		: {
				initialRegion: {
					latitude: 29.955105,
					longitude: -90.067493,
					latitudeDelta: 0.1,
					longitudeDelta: 0.1,
				},
		  };

	const initialPlaces: Place[] = [];

	const [places, setPlaces] = useState<Place[]>(initialPlaces);
	const [region, setRegion] = useState(props.initialRegion);
	const [showList, setShowList] = useState(false);
	const [search, setSearch] = useState({ term: '', fetchPredictions: false });
	const [predictions, setPredictions] = useState<PredictionType[]>([]);
	const [showPredictions, setShowPredictions] = useState<boolean>(true);

	/**
	 * Grab predictions on entering text
	 *    by sending request to Google Places API.
	 * API details: https://developers.google.com/maps/documentation/places/web-service/autocomplete
	 */
	const onChangeText = async () => {
		// console.log('TEXT CHANGED');
		// console.log(search.term);
		// console.log(search.fetchPredictions);
		setShowPredictions(true);
		if (search.term.trim() === '') {
			setPredictions([]);
			return;
		}
		if (!search.fetchPredictions) return;
		const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/autocomplete/json`;
		try {
			const result = await axios.request({
				method: 'get',
				url: apiUrl,
				params: {
					input: search.term,
					location: `${region.latitude},${region.longitude}`,
					radius: 11 * region.longitudeDelta,
					key: GOOGLE_PLACES_API_KEY,
				},
			});
			if (result) {
				const {
					data: { predictions },
				} = result;
				// console.log('GOT predictions:', predictions);
				setPredictions(predictions);
			}
		} catch (e) {
			console.log(e);
		}
	};
	useDebounce(onChangeText, 500, [search.term]);

	const mapPredictions = async () => {
		// console.log('MAPPING PREDICTINOS');
		if (predictions) {
			// console.log('FOUND PREDICTIONS TO MAP');
			const newPlaces: Place[] = [];
			let count = 0;
			for (const pred of predictions) {
				const placeId = pred.place_id;
				const response = await getPlaceDetails(placeId);
				if (response) {
					const placeDetails = response.data.result;
					newPlaces.push({
						id: count,
						name: placeDetails.name,
						// address: placeDetails.formatted_address,
						latitude: placeDetails.geometry.location.lat,
						longitude: placeDetails.geometry.location.lng,
					});
					count++;
				}
			}
			setPlaces(newPlaces);
			setShowPredictions(false);

			// console.log('PLACES:', newPlaces);
		}
	};

	/**
	 * Grab latitude and longitude on prediction tapped
	 *    by sending another request using the place id.
	 * You can check what kind of information you can get at:
	 *    https://developers.google.com/maps/documentation/places/web-service/details#PlaceDetailsRequests
	 */
	const getPlaceDetails = async (placeId: string) => {
		const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/details/json`;
		try {
			const result = await axios.request({
				method: 'get',
				url: apiUrl,
				params: {
					place_id: placeId,
					fields: 'formatted_address,name,geometry',
					key: GOOGLE_PLACES_API_KEY,
				},
			});
			return result;
			// if (result) {
			// 	const {
			// 		data: {
			// 			result: {
			// 				geometry: { location },
			// 			},
			// 		},
			// 	} = result;
			// 	const { lat, lng } = location;
			// }
		} catch (e) {
			console.log(e);
		}
	};

	const onPredictionTapped = async (placeId: string, description: string) => {
		try {
			const result = await getPlaceDetails(placeId);
			if (result) {
				const {
					data: {
						result: {
							geometry: { location },
						},
					},
				} = result;
				const { lat, lng } = location;
				setShowPredictions(false);
				setSearch({ term: description, fetchPredictions: false });
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<View style={styles.container}>
				<MapView
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					showsUserLocation={true}
					initialRegion={props.initialRegion}
					onRegionChangeComplete={(region) => setRegion(region)}
				>
					{places.length > 0
						? places.map((marker, index) => (
								<Marker
									key={index}
									coordinate={{
										latitude: marker.latitude,
										longitude: marker.longitude,
									}}
									title={marker.name}
									description={marker.description}
								/>
						  ))
						: null}
				</MapView>
				<View style={styles.search}>
					<SearchBarWithAutocomplete
						value={search.term}
						onChangeText={(text) => {
							setSearch({ term: text, fetchPredictions: true });
						}}
						mapPredictions={mapPredictions}
						showPredictions={showPredictions}
						predictions={predictions}
						onPredictionTapped={onPredictionTapped}
					/>
				</View>
			</View>
		</>
	);
}
