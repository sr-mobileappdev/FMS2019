import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from "prop-types";

export default class FloorCell extends React.Component {
  render() {
    return (
	    <TouchableOpacity style={styles.container} onPress={() => this.props.onSelectItem(this.props.item)}>
    		<View style={styles.backgroundView}>
    		</View>
	    	
	    	<View style={styles.contentView}>
	    		<Image
	            	style={styles.floorImage}
	            	source={require('./../assets/images/floor_icon.png')}
	          	/>

	    		<View>
	    			<Text style={styles.nameText}>{this.props.item.name}</Text>
			    	<Text style={styles.placeText}>{this.props.item.place_name}</Text>
			    	<Text style={styles.placeText}>{this.props.item.organization_name}</Text>
	    		</View>		    	
	    	</View>	    	
	    </TouchableOpacity>
    );
  }
}

FloorCell.propTypes = {
  item: PropTypes.object,
  onSelectItem: PropTypes.func,
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 3,
	},

	backgroundView: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		backgroundColor: '#f2f2f2',
	},

	contentView: {
		paddingTop: 15,
		paddingBottom: 15,
		paddingLeft: 15,
		paddingRight: 15,
		flexDirection: 'row',
		alignItems: 'center',
	},

	floorImage: { 
		width: 30,
		height: 30,
		marginRight: 25,
	},

	oneRowView: {
		flexDirection: 'row', 
		alignItems: 'center',
	},

	nameText: {
		fontFamily: 'FuturaPT-Bold',
		fontSize: 18,
		color: 'black',
		textTransform: 'uppercase',
		marginRight: 5,
	},

	placeText: {
		fontFamily: 'FuturaPT-Book',
		color: 'gray',
		fontSize: 16,
	},
});