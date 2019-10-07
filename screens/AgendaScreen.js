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

import { NavigationActions, withNavigation } from 'react-navigation'
import BackgroundImage from './../components/BackgroundImage';
import AgendaCell from './../components/AgendaCell';
import TopBar from './../components/TopBar';
import PageTitle from './../components/PageTitle';
import RefreshButton from './../components/RefreshButton';
import LoadingOverlay from './../components/LoadingOverlay';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

@inject("agendaStore")
@observer

class AgendaScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      title: '',
      date: '',
      listData: [],
    }
  }

  componentDidMount() {
    console.log("Test");

    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      const date = this.props.navigation.getParam('date');
      const title = this.props.navigation.getParam('title');      
      this.setState({title: title, date: date});
      this.props.agendaStore.restoreAgenda();
    });

    this.disposes = [
      reaction(
        () => this.props.agendaStore.restoreAgendaState,
        (restoreAgendaState) => {
          if (restoreAgendaState.isSuccessful()) {
            if (restoreAgendaState.value) {
              let list = restoreAgendaState.value;
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
        () => this.props.agendaStore.loadAgendaState,
        (loadAgendaState) => {
          if (loadAgendaState.isSuccessful()) {
            if (loadAgendaState.value) {
              let list = loadAgendaState.value;
              this.parseListData(list); 
              this.setState({isLoading: false});              
            }
          }
        }
      ),
    ];
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
    this.focusListener.remove();
  }


  onPressRefresh() {
    this.setState({isLoading: true}, () => { 
      console.log("onPressRefresh");
      this.props.agendaStore.loadAgenda();
    });    
  }

  parseListData(list) {
    let newList = [];

    for(var key in list) {
      var value = list[key];
      if (value.date.indexOf(this.state.date) >= 0) {
        newList.push(value);  
      }      
    }

    newList.sort(function compare(a, b) {
      var dateA = new Date(a.datetime);
      var dateB = new Date(b.datetime);
      return dateA - dateB;
    });

    console.log("newList = ", newList);
    this.setState({listData: newList});
  }

  onBack() {
    this.props.navigation.goBack();
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
    <AgendaCell
      key={index}
      item={item}
      onSelectItem={() => this.onSelectItem(index)}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <TopBar onBack={() => this.onBack()}/>
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

export default AgendaScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})
