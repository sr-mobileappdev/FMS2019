import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList
} from 'react-native';

import { StackActions, NavigationActions } from 'react-navigation'
import SpeakerCell from './../components/SpeakerCell';
import { SearchBar } from 'react-native-elements';
import HomeTopBar from './../components/HomeTopBar';
import PageTitle from './../components/PageTitle';
import RefreshButton from './../components/RefreshButton';
import LoadingOverlay from './../components/LoadingOverlay';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

@inject("speakerStore", "userStore")
@observer

class SpeakerScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      search: '',
      speakers: [],
      allList: [],
    }
  }
  
  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.speakerStore.restoreSpeakerState,
        (restoreSpeakerState) => {
          if (restoreSpeakerState.isSuccessful()) {
            if (restoreSpeakerState.value) {
              let list = restoreSpeakerState.value;
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
        () => this.props.speakerStore.loadSpeakerState,
        (loadSpeakerState) => {
          if (loadSpeakerState.isSuccessful()) {
            if (loadSpeakerState.value) {
              let list = loadSpeakerState.value;
              this.parseListData(list); 
              this.setState({isLoading: false});              
            }
          }
        }
      ),
    ];

    this.props.speakerStore.restoreSpeakers();
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onPressRefresh() {
    this.setState({isLoading: true}, () => { 
      this.props.speakerStore.loadSpeakers();
    });    
  }
  
  parseListData(list) {
    let newList = [];
    let allList = [];

    for(var key in list) {
      var value = list[key];
      newList.push(value);
      allList.push(value);
    }

    newList.sort(function compare(a, b) {
      var dateA = new Date(a.datetime);
      var dateB = new Date(b.datetime);
      return dateA - dateB;
    });
    
    this.setState({speakers: newList, allList: allList});
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onSignOut() {
    this.props.userStore.signOut();
    this.props.navigation.popToTop();
  }

  onSearch(text) {
    let keyword = text.toLowerCase();
    var newList = [];

    for(var i = 0; i < this.state.allList.length; i++) {
      let item = this.state.allList[i];

      if (keyword == "") {
        newList.push(item);
      } else {
        if (item.name.toLowerCase().includes(keyword) || item.sessionname.toLowerCase().includes(keyword) || 
          item.account.toLowerCase().includes(keyword) || item.dayoftheweek.toLowerCase().includes(keyword) || 
          item.date.toLowerCase().includes(keyword)) {
          newList.push(item);
        }
      }      
    }
    
    this.setState({speakers: newList, search: text});
  }

  _renderItem = ({item, index}) => (
    <SpeakerCell
      key={index}
      item={item}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <HomeTopBar 
          onMenu={() => this.onMenu()}
          onSignOut={() => this.onSignOut()}
        />
        <PageTitle title="Speakers" />
        <SearchBar
          placeholder="Search..."
          lightTheme={true}
          onChangeText={(text) => this.onSearch(text)}
          value={this.state.search}
        />

        <FlatList
          data={this.state.speakers}
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

export default SpeakerScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})
