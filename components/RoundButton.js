import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from "prop-types";

export default class RoundButton extends React.Component {
  render() {
    return (
	    <TouchableOpacity style={this.props.style} onPress={() => this.props.onPress()}>
    		<View style={styles.container}>
				<Text style={styles.buttonText}>{this.props.title}</Text>
    		</View>
	    </TouchableOpacity>
    );
  }
}

RoundButton.propTypes = {
  title: PropTypes.string,
  theme: PropTypes.string,
  floatSize: PropTypes.bool,
  isLoading: PropTypes.bool,
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#263485',
		borderRadius: 5,
		elevation: 3,
	},

	buttonText: {
		fontFamily: 'FuturaPT-Bold',
		color: 'white',
		textTransform: 'uppercase',
		fontSize: 17,
		paddingTop: 18,
		paddingBottom: 18,
	},
});