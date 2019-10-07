import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View, Dimensions } from 'react-native';
import PropTypes from "prop-types";

const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;

var offsetY = 0;
if (screenHeight >= 812) {
  offsetY = 40;
}

export default class TopBar extends React.Component {
  render() {
    return (
	    <View style={styles.topView}>
          <TouchableOpacity style={styles.saveButton} onPress={() => this.props.onBack()}>
            <Image
              style={styles.checkImage}
              source={require('./../assets/images/white_back-arrow.png')}
            />        
            <Text style={styles.topButtonText}>Back</Text>
          </TouchableOpacity>

          <Image
            style={styles.topLogoImage}
            source={require('./../assets/images/main_logo.png')}
          />        
        </View>
    );
  }
}

TopBar.propTypes = {
  onBack: PropTypes.func,
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

  saveButton: {
    position: 'absolute',
    left: 10,
    top: offsetY * 3 / 4.0 + 35,
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkImage: {
    width: 20,
    height: 20,
    marginRight: 5, 
  },

  topButtonText: {
    fontFamily: 'FuturaPT-Medium',
    textTransform: 'uppercase',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});