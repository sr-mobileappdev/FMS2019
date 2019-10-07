import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View, Dimensions, Alert } from 'react-native';
import PropTypes from "prop-types";

const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;

var offsetY = 0;
if (screenHeight >= 812) {
  offsetY = 40;
}

export default class HomeTopBar extends React.Component {

  onSettings() {
    Alert.alert(
      '',
      'Are you sure to logout?',
      [
        {text: 'Yes', onPress: () => this.props.onSignOut()},
        {text: 'No'},
      ],
    );
  }

  render() {
    return (
	    <View style={styles.topView}>
          <TouchableOpacity style={styles.leftButton} onPress={() => this.props.onMenu()}>
            <Image
              style={styles.menuIcon}
              source={require('./../assets/images/white_menu.png')}
            />        
          </TouchableOpacity>

          <Image
            style={styles.topLogoImage}
            source={require('./../assets/images/main_logo.png')}
          />   

          <TouchableOpacity style={styles.rightButton} onPress={() => this.onSettings()}>
            <Image
              style={styles.menuIcon}
              source={require('./../assets/images/logout.png')}
            />        
          </TouchableOpacity>     
        </View>
    );
  }
}

HomeTopBar.propTypes = {
  onMenu: PropTypes.func,
  onSignOut: PropTypes.func,
}

const styles = StyleSheet.create({
   topView: {
    marginTop: 0,
    paddingTop: 20 + offsetY/2.0,
    width: screenWidth,
    height: 80 + offsetY,
    alignItems: 'center',
    backgroundColor: '#263485',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  topLogoImage: {
    width: 45,
    height: 45,
    resizeMode: "contain"
  },

  leftButton: {
    position: 'absolute',
    left: 10,
    top: offsetY * 3 / 4.0 + 30,
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightButton: {
    position: 'absolute',
    right: 10,
    top: offsetY * 3 / 4.0 + 30,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIcon: {
    width: 25,
    height: 25,
  },

  topButtonText: {
    fontFamily: 'FuturaPT-Medium',
    textTransform: 'uppercase',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});