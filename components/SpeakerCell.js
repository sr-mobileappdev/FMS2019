import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import PropTypes from "prop-types";

export default class SpeakerCell extends React.Component {
  render() {
    return (
	    <View style={styles.container}>
    		<View style={styles.backgroundView}>
    		</View>

    		<View style={styles.contentView}>
    			<View style={[styles.oneRowView, {justifyContent: 'space-between'}]}>
    				<Text style={styles.nameText}>{this.props.item.name}</Text>	
		    		<Text style={styles.affiliationText}>{this.props.item.account}</Text>
    			</View>
    			
		    	<Text style={styles.sessionText}>{this.props.item.sessionname}</Text>

		    	<View style={styles.oneRowView}>
		    		<Text style={styles.dayText}>{this.props.item.dayoftheweek},</Text>	
		    		<Text style={styles.startTimeText}>{this.props.item.date}</Text>	
		    	</View>		    	
    		</View>
	    	
	    </View>
    );
  }
}

SpeakerCell.propTypes = {
  item: PropTypes.object,
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
		paddingLeft: 10,
		paddingRight: 10,
	},

	oneRowView: {
		flexDirection: 'row', 
		alignItems: 'center',
	},

	nameText: {
		fontFamily: 'FuturaPT-Bold',
		fontSize: 18,
	},

	affiliationText: {
		fontFamily: 'FuturaPT-Bold',
	},

	sessionText: {
		marginTop: 7,
		marginBottom: 7,
		fontSize: 15,
		fontStyle: 'italic',
		fontFamily: 'FuturaPT-Book',
	},

	dayText: {
		fontSize: 15,
		fontFamily: 'FuturaPT-Book',
	},

	startTimeText: {
		marginLeft: 7,
		fontSize: 15,
		fontFamily: 'FuturaPT-Book',
	},
});