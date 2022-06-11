import { StyleSheet, ScrollView, Pressable } from 'react-native';
import MapView from 'react-native-maps';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useState } from 'react';
import placesData from '../assets/resources/places.json';
import PlaceDetail from './PlaceDetail';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
});

export default function MainMapScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
	const [places, setPlaces] = useState(placesData);
	// const openDetail = (place: Place) => {
	// 	return <PlaceDetail place={place} />;
	// };

	return (
		<>
			<MapView
				style={styles.map}
				initialRegion={{
					latitude: 40.75251018277572,
					longitude: -73.97984077693457,
					latitudeDelta: 0.3,
					longitudeDelta: 0.3,
				}}
			></MapView>
			<ScrollView>
				{places.map((place) => (
					<Pressable
						onPress={() => {
							navigation.navigate('PlaceDetail', place);
						}}
					>
						<Text style={styles.title}>{place.name}</Text>
					</Pressable>
				))}
			</ScrollView>
			{/* <View style={styles.container}>
        <Text style={styles.title}>Tab One</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="/screens/MainMapScreen.tsx" />
      </View> */}
		</>
	);
}
