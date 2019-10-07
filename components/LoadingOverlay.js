import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from "prop-types";
import {
  SkypeIndicator,
} from 'react-native-indicators';

export default class LoadingOverlay extends React.Component {
  render() {
    return (
	    <View style={styles.indicatorOverlay}>
          <View style={styles.indicatorBackground}></View>
          <SkypeIndicator color='white' />
        </View>
    );
  }
}

LoadingOverlay.propTypes = {
  item: PropTypes.object,
}

const styles = StyleSheet.create({
	indicatorOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },

  indicatorBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});