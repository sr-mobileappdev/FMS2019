import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from "prop-types";

export default class ColorButton extends React.Component {
  render() {
    return (
	    <TouchableOpacity style={this.props.style} onPress={() => this.props.onPress()}>
	    	{
	    		this.props.color == "orange"
	    		? <View style={[styles.container, styles.orangeContainer]}>
					<Text style={styles.buttonText}>{this.props.title}</Text>
  	    		  </View>
	    		: null
	    	}

	    	{
	    		this.props.color == "blue"
	    		? <View style={[styles.container, styles.blueContainer]}>
					<Text style={styles.buttonText}>{this.props.title}</Text>
  	    		  </View>
	    		: null
	    	}

	    	{
	    		this.props.color == "green"
	    		? <View style={[styles.container, styles.greenContainer]}>
					<Text style={styles.buttonText}>{this.props.title}</Text>
  	    		  </View>
	    		: null
	    	}
    		
	    </TouchableOpacity>
    );
  }
}

ColorButton.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 30,
		elevation: 3,
	},

	orangeContainer: {
		backgroundColor: '#ff7600',
	},

	blueContainer: {
		backgroundColor: '#0973ba',
	},

	greenContainer: {
		backgroundColor: '#2ecc71',
	},

	buttonText: {
		fontFamily: 'FuturaPT-Bold',
		color: 'white',
		fontSize: 16,
		paddingTop: 12,
		paddingBottom: 12,
		fontWeight: 'bold'
	},
});