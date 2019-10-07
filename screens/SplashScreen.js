import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import { StackActions, NavigationActions } from 'react-navigation'
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;

@inject("userStore")
@observer

class SplashScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)

    this.state = {
      needToMoveHome: false,
    }

    let self = this;
    setTimeout(function(){
      if (self.state.needToMoveHome) {
        const resetAction = StackActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'Start' }),
            NavigationActions.navigate({ routeName: 'Home_noTransition' }),
          ],
        });
        self.props.navigation.dispatch(resetAction);
      } else {
        self.props.navigation.navigate('Start');  
      }
      
    }, 3000);
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.userStore.restoreUserState,
        (restoreUserState) => {
          if (restoreUserState.isSuccessful()) {
            this.setState({needToMoveHome: true});
          }
        }
      )
    ];

    this.props.userStore.restoreUser();
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('./../assets/images/splash_bg.jpg')}
        />

        <Image
          style={styles.logoImage}
          source={require('./../assets/images/main_logo.png')}
        />

        <Image
          style={styles.bottomImage}
          source={require('./../assets/images/title_text.png')}
        />
      </View>
    );
  }
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: screenWidth,
    height: screenHeight,
  },

  logoImage: {
    width: 140,
    height: 152,
    marginBottom: 103,
  },

  bottomImage: {
    position: 'absolute',
    bottom: 37,
    width: 210,
    height: 53,
    resizeMode: 'contain',
  }
})
