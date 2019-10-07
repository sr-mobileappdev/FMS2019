import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from "prop-types";

export default class ColorButton extends React.Component {
  render() {
    return (
	    <TouchableOpacity style={[this.props.style, styles.container]} onPress={() => this.props.onPress()}>
			<Image
	          style={styles.refreshIcon}
	          source={require('./../assets/images/refresh.png')}
	        />
	    </TouchableOpacity>
    );
  }
}

ColorButton.propTypes = {
  onPress: PropTypes.func,
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 30,
		padding: 10,
		position: 'absolute',
		bottom: 25,
		right: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},

	refreshIcon: {
		width: 20,
		height: 20,
	},
});