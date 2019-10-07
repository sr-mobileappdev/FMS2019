import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Button,
  Platform  
} from 'react-native';

import { StackActions, NavigationActions } from 'react-navigation'
import BackgroundImage from './../components/BackgroundImage';
import ScheduleCell from './../components/ScheduleCell';
import HomeTopBar from './../components/HomeTopBar';
import PageTitle from './../components/PageTitle';
import RefreshButton from './../components/RefreshButton';
import LoadingOverlay from './../components/LoadingOverlay';
import SegmentedControlTab from "react-native-segmented-control-tab";
import {ExpandableCalendar, AgendaList, CalendarProvider} from 'react-native-calendars';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

const today = new Date().toISOString().split('T')[0];
const fastDate = getPastDate(3); 
const futureDates = getFutureDates(9);
const dates = [fastDate, today].concat(futureDates);

function getFutureDates(days) {
  const array = [];
  for (let index = 1; index <= days; index++) {
    const date = new Date(Date.now() + (864e5 * index)); // 864e5 == 86400000 == 24*60*60*1000
    const dateString = date.toISOString().split('T')[0];
    array.push(dateString);
  }
  return array;
}

function getPastDate(days) {
  return new Date(Date.now() - (864e5 * days)).toISOString().split('T')[0];
}

@inject("scheduleStore", "userStore")
@observer

class MyScheduleScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      user_id: null,
      isLoading: false,
      selectedIndex: 0,
      schedules: [],
      allList: [],
      calendarNoteData: [],
    }
  }
  
  componentDidMount() {
    var user_id = "";
    if (this.props.userStore.currentUser.id) {
      user_id = this.props.userStore.currentUser.id;
      this.setState({user_id});
    }

    this.disposes = [
      reaction(
        () => this.props.scheduleStore.restoreScheduleState,
        (restoreScheduleState) => {
          if (restoreScheduleState.isSuccessful()) {
            if (restoreScheduleState.value) {
              let list = restoreScheduleState.value;
              this.parseListData(list);

              if (list.length > 0) {
                this.onPressRefresh();
              }
            }
          } else {
            this.onPressRefresh();
          }
        }
      ),

      reaction(
        () => this.props.scheduleStore.loadScheduleState,
        (loadScheduleState) => {
          if (loadScheduleState.isSuccessful()) {
            if (loadScheduleState.value) {
              let list = loadScheduleState.value;
              this.parseListData(list); 
              this.setState({isLoading: false});              
            }
          }
        }
      ),
    ];

    this.props.scheduleStore.restoreSchedule();
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onPressRefresh() {
    this.setState({isLoading: true}, () => { 
      this.props.scheduleStore.loadSchedule(this.state.user_id);
    });    
  }

  onSignOut() {
    this.props.userStore.signOut();
    this.props.navigation.popToTop();
  }

  getStartHour(start_date) {
    var date1 = new Date(start_date);
    var hours = date1.getHours();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;

    return hours + ampm;
  }

  getDuration(start_date, end_date) {
    var date1 = new Date(start_date);
    var date2 = new Date(end_date);

    var oneDay = 24 * 60 * 60 * 1000;
    var diffDays = Math.abs((date1.getTime() - date2.getTime()) / (oneDay));

    if (diffDays >= 1) {
      return parseInt(diffDays) + "d";
    }

    var oneHour = 60 * 60 * 1000;
    var diffHours = Math.abs((date1.getTime() - date2.getTime()) / (oneHour));    
    if (diffHours >= 1) {
      return parseInt(diffHours) + "h";
    }

    var oneMinute = 60 * 1000;
    var diffMinute = Math.abs((date1.getTime() - date2.getTime()) / (oneMinute));    
    if (diffMinute >= 1) {
      return parseInt(diffMinute) + "m";
    }

    return "";
  }
  
  parseListData(list) {
    let newList = [];
    let allList = [];

    for(var key in list) {
      var value = list[key];
      newList.push(value);
      allList.push(value);
    }

    var calendarData = [];
    for (var i = 0; i < newList.length; i++) {
      var item = newList[i];
      var title = item.fields.Session_Name__c;
      var session_date = item.fields.rie__Session_Date__c;
      var start_date = item.fields.rie__Session_Start_Time__c;
      var end_date = item.fields.rie__Session_End_Time__c;

      var startHour = this.getStartHour(start_date);
      var duration = this.getDuration(start_date, end_date);

      var date = (new Date(session_date)).toISOString().split('T')[0];

      var is_existing = false;
      for (var j = 0; j < calendarData.length; j++) {
        var c_item = calendarData[j];

        if (date == c_item.title) {
          is_existing = true;
          c_item.data.push(
            {
              hour: startHour,
              duration: duration,
              title: title
            }
          );
          break;
        }
      }

      if (!is_existing) {
        calendarData.push({
          title: date,
          data: [{
            hour: startHour,
            duration: duration,
            title: title
          }]
        });
      }
    }

    this.setState({schedules: newList, allList: allList, calendarNoteData: calendarData});
  }

  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });
  };

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  _renderItem = ({item, index}) => (
    <ScheduleCell
      key={index}
      item={item}
    />
  );

  onDateChanged = (/* date, updateSource */) => {
    // console.warn('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
    // fetch and set data for date + week ahead
  }

  onMonthChange = (/* month, updateSource */) => {
    // console.warn('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
  }
  
  buttonPressed() {
    Alert.alert('show more');
  }

  itemPressed(id) {
    Alert.alert(id);
  }

  getTheme = () => {
    const themeColor = '#0059ff';
    const lightThemeColor = '#e6efff';
    const disabledColor = '#a6acb1';
    const black = '#20303c';
    const white = '#ffffff';
    
    return {
      // arrows
      arrowColor: black,
      arrowStyle: {padding: 0},
      // month
      monthTextColor: black,
      textMonthFontSize: 16,
      textMonthFontFamily: 'HelveticaNeue',
      textMonthFontWeight: 'bold',
      // day names
      textSectionTitleColor: black,
      textDayHeaderFontSize: 12,
      textDayHeaderFontFamily: 'HelveticaNeue',
      textDayHeaderFontWeight: 'normal',
      // today
      todayBackgroundColor: lightThemeColor,
      todayTextColor: themeColor,
      // dates
      dayTextColor: themeColor,
      textDayFontSize: 18,
      textDayFontFamily: 'HelveticaNeue',
      textDayFontWeight: '500',
      textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},
      // selected date
      selectedDayBackgroundColor: themeColor,
      selectedDayTextColor: white,
      // disabled date
      textDisabledColor: disabledColor,
      // dot (marked date)
      dotColor: themeColor,
      selectedDotColor: white,
      disabledDotColor: disabledColor,
      dotStyle: {marginTop: -2}
    };
  }

  getMarkedDates = () => {
    const marked = {};
    this.state.calendarNoteData.forEach(item => {
      // only mark dates with data
      if (item.data && item.data.length > 0 && item.data[0]) {
        marked[item.title] = {marked: true};
      }
    });
    return marked;
  }


  renderEventItem = ({item}) => {
    if (!item) {
      return this.renderEmptyItem();
    }
    
    return (
      <TouchableOpacity 
        onPress={() => this.itemPressed(item.title)} 
        style={styles.item}
      >
        <View style={styles.timeView}>
          <Text style={styles.itemHourText}>{item.hour}</Text>
          <Text style={styles.itemDurationText}>{item.duration}</Text>
        </View>
        <Text style={styles.itemTitleText}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  renderEmptyItem() {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <HomeTopBar 
          onMenu={() => this.onMenu()}
          onSignOut={() => this.onSignOut()}
        />
        <PageTitle title="My Schedule" />
        <View style={styles.categoryView}>
          <SegmentedControlTab
            values={["List View", "Calendar View"]}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
          />
        </View>
        
        {
          this.state.selectedIndex == 0
          ? <FlatList
              data={this.state.schedules}
              keyExtractor={item => item.Id}
              renderItem={this._renderItem}
            />
          : <CalendarProvider 
              date={ this.state.calendarNoteData.length > 0 ? this.state.calendarNoteData[0].title : ''} 
              onDateChanged={this.onDateChanged} 
              onMonthChange={this.onMonthChange}
              theme={{todayButtonTextColor: '#0059ff'}} 
              showTodayButton 
              disabledOpacity={0.6}
            >
              <ExpandableCalendar 
                firstDay={1}
                markedDates={this.getMarkedDates()} // {'2019-06-01': {marked: true}, '2019-06-02': {marked: true}, '2019-06-03': {marked: true}};
                theme={this.getTheme()}
              />
              <AgendaList
                sections={this.state.calendarNoteData}
                extraData={this.state}
                renderItem={this.renderEventItem}
              />
            </CalendarProvider>
        }

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

export default MyScheduleScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  categoryView: {
    padding: 15,
  },

  calendar: {
    paddingLeft: 20, 
    paddingRight: 20
  },
  section: {
    backgroundColor: '#f0f4f7', 
    color: '#79838a'
  },
  item: {
    padding: 20, 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e8ecf0', 
    flexDirection: 'row',
  },

  timeView: {
    width: '15%',
  },

  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey', 
    fontSize: 12, 
    marginTop: 4,
    marginLeft: 4
  },

  itemTitleText: {
    color: 'black', 
    marginLeft: 16, 
    fontWeight: 'bold', 
    fontSize: 16,
    width: '85%',
  },

  itemButtonContainer: {
    flex: 1, 
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52, 
    justifyContent: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#e8ecf0' 
  },
  emptyItemText: {
    color: '#79838a',
    fontSize: 14
  }
})
