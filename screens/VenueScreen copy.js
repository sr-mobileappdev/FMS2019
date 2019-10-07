import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import { PROXIMIIO_TOKEN, MAPBOX_TOKEN } from '../config/constants.js';
import { StackActions, NavigationActions } from 'react-navigation'
import HomeTopBar from './../components/HomeTopBar';
import FloorListView from './../components/FloorListView';

import MapboxGL from '@react-native-mapbox-gl/maps'
import Proximiio from 'proximiio-react-native-core'
import ProximiioMap from 'proximiio-react-native-map'

const CAMERA_ANIM_DURATION = 500

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

@inject("userStore", "proximiStore")
@observer

class VenueScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {

      floorList: [],
      showListView: false,

      visitorId: 'unauthorized',
      userLocation: null,
      mapLocation: [-121.97545, 37.40459],
      zoom: 15,
      routeToItem: null,
      route: null,
      floor: null,
      level: 0,
      style: null,
      showFloorplan: true,
      showGeoJSON: true,
      routeListVisible: false,
      mapDataReady: false,
      proximiioReady: false,
      geofences: [],
      privacyZones: [],
      trackingEnabled: true,
      scannerEnabled: true,
      showPositioning: false,
      showSettings: false,
      cameraMode: 'flyTo',
      buffer: Proximiio.BufferSizes[2],
      styleReady: false,
      maxBounds: null
    }
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.proximiStore.loadFloorsState,
        (loadFloorsState) => {
          
          if (loadFloorsState.isSuccessful()) {
            let list = loadFloorsState.value;
            const keys = Object.keys(list);
            var floors = [];
            for (var i = 0; i < keys.length; i++) {
              let key = keys[i];
              floors.push(list[key]);
            }
            
            this.setState({floorList: floors});
          }
        }),
    ];

    this._mounted = true

    this.initMapData()
    this.props.proximiStore.loadFloors();
  }

  componentWillUnmount() {
    this._mounted = false
  }

  async _setState(state) {
    if (this._mounted) {
      await this.setState(state)
    } else {
      console.log('skipping state set for state (component not mounted): ', state)
    }
  }

  async initProximiio() {
    if (!Proximiio.isAuthorized()) {
      await this._setState({ visitorId: "authorizing..." })

      Proximiio.setNotificationMode(Proximiio.NotificationModes.Enabled)
      Proximiio.setNotificationTitle("Proximi.io Background Service")
      Proximiio.setNotificationText("Allows location interactivity while the application is in background")
      Proximiio.setNotificationIcon('ic_notification')

      try {
        console.log('authorizing proximiio sdk')
        const state = await Proximiio.authorize(PROXIMIIO_TOKEN)
        Proximiio.requestPermissions()
        await this._setState({
          visitorId: state.visitorId,
          proximiioReady: true
        })
        console.log('proximiio authorized')
      } catch (error) {
        console.warn('proximiio authorization failed')
        await this._setState({ visitorId: "auth failure" })
      }
    } else {
      await this._setState({
        visitorId: Proximiio.state.visitorId,
        proximiioReady: true
      })
    }

    this.subscriptions = {
      positionUpdates: Proximiio.subscribe(
        Proximiio.Events.PositionUpdated, this.onPositionUpdate.bind(this)
      ),
      floorChange: Proximiio.subscribe(
        Proximiio.Events.FloorChanged, this.onFloorChange.bind(this)
      ),
      enteredGeofence: Proximiio.subscribe(
        Proximiio.Events.EnteredGeofence, this.onGeofenceEnter.bind(this)
      ),
      exitedGeofence: Proximiio.subscribe(
        Proximiio.Events.ExitedGeofence, this.onGeofenceExit.bind(this)
      )
    }
  }

  async initMapData() {
    MapboxGL.setAccessToken(MAPBOX_TOKEN);

    if (!ProximiioMap.loaded) {
      ProximiioMap.useDottedRouteLine = true

      ProximiioMap.poiTextStyle = {
        textOffset: [0, 2],
        textSize: 14,
        textFont: ProximiioMap.font,
        symbolPlacement: 'point',
        textAllowOverlap: false
      }

      ProximiioMap.routeLineStyle = {
        lineOpacity: 1,
        lineColor: '#0080c0',
        lineWidth: 12,
        lineDasharray: ['literal', [0.5, 0.5]]
      }

      ProximiioMap.on('ready', async proximiioMap => {
        ProximiioMap.routeIconSize = 1
        ProximiioMap.updateImages()
        await this.setState({ mapDataReady: true })
      })

      ProximiioMap.on('route:change', async route => {
        await this.setState({ route })
      })

      ProximiioMap.on('press:poi', async feature => {
        const state = { mapLocation: feature.geometry.coordinates }
        if (this._map) {
          const zoom = await this._map.getZoom()
          state.zoom = zoom
        }

        await this.setState(state)
      })

      try {
        await ProximiioMap.authorize(PROXIMIIO_TOKEN)
      } catch (e) {
        console.error('map init failure', e)
      }
    } else {
      this.setState({mapDataReady: true})
    }
  }

  componentWillUnmount() {
    Object.keys(this.subscriptions).forEach(key => this.subscriptions[key].remove())
  }

  notify(title, short = false) {
    console.log('[Notify]', title)
  }

  async onFloorChange(floor) {
    // console.log('on floor change', floor)
    if (floor != null && typeof floor.level !== 'undefined') {
      await this.setState({
        level: floor.level
      })
      this.notify(`Floor Changed: ${floor.name}, ${floor.level}`)
    }
  }

  async levelUp() {
    if (this.state.trackingEnabled) this.toggleTracking()
    await this.setState({ level: this.state.level + 1 })
    this.notify(`Map level changed to: ${this.state.level}`)
  }

  async levelDown() {
    if (this.state.trackingEnabled) this.toggleTracking()
    await this.setState({ level: this.state.level - 1 })
    this.notify(`Map level changed to: ${this.state.level}`)
  }

  async onGeofenceEnter(geofence) {
    this.notify(`Entered geofence: ${geofence.name}`)
  }

  async onGeofenceExit(geofence) {
    this.notify(`Left geofence: ${geofence.name}`)
  }

  async togglePositioning() {
    await this.setState({ showPositioning: !this.state.showPositioning })
  }

  async toggleScanner() {
    if (!this.state.scannerEnabled) {
      Proximiio.enable()
      await this.setState({ scannerEnabled: true })
    } else {
      Proximiio.disable()
      await this.cancelRoute()
      if (this.state.trackingEnabled) {
        await this.toggleTracking()
      }
      await this.setState({
        floor: null,
        userLocation: null,
        scannerEnabled: false
      })
    }
  }

  async onStyleLoaded () {
    await this.setState({
      styleReady: true,
      mapLocation: [-121.97545, 37.40459],
    })
  }

  async onPoiPress(item) {
    ProximiioMap.cancelRoute()

    await this.setState({
      route: null,
      routeToItem: null,
      trackingEnabled: false,
      routeListVisible: false,
      mapLocation: item.geometry.coordinates,
      level: item.properties.level,
      lastFeature: item
    })
  }

  renderNavigation() {
    if (!this.state.route || !this.state.routeToItem)
      return null

    return <NavigationView
      route={this.state.route}
      routeToItem={this.state.routeToItem}
      showPositioning={this.state.showPositioning}
      onRouteCancel={this.cancelRoute}
    />
  }

  renderLocation() {
    if (this.state.userLocation) {
      if (this.state.showPositioning) {
        return <LocationView
          key="locationView"
          buffer={this.state.buffer}
          trackingEnabled={this.state.trackingEnabled}
          snappingEnabled={this.state.snappingEnabled}
          mapLevel={this.state.level}
          scannerEnabled={this.state.scannerEnabled}
          onScannersToggle={this.toggleScanner}
        />
      } else {
        return null
      }
    } else {
      return <LocationWait
        scannerEnabled={this.state.scannerEnabled}
        onScannersToggle={this.toggleScanner}
      />
    }
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onSignOut() {
    this.props.userStore.signOut();
    const popAction = StackActions.pop({
      n: 1,
    });
    this.props.navigation.dispatch(popAction);
  }

  onShowListView() {
    this.setState({showListView: true});
  }

  onCloseListView() {
    this.setState({showListView: false});
  }

  onSelectedFloor(item) {
    console.log("onSelectedFloor = ", item);
    this.setState({mapLocation: item.geopoint});
  }

  render() {
    return (
      <View style={styles.container}>
        <HomeTopBar 
          onMenu={() => this.onMenu()}
          onSignOut={() => this.onSignOut()}
        />

        <View style={{flex: 1}}>
          <MapboxGL.MapView
            key="mapContainer"
            ref={c => (this._map = c)}
            compassEnabled={false}
            onRegionWillChange={this.onRegionWillChange}
            onDidFinishLoadingStyle={this.onStyleLoaded}
            onDidFinishLoadingMap={() => { console.log('didfinishloadingmap') }}
            rotateEnabled={true}
            pitchEnabled={true}
            zoomEnabled={true}
            style={{flex:1}}
            styleURL={ProximiioMap.styleURL}>

            <MapboxGL.Camera
              ref={c => {this._camera = c}}
              zoomLevel={this.state.zoom}
              animationMode={'flyTo'}
              animationDuration={CAMERA_ANIM_DURATION}
              centerCoordinate={this.state.mapLocation}
            />

            { ProximiioMap.indoorSources(this.state.level, this.state.showFloorplan, this.state.showGeoJSON) }
          </MapboxGL.MapView>

          <TouchableOpacity style={styles.mapListButton} onPress={() => this.onShowListView()}>
            <Image
              style={styles.mapListImage}
              source={require('./../assets/images/map_list.png')}
            />
          </TouchableOpacity>


          {
            this.state.showListView 
            ? <FloorListView 
                items={this.state.floorList} 
                onSelectItem={(item) => this.onSelectedFloor(item)} 
                onClose={() => this.onCloseListView()} />
            : null
          }
          
        </View>
        
      </View>
    );
  }
}

export default VenueScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  map: {
    flex: 1
  },

  mapListButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },

  mapListImage: {
    width: 30,
    height: 30,
  },



})
