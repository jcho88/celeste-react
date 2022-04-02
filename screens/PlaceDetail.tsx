import { StyleSheet, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

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

export default function PlaceDetail() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tab Two</Text>
			<Image style={styles.circle} source={require('../assets/images/turtlerock@2x.jpg')} />
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			<EditScreenInfo path="/screens/TabTwoScreen.tsx" />
		</View>
	);
}
