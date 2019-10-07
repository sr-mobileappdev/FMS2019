import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import Proximiio from 'proximiio-react-native-core';
import moment from "moment";
import { PROXIMIIO_TOKEN } from '../config/constants.js';
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import HomeCell from './../components/HomeCell';

const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;
console.log("screenHeight = ", screenHeight);

var offsetY = 0;
if (screenHeight >= 812) {
  offsetY = 40;
}

@inject("userStore")
@observer

class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)

    this.state = {
      visitorId: '',
      proximiioReady: true,
      statusText: '',

      data: [
        {
          id: "1",
          name: "Test",
          type: "ibeacon",
        },
        {
          id: "2",
          name: "Eddy",
          type: "eddystone",
        },
        {
          id: "3",
          name: "Geofence",
          type: "geofence",
        },
      ],
   }
  }

  componentDidMount() {
    this.initProximiio();
  }

  componentWillUnmount() {
    this.destroyProximiio();
  }

    // authorization
  async initProximiio() {
    if (!Proximiio.isAuthorized()) {

      // notification customization (android only)
      Proximiio.setNotificationMode(Proximiio.NotificationModes.Enabled)
      Proximiio.setNotificationTitle("Proximi.io Background Service")
      Proximiio.setNotificationText("Allows location interactivity while the application is in background")
      Proximiio.setNotificationIcon('ic_notification')
      Proximiio.setBufferSize({ id: 4, label: 'XLarge 10s' });

      try {
        console.log("initProximiio");
        const state = await Proximiio.authorize(PROXIMIIO_TOKEN)
        Proximiio.requestPermissions()

        let visitorId = state.visitorId;
        await this.setState({
          visitorId: visitorId,
          proximiioReady: true
        })
        console.log("visitorId: ", visitorId);
      } catch (error) {
        console.log('error: ', error);
        await this.setState({ visitorId: "auth failure" })
      }
    } else {
      await this.setState({
        visitorId: Proximiio.state.visitorId,
        proximiioReady: true
      })

      console.log("visitorId: ", Proximiio.state.visitorId);
    }

    // check other available subscription events listed below
    this.proximiioSubscriptions = {
      positionUpdates: Proximiio.subscribe(
        Proximiio.Events.PositionUpdated, this.onPositionUpdate.bind(this)
      ),
      enteredGeofence: Proximiio.subscribe(
        Proximiio.Events.EnteredGeofence, this.onGeofenceEnter.bind(this)
      ),
      exitedGeofence: Proximiio.subscribe(
        Proximiio.Events.ExitedGeofence, this.onGeofenceExit.bind(this)
      ),
      floorChanged: Proximiio.subscribe(
        Proximiio.Events.FloorChanged, this.onFloorChanged.bind(this)
      ),
      foundIBeacon: Proximiio.subscribe(
        Proximiio.Events.FoundIBeacon, this.onFoundIBeacon.bind(this)
      ),
      updatedIBeacon: Proximiio.subscribe(
        Proximiio.Events.UpdatedIBeacon, this.onUpdatedIBeacon.bind(this)
      ),
      lostIBeacon: Proximiio.subscribe(
        Proximiio.Events.LostIBeacon, this.onLostIBeacon.bind(this)
      ),
      foundEddystoneBeacon: Proximiio.subscribe(
        Proximiio.Events.FoundEddystoneBeacon, this.onFoundEddystoneBeacon.bind(this)
      ),
      updatedEddystoneBeacon: Proximiio.subscribe(
        Proximiio.Events.UpdatedEddystoneBeacon, this.onUpdatedEddystoneBeacon.bind(this)
      ),
      lostEddystoneBeacon: Proximiio.subscribe(
        Proximiio.Events.LostEddystoneBeacon, this.onLostEddystoneBeacon.bind(this)
      )
    }
  }

  onPositionUpdate(location) {
    console.log("===== Updated Location. ==========");
    console.log(location);
    /*
    this.props.userStore.updateGeoLocation(
      this.props.userStore.currentUser.id, 
      location.lat, 
      location.lng);
      */

  }

  onGeofenceEnter(geofence) {
    console.log(`entered geofence: ${geofence}`)

    var item = {
      id: geofence.id,
      name: geofence.name,
      type: 'geofence',
    }

    this.state.data.push(item);
    this.setState({data: this.state.data});       

  }

  onGeofenceExit(geofence) {
    var id = geofence.id;
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].type == "geofence" && this.state.data[i].id == id) {
        this.state.data.splice(i, 1);
        break;
      }
    }
    this.setState({data: this.state.data});
  }

  onFloorChanged(floor) {
    console.log(`changed floor: ${floor.name}`);

    this.setState({statusText: `changed floor: ${floor.name}`});
  }

  onFoundIBeacon(beacon) {
    console.log(`found ibeacon`);
    this.addBeacon(beacon);
  }

  addBeacon(beacon) {
    var item = {
      id: beacon.input.id,
      name: beacon.input.name,
      type: beacon.input.type,
    }

    this.state.data.push(item);
    this.setState({data: this.state.data}); 
  }

  removeBeacon(beacon) {
    var beacon_id = beacon.input.id;
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].id == beacon_id) {
        this.state.data.splice(i, 1);
        break;
      }
    }
    this.setState({data: this.state.data});
  }

  onUpdatedIBeacon(beacon) {
    console.log(`updated ibeacon: ${beacon}`);
  }

  onLostIBeacon(beacon) {
    console.log(`lost ibeacon`);
    this.removeBeacon(beacon);
  }

  onFoundEddystoneBeacon(beacon) {
    console.log(`found EddystoneBeacon: ${beacon}`);
    this.addBeacon(beacon);
  }

  onUpdatedEddystoneBeacon(beacon) {
    console.log(`updated EddystoneBeacon: ${beacon}`);
  }

  onLostEddystoneBeacon(beacon) {
    console.log(`lost EddystoneBeacon: ${beacon}`);
    this.removeBeacon(beacon);
  }

  // call this method before component deallocation, ie componentWillUnmount
  async destroyProximiio() {
      Object.keys(this.proximiioSubscriptions).forEach(key => this.proximiioSubscriptions[key].remove())
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onSettings() {
    this.props.navigation.navigate('Account');
  }

  onItemDetail(item) {
    this.props.navigation.navigate('Detail', {item: item});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <TouchableOpacity style={styles.menuButton} onPress={() => this.onMenu()}>
            <Image
              style={styles.settingIcon}
              source={require('./../assets/images/white_menu.png')}
            />        
          </TouchableOpacity>

          <Image
            style={styles.topLogoImage}
            source={require('./../assets/images/main_logo.png')}
          />        

          <TouchableOpacity style={styles.settingButton} onPress={() => this.onSettings()}>
            <Image
              style={styles.settingIcon}
              source={require('./../assets/images/white_settings_button.png')}
            />        
          </TouchableOpacity>
        </View>

        <FlatList
          contentContainerStyle={{ paddingBottom: offsetY / 2}}
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
          renderItem={({item, index}) =>
            <HomeCell 
              item={item} 
              onDetail={(data) => this.onItemDetail(data)}
            />
          }
        />

      </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  topView: {
    marginTop: 0,
    paddingTop: 20 + offsetY / 2,
    width: screenWidth,
    height: 80 + offsetY,
    alignItems: 'center',
    backgroundColor: '#263485',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 2,
  },

  topLogoImage: {
    width: 45,
    height: 45,
    resizeMode: "contain"
  },

  settingButton: {
    position: 'absolute',
    right: 10,
    top: offsetY * 3/4.0 + 30,
  },

  settingIcon: {
    width: 40,
    height: 40,
  },

  menuButton: {
    position: 'absolute',
    left: 10,
    top: offsetY * 3/4.0 + 30,
  }

})
