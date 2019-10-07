import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from "prop-types";

export default class ScheduleCell extends React.Component {

  filterTime(datetime) {
  	var d = new Date(datetime);

  	var hours = d.getHours();
  	var ampm = hours >= 12 ? 'pm' : 'am';
  	hours = hours % 12;
  	var h = (hours<10?'0':'') + hours;
    var m = (d.getMinutes()<10?'0':'') + d.getMinutes();

	return h + ":" + m + " " + ampm;
  }

  render() {
    return (
	    <View style={styles.container}>
    		<View style={styles.backgroundView}>
    		</View>
	    	
	    	<View style={styles.contentView}>
	    		<View style={styles.oneRowView}>
	    			<Text style={styles.dateText}>{this.props.item.fields.rie__Session_Date__c}, </Text>
		    		<Text style={styles.dateText}>
		    			{this.filterTime(this.props.item.fields.rie__Session_Start_Time__c)} - {this.filterTime(this.props.item.fields.rie__Session_End_Time__c)}</Text>
	    		</View>
	    		
		    	<Text style={styles.roomText}>{this.props.item.fields.Session_Name__c}</Text>
	    	</View>	    	
	    </View>
    );
  }
}

ScheduleCell.propTypes = {
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

	dateText: {
		fontFamily: 'FuturaPT-Book',
		fontSize: 16,
		color: 'gray',
		textTransform: 'uppercase',
		marginRight: 5,
	},

	roomText: {
		fontFamily: 'FuturaPT-Book',
		color: 'black',
		fontSize: 18,
		paddingTop: 5,
		paddingBottom: 5,
	},

	activityText: {
		fontFamily: 'FuturaPT-BookObl',
		color: 'gray',
		fontStyle: 'italic',
		fontSize: 18,	
	},
});