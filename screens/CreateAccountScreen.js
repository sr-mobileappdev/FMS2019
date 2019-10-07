import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Dimensions
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import RoundButton from './../components/RoundButton';
import FormInput from './../components/FormInput';
import Messages from '../constants/Messages';
import LoadingOverlay from './../components/LoadingOverlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";


const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;

var offsetY = 0;
if (screenHeight >= 812) {
  offsetY = 40;
}

@inject("userStore")
@observer

class StartScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false,
    }
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.userStore.signUpState,
        (signUpState) => {
          if (signUpState.isSuccessful()) {
            this.setState({
                isLoading: false, firstName: '', lastName: '', password: '', email: ''
            }, () => {
                this.props.navigation.navigate('Home');
            });
          } else if(signUpState.isFailed()) {
            this.setState({isLoading: false, errorMessage: Messages.networkErrorMessage});
          } else if(signUpState.isNetworkProblems()) {
            this.setState({isLoading: false, errorMessage: Messages.networkErrorMessage});
          }
        }),
    ];
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onBack() {
    console.log("onBack");
    this.props.navigation.goBack();
  }

  onSubmit () {
    Keyboard.dismiss();

    if (this.state.isLoading) return;

    if (this.state.firstName == null || this.state.firstName == "") {
      this.setState({ errorMessage: Messages.invalidFirsNameMessage });
      return;
    }

    if (this.state.lastName == null || this.state.lastName == "") {
      this.setState({ errorMessage: Messages.invalidLastNameMessage });
      return;
    }

    if (this.state.email == null || this.state.email == "") {
      this.setState({ errorMessage: Messages.invalidEmailMessage });
      return;
    }

    if (this.state.password == null || this.state.password == "") {
      this.setState({ errorMessage: Messages.invalidPasswordMessage });
      return;
    }

    this.setState({ isLoading: true, errorMessage: null});
    
    var deviceId = DeviceInfo.getUniqueID();
    var oneSignalId = this.props.userStore.oneSignalID;

    this.props.userStore.signUp(
      this.state.firstName, 
      this.state.lastName, 
      this.state.email, 
      this.state.password, 
      deviceId,
      oneSignalId);
    
  }

  onTerms() {
    this.props.navigation.navigate('Terms');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topView} />
        <Image
          style={styles.backgroundImage}
          source={require('./../assets/images/page_bg.jpg')}
        />

        <TouchableOpacity style={styles.closeButton} onPress={() => this.onBack()}>
          <Image style={styles.socialIcon} source={require('./../assets/images/white_close_icon.png')} />
        </TouchableOpacity>

        <KeyboardAwareScrollView>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={styles.logoImage}
              source={require('./../assets/images/main_logo.png')}
            />
          </View>
          

          <View style={styles.formView}>
            <Text style={styles.mainTitle}>Create your Account</Text>
            <FormInput 
              style={styles.textView} 
              type="text" 
              placeholder="First Name" 
              value={this.state.firstName} 
              onChangeText={(text) => this.setState({firstName: text, errorMessage: null})} />

            <FormInput 
              style={styles.textView}
              type="text" 
              placeholder="Last Name" 
              value={this.state.lastName} 
              onChangeText={(text) => this.setState({lastName: text, errorMessage: null})} />

            <FormInput 
              style={styles.textView} 
              type="email" 
              placeholder="johndoe@mail.com" 
              value={this.state.email} 
              onChangeText={(text) => this.setState({email: text, errorMessage: null})} />

            <FormInput 
              style={styles.textView} 
              type="password" 
              placeholder="************" 
              value={this.state.password} 
              onChangeText={(text) => this.setState({password: text, errorMessage: null})}
              />

            <RoundButton style={styles.submitButton} title="Submit" onPress={() => this.onSubmit()}></RoundButton>
            {
              this.state.errorMessage
              ? <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
              : null
            }

            <Text style={styles.termsDescText}>
              <Text>By clicking '</Text>
              <Text style={styles.boldText}>Submit</Text>
              <Text>' or by joining with LinkedIn, Twitter or Facebook, you are indicating that you have read and agree to the </Text>
              <Text style={styles.termsText} onPress={() => this.onTerms()}>Terms of Use.</Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>

        {
          this.state.isLoading
          ? <LoadingOverlay />
          : null
        }
        
      </View>
    );
  }
}

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  topView: {
    flex: 1,
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 0,
    width: screenWidth,
    height: screenHeight - 145,
    alignItems: 'center'
  },

  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    bottom: 0,
    resizeMode: "cover"
  },

  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20 + offsetY / 2,
    zIndex: 2,
  },

  logoImage: {
    width: 120,
    top: -40 + offsetY,
    resizeMode: "contain"
  },

  formView: {
    top: -110 + offsetY,
    height: screenHeight,
    paddingLeft: 33,
    paddingRight: 33,
  },

  mainTitle: {
    color: '#DCD22F',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 14,
    fontFamily: 'FuturaPT-Bold',
  },

  textView: {
    marginBottom: 14,
  },

  submitButton: {
    marginLeft: 60,
    marginRight: 60,
    marginTop: 10,
  },


  loginContainerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  termsDescText: {
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 10,
    marginLeft: -20,
    marginRight: -20,
    color: 'white',
    fontFamily: 'FuturaPT-Book',
  },

  boldText: {
    fontFamily: 'FuturaPT-Bold',
  },

  termsText: {
    color: '#DCD22F',
    textDecorationLine: 'underline',
    fontFamily: 'FuturaPT-Book',
  },

  loginButton: {
    marginLeft: 3,
  },

  loginButtonText: {
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
    color: '#0d4e6c',
    fontSize: 16,
    fontFamily: 'FuturaPT-Bold',
  },

  bottomView: {
    width: screenWidth,
    height: 145 + offsetY / 4,
    position: 'absolute',
    bottom: offsetY / 4,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
  },


  bottomTitle: {
    color: '#263485',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
    fontFamily: 'FuturaPT-Bold',
  },

  linkedInButton: {
    backgroundColor: '#007fb2',
    height: 48,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },

  socialContainer: {
    marginTop: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  twitterInButton: {
    backgroundColor: '#4fc1e9',
    height: 48,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,

  },

  facebookInButton: {
    backgroundColor: '#5d9cec',
    height: 48,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    
  },

  socialIcon: {
    width: 26,
    height: 26,
  },

  socialButtonText: {
    color: 'white',
    fontSize: 15,
    marginLeft: 8,
    fontFamily: 'FuturaPT-Book',    
  },

  socialButtonText2: {
    color: 'white',
    fontSize: 15,
    marginLeft: -2,
  },

  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'FuturaPT-Book',    
  },
})
