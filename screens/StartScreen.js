import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  Dimensions,
  Platform
} from "react-native";

import { NavigationActions } from "react-navigation";
import RoundButton from "./../components/RoundButton";
import LoginDialog from "./../components/LoginDialog";
import ForgotDialog from "./../components/ForgotDialog";
import LoadingOverlay from "./../components/LoadingOverlay";
import Messages from "../constants/Messages";
import { ONESIGNAL_APP_ID } from "../config/constants.js";
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import OneSignal from "react-native-onesignal";
import SplashScreen from "react-native-splash-screen";
import Proximiio from "proximiio-react-native-core";
import { PROXIMIIO_TOKEN } from "../config/constants.js";

const win = Dimensions.get("window");
const screenWidth = win.width;
const screenHeight = win.height;

var offsetY = 0;
if (screenHeight > 750) {
  offsetY = (screenHeight - 750) / 2.0;
}

@inject("userStore")
@observer
class StartScreen extends Component {
  static navigationOptions = {
    header: null
  };
  one_signal_id = "";
  constructor(props) {
    super(props);

    this.state = {
      isShowLoginDialog: false,
      isShowForgotDialog: false,
      isLoading: false,
      email: "",
      password: "",
      errorMessage: "",
      visitorId: "",
      proximiioReady: false
    };

    this.onPositionUpdate = this.onPositionUpdate.bind(this);
    this.onGeofenceEnter = this.onGeofenceEnter.bind(this);
    this.onGeofenceExit = this.onGeofenceExit.bind(this);
    this.onFloorChange = this.onFloorChange.bind(this);
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.userStore.restoreUserState,
        restoreUserState => {
          if (restoreUserState.isSuccessful()) {
            this.props.navigation.navigate("Home_noTransition");
          } else {
            SplashScreen.hide();
            this.props.navigation.navigate("Start");
          }
        }
      ),

      reaction(
        () => this.props.userStore.loginState,
        loginState => {
          if (loginState.isSuccessful()) {
            this.setState({ isLoading: false });
            this.onMoveHomePage();
          } else if (loginState.isFailed()) {
            this.setState({
              isLoading: false,
              errorMessage: Messages.loginErrorMessage
            });
          } else if (loginState.isNetworkProblems()) {
            this.setState({
              isLoading: false,
              errorMessage: Messages.networkErrorMessage
            });
          }
        }
      ),

