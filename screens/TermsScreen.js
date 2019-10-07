import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import TopBar from './../components/TopBar';
import { WebView } from 'react-native-webview';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

class TermsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      visible: true,
   }
  }

  hideSpinner=()=> {
    this.setState({ visible: false });
  }
  showSpinner=()=> {
    this.setState({ visible: true });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <TopBar onBack={() => this.onBack()}/>
        <WebView
          onLoadStart={() => (this.showSpinner())}
          onLoad={() => this.hideSpinner()}
          source={{ uri: 'https://www.flashmemorysummit.com/English/Miscellaneous/Privacy_Policy.html' }}
          javaScriptEnabled={true}          
        />

        {this.state.visible && (
          <ActivityIndicator
            style={{
            flex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center' }}
            size="large"
          />
        )}
      </View>
    );
  }
}

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})
