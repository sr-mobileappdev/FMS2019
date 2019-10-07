import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList
} from 'react-native';

import { StackActions, NavigationActions } from 'react-navigation'
import SpeakerCell from './../components/SpeakerCell';
import HomeTopBar from './../components/HomeTopBar';
import PageTitle from './../components/PageTitle';
import RefreshButton from './../components/RefreshButton';
import LoadingOverlay from './../components/LoadingOverlay';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

@inject("keynoteStore", "userStore")
@observer

class KeynoteScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      keynotes: [],
    }
  }
  
  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.keynoteStore.restoreKeynoteState,
        (restoreKeynoteState) => {
          if (restoreKeynoteState.isSuccessful()) {
            if (restoreKeynoteState.value) {
              let list = restoreKeynoteState.value;
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
        () => this.props.keynoteStore.loadKeynoteState,
        (loadKeynoteState) => {
          if (loadKeynoteState.isSuccessful()) {
            if (loadKeynoteState.value) {
              let list = loadKeynoteState.value;
              this.parseListData(list); 
              this.setState({isLoading: false});              
            }
          }
        }
      ),
    ];

    this.props.keynoteStore.restoreKeynotes();
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onPressRefresh() {
    this.setState({isLoading: true}, () => { 
      this.props.keynoteStore.loadKeynotes();
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

    this.setState({keynotes: newList, allList: allList});
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onSignOut() {
    this.props.userStore.signOut();
    this.props.navigation.popToTop();
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
        <PageTitle title="Keynotes" />

        <FlatList
          data={this.state.keynotes}
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

export default KeynoteScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})
