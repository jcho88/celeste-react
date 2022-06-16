import { StyleSheet, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Place } from '../constants/Default';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	details: {
		fontSize: 18,
		textAlign: 'center',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	circle: {
		width: 150,
		height: 150,
		borderRadius: 150 / 2,
	},
});

export default function PlaceDetail({ navigation, route }: RootTabScreenProps<'MainMap'>) {
	const place = route.params ? route.params : Place;

	// console.log('PLACE DETAIL: ', place)

	return (
		<View style={styles.container}>
			{/* <Text style={styles.title}>Details</Text> */}
			<Text style={styles.title}>{place.name}</Text>
			<Text style={styles.details}>{place.description}</Text>
			<Text style={styles.details}>{place.address}</Text>
			<Text style={styles.details}>{place.category}</Text>
			<Text style={styles.details}>{place.date}</Text>
			<Image style={styles.circle} source={{ uri: 'https://reactjs.org/logo-og.png' }} />
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			<EditScreenInfo path="/screens/TabTwoScreen.tsx" />
		</View>
	);
}
