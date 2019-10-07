import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from "prop-types";

export default class SponsorCell extends React.Component {
  render() {
    return (
	    <View style={styles.container}>
    		<View style={styles.backgroundView}>
    		</View>

    		<TouchableOpacity style={styles.contentView} onPress={() => this.props.onSelectItem()}>
    			<View style={styles.oneRowView}>
    				<Text style={styles.companyText}>{this.props.item.account}</Text>
    				<Text style={styles.numberText}>{this.props.item.number}</Text>
    			</View>
				{
					this.props.item.level 
					? <Text style={styles.levelText}>{this.props.item.level}</Text>
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

SponsorCell.propTypes = {
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
		justifyContent: 'space-between',
	},

	companyText: {
		fontFamily: 'FuturaPT-Bold',
		fontSize: 16,
		color: 'black',
	},

	numberText: {
		fontFamily: 'FuturaPT-Book',
		color: 'gray',
		fontSize: 16,
	},

	levelText: {
		marginTop: 5,
		fontSize: 15,
		fontStyle: 'italic',
		color: 'black',
		fontFamily: 'FuturaPT-Book',
	},

	detailView: {
		backgroundColor: 'white',
		padding: 15,		
	},

	descriptionText: {
		color: 'gray',
		fontFamily: 'FuturaPT-Book',	
		fontSize: 14,
	},

	qrcodeImage: {
		width: 80, 
		height: 80,
	},

	logoImage: {
		width: 100,
		height: 20,
	}

});