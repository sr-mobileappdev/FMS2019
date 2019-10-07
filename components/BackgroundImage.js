import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';

const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;

export default class BackgroundImage extends React.Component {
  render() {
    return (
	    <Image
          style={styles.backgroundImage}
          source={require('./../assets/images/main_bg.jpg')}
        />
    );
  }
}

const styles = StyleSheet.create({
	backgroundImage: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: screenWidth,
		height: screenHeight,
	},
});