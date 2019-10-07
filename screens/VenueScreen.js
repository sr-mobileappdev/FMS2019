import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
} from 'react-native';

import { PROXIMIIO_TOKEN, MAPBOX_TOKEN } from '../config/constants.js';
import { StackActions, NavigationActions } from 'react-navigation'
import HomeTopBar from './../components/HomeTopBar';
import FloorListView from './../components/FloorListView';

import MapboxGL from '@react-native-mapbox-gl/maps'
import Proximiio from 'proximiio-react-native-core'
import ProximiioMap from 'proximiio-react-native-map'

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

      level: 1,
      floorList: [],
      showListView: false,

      mapLocation: [-121.97545, 37.40459],
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

    this.initMapData()
    this.props.proximiStore.loadFloors();
  }

  async initMapData() {
    ProximiioMap.on('ready', proximiioMap => {
      this.setState({ mapDataReady: true })
    })
    ProximiioMap.on('route:change', async route => {
      await this.setState({ route })
    })
    ProximiioMap.authorize(PROXIMIIO_TOKEN)
    MapboxGL.setAccessToken(MAPBOX_TOKEN)
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
            onDidFinishLoadingMap={() => { console.log('didfinishloadingmap') }}
            rotateEnabled={true}
            pitchEnabled={true}
            zoomEnabled={true}
            style={{flex:1}}
            styleURL={ProximiioMap.styleURL}>

            <MapboxGL.Camera
              ref={c => {this._camera = c}}
              zoomLevel={17}
              animationMode={'flyTo'}
              animationDuration={500}
              centerCoordinate={this.state.mapLocation}
            />

            { ProximiioMap.indoorSources(1, true, true) }
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
