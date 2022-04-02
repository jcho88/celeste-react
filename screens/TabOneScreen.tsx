import { StyleSheet, ScrollView } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useState } from 'react';
import placesData from '../assets/resources/places.json'

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
});

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [places, setPlaces] = useState(placesData);

  return (
    <>
      <ScrollView>
        {places.map(place => 
          <Text style={styles.title}>{place.name}</Text>
        )}
      </ScrollView>
      {/* <View style={styles.container}>
        <Text style={styles.title}>Tab One</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="/screens/TabOneScreen.tsx" />
      </View> */}
    </>
  );
}
