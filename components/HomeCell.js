import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import PropTypes from "prop-types";

export default class HomeCell extends React.Component {
  render() {
    return (
	    <View style={styles.rowItem}>
           <View style={styles.leftInfoView}>
             {
                this.props.item.type == "user"
                ? <Image 
                    style={styles.iconImage}
                    source={require('./../assets/images/user_icon.png')}
                  />
                : null
             }

             {
             	this.props.item.type == "ibeacon"
             	? <Image 
                    style={styles.iconImage}
                    source={require('./../assets/images/ibeacon_icon.png')}
                  />
                : null             	
             }

             {
             	this.props.item.type == "eddystone"
             	? <Image 
                    style={styles.iconImage}
                    source={require('./../assets/images/eddystone_icon.png')}
                  />
                : null             	
             }

             {
             	this.props.item.type == "geofence"
             	? <Image 
                    style={styles.iconImage}
                    source={require('./../assets/images/geofence_icon.png')}
                  />
                : null             	
             }

             <Text style={styles.nameText}>{this.props.item.name}</Text>
           </View>
           <TouchableOpacity onPress={() => this.props.onDetail(this.props.item)}>
              <Image 
                style={styles.iconImage}
                source={require('./../assets/images/info_icon.png')}
              />
           </TouchableOpacity>
        </View>
    );
  }
}

HomeCell.propTypes = {
  item: PropTypes.object,
  onDetail: PropTypes.func,
}

const styles = StyleSheet.create({
rowItem: {
    backgroundColor: '#0A6CB5',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftInfoView: {
    flexDirection: 'row',
  },

  nameText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'FuturaPT-Bold',
  },

  iconImage: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
});