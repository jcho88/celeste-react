import React, { FunctionComponent, useState } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	ViewStyle,
	FlatList,
	TouchableOpacity,
	Text,
	NativeSyntheticEvent,
	TextInputSubmitEditingEventData,
} from 'react-native';
import { useDebounce } from '../hooks/useDebounce';

type SearchBarProps = {
	value: string;
	showPredictions?: boolean;
	predictions: PredictionType[];
	style?: ViewStyle | ViewStyle[];
	onPredictionTapped: (placeId: string, description: string) => void;
	onChangeText: (text: string) => void;
	mapPredictions: (predictions: PredictionType[]) => void;
	debounce?: number;
};

export const SearchBarWithAutocomplete: FunctionComponent<SearchBarProps> = (props) => {
	const [inputSize, setInputSize] = useState({ width: 0, height: 0 });

	const {
		value,
		showPredictions,
		predictions,
		style,
		onChangeText,
		onPredictionTapped,
		mapPredictions,
	} = props;
	const { container, inputStyle } = styles;
	const passedStyles = Array.isArray(style) ? Object.assign({}, ...style) : style;

	const inputBottomRadius = showPredictions
		? {
				borderBottomLeftRadius: 0,
				borderBottomRightRadius: 0,
		  }
		: {
				borderBottomLeftRadius: 20,
				borderBottomRightRadius: 20,
		  };

	const onSubmitEditing = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
		console.log('PRESSED ENTER');
		mapPredictions(predictions);
	};

	const _renderPredictions = (predictions: PredictionType[]) => {
		const { predictionsContainer, predictionRow } = styles;
		const calculatedStyle = {
			width: inputSize.width,
		};

		return (
			<FlatList
				data={predictions}
				renderItem={({ item, index }) => {
					return (
						<TouchableOpacity
							style={predictionRow}
							onPress={() => onPredictionTapped(item.place_id, item.description)}
						>
							<Text numberOfLines={1}>{item.description}</Text>
						</TouchableOpacity>
					);
				}}
				keyExtractor={(item) => item.place_id}
				keyboardShouldPersistTaps="handled"
				style={[predictionsContainer, calculatedStyle]}
			/>
		);
	};

	return (
		<View style={[container, { ...passedStyles }]}>
			<TextInput
				style={[inputStyle, inputBottomRadius]}
				placeholder="Search"
				placeholderTextColor="gray"
				value={value}
				onChangeText={onChangeText}
				returnKeyType="search"
				onSubmitEditing={onSubmitEditing}
				onLayout={(event) => {
					const { height, width } = event.nativeEvent.layout;
					setInputSize({ height, width });
				}}
			/>
			{showPredictions && _renderPredictions(predictions)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
	},
	inputStyle: {
		paddingVertical: 16,
		paddingHorizontal: 10,
		// backgroundColor: '#cfcfcf',
		// borderRadius: 20,
		color: 'black',
		fontSize: 16,
	},
	predictionsContainer: {
		// backgroundColor: '#cfcfcf',
		// padding: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
	predictionRow: {
		paddingLeft: 15,
		paddingBottom: 15,
		marginBottom: 15,
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 0.8,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
});

/**
 * Prediction's type returned from Google Places Autocomplete API
 * https://developers.google.com/places/web-service/autocomplete#place_autocomplete_results
 */
export type PredictionType = {
	description: string;
	place_id: string;
	reference: string;
	matched_substrings: any[];
	structured_formatting: Object;
	terms: Object[];
	types: string[];
};
