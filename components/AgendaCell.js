import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from "prop-types";

export default class AgendaCell extends React.Component {
  render() {
    return (
	    <View style={styles.container}>
    		<View style={styles.backgroundView}>
    		</View>

    		<TouchableOpacity style={styles.contentView} onPress={() => this.props.onSelectItem()}>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
					<Text style={styles.timeText}>{this.props.item.starttime} - {this.props.item.endtime}</Text>	
					{
		    			this.props.item.openclosed == "Open"
		    			? <Text style={styles.statusText}>Open</Text>
		    			: null
		    		}

		    		{
		    			this.props.item.openclosed == "Closed"
		    			? <Text style={styles.statusTextPro}>Pro</Text>
		    			: null
		    		}
				</View>
    			
		    	<Text style={styles.nameText}>{this.props.item.name}</Text>
		    	<Text style={styles.trackText}>{this.props.item.track}</Text>
		    	{
		    		this.props.item.roomlocation
		    		? <Text style={styles.dayText}>{this.props.item.roomlocation}</Text>	
		    		: null
		    	}
    		</TouchableOpacity>
	    	
	    	{
    			this.props.item.is_detail 
    			? <View style={styles.detailView}>
    				{
						this.props.item.shortdescription
						? <Text style={styles.descriptionText}>{this.props.item.shortdescription}</Text>
						: null
    				}
    				
    				<View style={styles.oneRowView}>
    					<View>
    						{
		    					this.props.item.boothqrcode 
		    					? <Image style={styles.qrcodeImage} source={{uri: this.props.item.boothqrcode}} />
		    					: null
		    				}
    					</View>

    					<View>
    						{
		    					this.props.item.accountlogo 
		    					? <Image style={styles.logoImage} source={{uri:this.props.item.accountlogo}} />
		    					: null
		    				}

		    				{
		    					this.props.item.accountlogo 
		    					? <Image style={styles.logoImage} source={{uri:this.props.item.accountlogo}} />
		    					: null
		    				}
    					</View>
    				</View>
    				
    			  </View>
    			: null
    		}
	    </View>
    );
  }
}

AgendaCell.propTypes = {
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
		paddingLeft: 10,
		paddingRight: 10,
	},

	oneRowView: {
		flexDirection: 'row', 
		alignItems: 'center',
	},

	timeText: {
		fontFamily: 'FuturaPT-Book',
		fontSize: 16,
		color: 'black',
	},

	nameText: {
		fontFamily: 'FuturaPT-Medium',
		color: 'black',
		fontSize: 18,
	},

	trackText: {
		marginTop: 5,
		fontSize: 15,
		fontStyle: 'italic',
		color: 'black',
		fontFamily: 'FuturaPT-Book',
	},

	statusText: {
		fontFamily: 'FuturaPT-Book',	
		fontSize: 13,
		color: 'white',
		backgroundColor: 'green',
		paddingTop: 3,
		paddingBottom: 3,
		borderRadius: 12,	
		overflow: 'hidden',
		width: 50,
		textAlign: 'center',	
	},

	statusTextPro: {
		fontFamily: 'FuturaPT-Book',	
		fontSize: 13,
		color: 'white',
		backgroundColor: 'darkorange',
		paddingTop: 3,
		paddingBottom: 3,
		borderRadius: 12,	
		overflow: 'hidden',
		width: 50,
		textAlign: 'center',
	},
});