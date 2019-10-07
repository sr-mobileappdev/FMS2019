import React from 'react';
import { 
	Text, 
	Image, 
	StyleSheet, 
	View,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import PropTypes from "prop-types";

const win = Dimensions.get('window');
const screenHeight = win.height;

export default class MenuItem extends React.Component {
	constructor(props) {
    	super(props)
    	this.state = {
	   	}
  	}

  	render() {
    	return (
	    	<TouchableOpacity 
	    		style={styles.container} 
	    		onPress={() => this.props.onSelectItem(this.props.data)}>
	    		<Image
		          style={styles.menuIcon}
		          source={require('./../assets/images/white_settings_button.png')}
		        />
	    		<Text style={styles.menuText}>{this.props.data.name}</Text>
	    	</TouchableOpacity>
    	);
  	}
}

MenuItem.propTypes = {
	data: PropTypes.object,
	onSelectItem: PropTypes.func
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 16,
		paddingBottom: 15,
		paddingLeft: 16,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255, 255, 255, 0.5)',
	},

	menuIcon: {
		width: 40,
		height: 40,
	},

	menuText: {
		fontFamily: 'FuturaPT-Medium',
		color: 'white',
		marginLeft: 10,
		fontSize: screenHeight > 700 ? 25 : 20,
	},
});