      reaction(
        () => this.props.userStore.forgotPasswordState,
        forgotPasswordState => {
          if (forgotPasswordState.isSuccessful()) {
            this.setState({ isLoading: false, isShowForgotDialog: false });
            this.showAlertMessage(forgotPasswordState.value);
          } else if (forgotPasswordState.isFailed()) {
            this.setState({ isLoading: false });
            this.showAlertMessage(forgotPasswordState.error);
          } else if (forgotPasswordState.isNetworkProblems()) {
            this.setState({
              isLoading: false,
              errorMessage: Messages.networkErrorMessage
            });
          }
        }
      )
    ];

    this.initProximiio();
    this.props.userStore.restoreUser();
    this.initOneSignal();
  }

  initOneSignal() {
    OneSignal.init(ONESIGNAL_APP_ID);
    OneSignal.addEventListener("ids", this.onIds);
  }

  onIds = device => {
    console.log("Device info: ", device);
    if (device && device.userId) {
      this.one_signal_id = device.userId;
      this.props.userStore.setOneSignalID(this.one_signal_id);
    }
  };

  showAlertMessage(message) {
    Alert.alert(
      "",
      message,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

  onMoveHomePage() {
    this.setState({ isShowLoginDialog: false });
    this.props.userStore.homeNavigation = "Home_noTransition";
    this.props.navigation.navigate("Home_noTransition", {
      navigation_name: "Home_noTransition"
    });
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
    destoryProximiio();
  }

  async initProximiio() {
    if (!Proximiio.isAuthorized()) {
      await this.setState({
        visitorId: "authorizing..."
      });

      // notification customization (android only)

      Proximiio.setNotificationMode(Proximiio.NotificationModes.Enabled);
      Proximiio.setNotificationTitle("Proximi.io Background Service");
      Proximiio.setNotificationText(
        "Allows location interactivity while the application is in background"
      );
      Proximiio.setNotificationIcon("ic_notification");

      try {
        const state = await Proximiio.authorize(PROXIMIIO_TOKEN);

        Proximiio.requestPermissions();

        await this.setState({
          visitorId: state.visitorId,
          proximiioReady: true
        });
      } catch (error) {
        await this.setState({ visitorId: "auth failure" });
      }
    } else {
      await this.setState({
        visitorId: Proximiio.state.visitorId,
        proximiioReady: true
      });
    }

    this.subscriptions = {
      positionUpdates: Proximiio.subscribe(
        Proximiio.Events.PositionUpdated,
        this.onPositionUpdate
      ),
      floorChange: Proximiio.subscribe(
        Proximiio.Events.FloorChanged,
        this.onFloorChange
      ),
      enteredGeofence: Proximiio.subscribe(
        Proximiio.Events.EnteredGeofence,
        this.onGeofenceEnter
      ),
      exitedGeofence: Proximiio.subscribe(
        Proximiio.Events.ExitedGeofence,
        this.onGeofenceExit
      )
    };
  }

  async destoryProximiio() {
    Object.keys(this.proximiioSubscriptions).forEach(key =>
      this.proximiioSubscriptions[key].remove()
    );
  }

  onPositionUpdate(location) {
    console.log(
      `location updated: ${location.lat} / ${location.lng} (${location.accuracy})`
    );
    if (this.props.userStore.currentUser) {
      this.props.userStore.updateGeoLocation(
        this.props.userStore.currentUser.id,
        location.lat,
        location.lng
      );
    }
  }

  onFloorChange(floor) {
    console.log("on floor change", floor);
  }

  onGeofenceEnter(geofence) {
    console.log(`entered geofence: ${geofence}`);
  }

  onGeofenceExit(geofence) {
    console.log(`left geofence: ${Proximiio.Events.ExitedGeofence}`);
  }

  onCreateAccount() {
    this.props.navigation.navigate("CreateAccount");
  }

  onLogin(email, password) {
    this.setState({ isShowLoginDialog: true });
  }

  onLoginProcess(email, password) {
    console.log("onLoginProcess");

    if (this.state.isLoading) return;

    this.setState({ isLoading: true, errorMessage: null });
    this.props.userStore.login(email, password, this.one_signal_id);
  }

  onForgotPassword() {
    this.setState({ isShowLoginDialog: false, isShowForgotDialog: true });
  }

  onSubmitForgot(email) {
    this.setState({ isLoading: true }, () => {
      this.props.userStore.forgotPassword(email);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <Image
            style={styles.backgroundImage}
            source={require("./../assets/images/page_bg.jpg")}
          />

          <Image
            style={styles.logoImage}
            source={require("./../assets/images/first_page_logo.png")}
          />
        </View>

        <View style={styles.bottomView}>
          <RoundButton
            style={styles.createButton}
            title="Create An Account"
            onPress={() => this.onCreateAccount()}
          ></RoundButton>
          <View style={styles.loginContainerView}>
            <Text style={styles.alreadyText}>Already have an account?</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this.onLogin()}
            >
              <Text style={styles.loginButtonText}>Login Here</Text>
            </TouchableOpacity>
          </View>
        </View>

        {this.state.isShowLoginDialog ? (
          <LoginDialog
            errorMessage={this.state.errorMessage}
            onLogin={(email, password) => this.onLoginProcess(email, password)}
            onForgotPassword={() => this.onForgotPassword()}
            onClose={() => this.setState({ isShowLoginDialog: false })}
          />
        ) : null}

        {this.state.isShowForgotDialog ? (
          <ForgotDialog
            onSubmitForgot={email => this.onSubmitForgot(email)}
            onClose={() => this.setState({ isShowForgotDialog: false })}
          />
        ) : null}

        {this.state.isLoading ? <LoadingOverlay /> : null}
      </View>
    );
  }
}

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3edee"
  },

  topView: {
    position: "absolute",
    top: 0,
    width: screenWidth,
    height: screenHeight - 145,
    alignItems: "center"
  },

  backgroundImage: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },

  logoImage: {
    top: 70 + offsetY,
    width: 316,
    resizeMode: "contain"
  },

  phoneImage: {
    position: "absolute",
    top: -80 + offsetY,
    width: "100%",
    resizeMode: "contain"
  },

  bottomView: {
    width: screenWidth,
    height: 145 + offsetY / 2.0,
    position: "absolute",
    bottom: 0,
    paddingBottom: offsetY / 2.0,
    backgroundColor: "white"
  },

  createButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 23
  },

  loginContainerView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  alreadyText: {
    color: "#263485",
    fontSize: 16,
    fontFamily: "FuturaPT-Book"
  },

  loginButton: {
    marginLeft: 3
  },

  loginButtonText: {
    textTransform: "uppercase",
    textDecorationLine: "underline",
    color: "#263485",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "FuturaPT-Bold"
  }
});
