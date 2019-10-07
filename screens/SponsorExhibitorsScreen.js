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
import BackgroundImage from './../components/BackgroundImage';
import HomeTopBar from './../components/HomeTopBar';
import PageTitle from './../components/PageTitle';
import SponsorCell from './../components/SponsorCell';
import RefreshButton from './../components/RefreshButton';
import LoadingOverlay from './../components/LoadingOverlay';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

@inject("sponsorStore")
@observer

class SponsorExhibitorsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      title: 'Expo - Sponsors & Exhibitors',
      listData: [],
    }
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.sponsorStore.restoreSponsorState,
        (restoreSponsorState) => {
          if (restoreSponsorState.isSuccessful()) {
            if (restoreSponsorState.value) {
              let list = restoreSponsorState.value;
              this.parseListData(list);

              if (list == null || list.length == 0) {
                this.onPressRefresh();
              }
            }
          } else {
            this.onPressRefresh();
          }
        }
      ),

      reaction(
        () => this.props.sponsorStore.loadSponsorState,
        (loadSponsorState) => {
          if (loadSponsorState.isSuccessful()) {
            this.setState({isLoading: false});
            if (loadSponsorState.value) {
              let list = loadSponsorState.value;
              this.parseListData(list); 
            }
          }
        }
      ),
    ];

    this.props.sponsorStore.restoreSponsor();
  }
  
  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onPressRefresh() {
    this.setState({isLoading: true}, () => { 
      this.props.sponsorStore.loadSponsor();
    });  
    
  }

  parseListData(list) {
    let newList = [];

    for(var key in list) {
      var value = list[key];
      value.is_detail = false;
      newList.push(value);  
    }

    newList.sort(function compare(a, b) {
      return (a.account).localeCompare(b.account);
    });

    this.setState({listData: newList});
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onSignOut() {
    this.props.userStore.signOut();
    this.props.navigation.popToTop();
  }

  onSelectItem(index) {
    let newList = [];
    for (var i = 0; i < this.state.listData.length; i++) {
      let item = this.state.listData[i];
      if (index == i) {
        item.is_detail = true;
      } else {
        item.is_detail = false;
      }

      newList.push(item);
    }

    this.setState({listData: newList});
  }

  _renderItem = ({item, index}) => (
    <SponsorCell
      key={index}
      item={item}
      onSelectItem={() => this.onSelectItem(index)}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <HomeTopBar 
          onMenu={() => this.onMenu()}
          onSignOut={() => this.onSignOut()}
        />
        <PageTitle title={this.state.title} />
        <FlatList
          data={this.state.listData}
          keyExtractor={item => item.id}
          renderItem={this._renderItem}
        />

        <RefreshButton onPress={() => this.onPressRefresh()}/>
        
        {
          this.state.isLoading 
          ? <LoadingOverlay />
          : null
        }
      </View>
    );
  }
}

export default SponsorExhibitorsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})
