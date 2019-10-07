import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import PropTypes from "prop-types";

export default class PageTitle extends React.Component {
  render() {
    return (
	    <Text style={styles.mainTitle}>{this.props.title}</Text>
    );
  }
}

PageTitle.propTypes = {
  title: PropTypes.string,
}

const styles = StyleSheet.create({
   mainTitle: {
    fontFamily: 'FuturaPT-Book',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#585858',
    color: '#e4d934',
    paddingTop: 15,
    paddingBottom: 15,
  },
});