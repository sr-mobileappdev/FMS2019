import React from 'react';
import {
  Icon, Dimensions
} from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';

import Start from '../screens/StartScreen';
import CreateAccount from '../screens/CreateAccountScreen';
import Home from '../screens/HomeScreen';
import Account from '../screens/AccountScreen';
import Detail from '../screens/DetailScreen';
import Other from '../screens/OtherScreen';
import Speaker from '../screens/SpeakerScreen';
import Keynote from '../screens/KeynoteScreen';
import Agenda from '../screens/AgendaScreen';
import Venue from '../screens/VenueScreen';
import Social from '../screens/SocialScreen';
import ProgramAtGlance from '../screens/ProgramAtGlanceScreen';
import MySchedule from '../screens/MyScheduleScreen';
import SponsorExhibitors from '../screens/SponsorExhibitorsScreen';
import Terms from '../screens/TermsScreen';
import SideMenu from '../components/SideMenu';

const drawNav = createDrawerNavigator({
  ProgramAtGlance: { screen: ProgramAtGlance },
  Speaker: { screen: Speaker },
  Keynote: { screen: Keynote },
  MySchedule: { screen: MySchedule },
  Agenda: { screen: Agenda },
  Venue: { screen: Venue },
  Social: { screen: Social },
  Other: { screen: Other },
  SponsorExhibitors: { screen: SponsorExhibitors },
  Account: { screen: Account},  
},{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    drawerType: 'slide',
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get('window').width - 50,  
});


const RootStack = createStackNavigator({
    Start: { screen: Start },
    CreateAccount: { screen: CreateAccount},
    Home: { screen: drawNav},
    Home_noTransition: { screen: drawNav },
    Terms: { screen: Terms },
    Detail: { screen: Detail},
}, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  },
	transitionConfig: (sceneProps) => ({
      transitionSpec: {
        duration: sceneProps.scene.route.routeName.endsWith('_noTransition') ? 0 : 260,
      },
    }),
});

const AppNavigator = createAppContainer(RootStack);
export default AppNavigator;

