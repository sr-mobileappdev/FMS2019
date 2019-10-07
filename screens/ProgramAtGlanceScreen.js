import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { StackActions, NavigationActions } from 'react-navigation'
import HomeTopBar from './../components/HomeTopBar';
import ColorButton from './../components/ColorButton';
import PageTitle from './../components/PageTitle';
import SplashScreen from 'react-native-splash-screen';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

@inject("userStore")
@observer

class ProgramAtGlanceScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    SplashScreen.hide();
  }              

  moveAgendaPage(title, date) {
    this.props.navigation.navigate('Agenda', {title: title, date: date}); 
  }

  keynoteAllDays() {
    this.props.navigation.navigate('Keynote');  
  }

  expoSponsors() {
    this.props.navigation.navigate('SponsorExhibitors');  
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onSignOut() {
    this.props.userStore.signOut();
    this.props.navigation.popToTop();
  }

  render() {
    return (
      <View style={styles.container}>
        <HomeTopBar 
          onMenu={() => this.onMenu()}
          onSignOut={() => this.onSignOut()}
        />
        <ScrollView>
          <PageTitle title="Program at a Glance" />
          <Text style={styles.subTitle}>2019 Sessions</Text>

          <View style={styles.oneRowView}>
            <Text style={styles.proText}>PRO</Text>
            <Text style={styles.descriptionText}>= Paid Registration Only</Text>
          </View>

          <View style={styles.oneRowView}>
            <Text style={styles.openText}>Open</Text>
            <Text style={styles.descriptionText}>= Open to All Registered attendees</Text>
          </View>

          <View style={styles.buttonView}>
            <ColorButton 
              style={styles.colorButton} 
              title="Pre-Conference Monday, August 5" 
              color="orange" 
              onPress={() => this.moveAgendaPage('Pre-Conference Monday, August 5', '08-05')}
            />

            <ColorButton 
              style={styles.colorButton} 
              title="Conference Tuesday, August 6" 
              color="blue" 
              onPress={() => this.moveAgendaPage('Conference Tuesday, August 6', '08-06')}
            />

            <ColorButton 
              style={styles.colorButton} 
              title="Conference Wednesday, August 7" 
              color="blue" 
              onPress={() => this.moveAgendaPage('Conference Wednesday, August 7', '08-07')}
            />

            <ColorButton 
              style={styles.colorButton} 
              title="Conference Thursday, August 8" 
              color="blue" 
              onPress={() => this.moveAgendaPage('Conference Thursday, August 8', '08-08')}
            />

            <ColorButton 
              style={styles.colorButton} 
              title="Keynotes All Days" 
              color="green" 
              onPress={() => this.keynoteAllDays()} 
            />

            <ColorButton 
              style={styles.colorButton} 
              title="Expo – Sponsors & Exhibitors" 
              color="orange" 
              onPress={() => this.expoSponsors()} 
            />
          </View>
          

        </ScrollView>
      </View>
    );
  }
}

export default ProgramAtGlanceScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  subTitle: {
    textAlign: 'center',
    color: 'magenta',
    fontFamily: 'FuturaPT-Medium',
    marginTop: 24,
    marginBottom: 10,
    fontSize: 22,
  },

  descriptionText: {
    fontFamily: 'FuturaPT-Book',
    marginLeft: 5,
  },

  proText: {
    fontFamily: 'FuturaPT-Bold',
    color: 'darkorange',
  },

  openText: {
    fontFamily: 'FuturaPT-Bold',
    color: 'green',
  },

  oneRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonView: {
    marginTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 40,
  },

  colorButton: {
    marginBottom: 10,
  },
})
