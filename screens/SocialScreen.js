import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import HomeTopBar from './../components/HomeTopBar';
import { WebView } from 'react-native-webview';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

@inject("userStore")
@observer

class SocialScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
   }
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onSignOut() {
    this.props.userStore.signOut();
    this.props.navigation.popToTop();
  }

  render() {
    return (
      <View style={styles.container}>
        <HomeTopBar 
          onMenu={() => this.onMenu()}
          onSignOut={() => this.onSignOut()}
        />
        <WebView
          source={{ html: '<a class="twitter-timeline" href="https://twitter.com/fms19?ref_src=twsrc%5Etfw">Tweets by fms19</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> ' }}
          javaScriptEnabled={true}          
        />
      </View>
    );
  }
}

export default SocialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})
