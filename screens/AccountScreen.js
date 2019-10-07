import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'
import HomeTopBar from './../components/HomeTopBar';
import PageTitle from './../components/PageTitle';
import RefreshButton from './../components/RefreshButton';
import LoadingOverlay from './../components/LoadingOverlay';
import RoundButton from './../components/RoundButton';
import FormInput from './../components/FormInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

@inject("userStore")
@observer

class AccountScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)

    this.state = {
      user_id: '',
      firstName: '',
      lastName: '',
      title: '',
      company: '',
      cellPhone: '',
      twitter: '',
      linkedIn: '',
      photoURL: '',

      isLoading: false,
    }
  }

  onMenu() {
    this.props.navigation.toggleDrawer();
  }

  onSignOut() {
    this.props.userStore.signOut();
    this.props.navigation.popToTop();
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.userStore.updateUserState,
        (updateUserState) => {

          if (updateUserState.isSuccessful()) {
            this.setState({isLoading: false});
          } else if(updateUserState.isFailed()) {
            var error = updateUserState.error;
            this.setState({isLoading: false});

            Alert.alert(
              'Error!!!',
              error,
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]
            );
            
          }
        }),
    ];


    var user_id = "";
    if (this.props.userStore.currentUser.id) {
      user_id = this.props.userStore.currentUser.id;
    }

    var first_name = "";
    if (this.props.userStore.currentUser.rie__First_Name__c) {
      first_name = this.props.userStore.currentUser.rie__First_Name__c;
    }

    var last_name = "";
    if (this.props.userStore.currentUser.rie__Last_Name__c) {
      last_name = this.props.userStore.currentUser.rie__Last_Name__c;
    }

    var title = "";
    if (this.props.userStore.currentUser.rie__Job_Title__c) {
      title = this.props.userStore.currentUser.rie__Job_Title__c;
    }

    var company = "";
    if (this.props.userStore.currentUser.rie__Company__c) {
      company = this.props.userStore.currentUser.rie__Company__c;
    }

    var cellPhone = "";
    if (this.props.userStore.currentUser.rie__Mobile__c) {
      cellPhone = this.props.userStore.currentUser.rie__Mobile__c;
    }

    var twitter = "";
    if (this.props.userStore.currentUser.rie__Twitter__c) {
      twitter = this.props.userStore.currentUser.rie__Twitter__c;
    }

    var linkedIn = "";
    if (this.props.userStore.currentUser.rie__Linkedin_Public_URL__c) {
      linkedIn = this.props.userStore.currentUser.rie__Linkedin_Public_URL__c;
    }

    var photoURL = "";
    if (this.props.userStore.currentUser.rie__Photo__c) {
      photoURL = this.props.userStore.currentUser.rie__Photo__c;
    }

    this.setState({
      user_id: user_id,
      firstName: first_name,
      lastName: last_name,
      title: title,
      company: company,
      cellPhone: cellPhone,
      twitter: twitter,
      linkedIn: linkedIn,
      photoURL: photoURL,
    });

  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onUpdateProfile() {
    Keyboard.dismiss();

    const data = {
      user_id: this.state.user_id,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      title: this.state.title,
      company: this.state.company,
      cellPhone: this.state.cellPhone,
      twitter: this.state.twitter,
      linkedIn: this.state.linkedIn,
      photoURL: this.state.photoURL,
    };

    this.setState({isLoading: true});
    this.props.userStore.updateProfile(data);
  }

  render() {
    return (
      <View style={styles.container}>
        <HomeTopBar 
          onMenu={() => this.onMenu()}
          onSignOut={() => this.onSignOut()}
        />
        <PageTitle title="Account Settings" />
        
        <KeyboardAwareScrollView style={styles.formView}>
          <FormInput 
            style={styles.textView} 
            type="text" 
            placeholder="First Name" 
            value={this.state.firstName} 
            onChangeText={(text) => this.setState({firstName: text, errorMessage: null})} />

          <FormInput 
            style={styles.textView} 
            type="text" 
            placeholder="Last Name" 
            value={this.state.lastName} 
            onChangeText={(text) => this.setState({lastName: text, errorMessage: null})} />

          <FormInput 
            style={styles.textView} 
            type="text" 
            placeholder="Your Title" 
            value={this.state.title} 
            onChangeText={(text) => this.setState({title: text, errorMessage: null})} />

          <FormInput 
            style={styles.textView} 
            type="text" 
            placeholder="Company" 
            value={this.state.company} 
            onChangeText={(text) => this.setState({company: text, errorMessage: null})} />

          <FormInput 
            style={styles.textView} 
            type="text" 
            placeholder="Cell Phone" 
            value={this.state.cellPhone} 
            onChangeText={(text) => this.setState({cellPhone: text, errorMessage: null})} />

          <FormInput 
            style={styles.textView} 
            type="text" 
            placeholder="Twitter" 
            value={this.state.twitter} 
            onChangeText={(text) => this.setState({twitter: text, errorMessage: null})} />

          <FormInput 
            style={styles.textView} 
            type="text" 
            placeholder="Full LinkedIn URL" 
            value={this.state.linkedIn} 
            onChangeText={(text) => this.setState({linkedIn: text, errorMessage: null})} />

          <FormInput 
            style={styles.textView} 
            type="text" 
            placeholder="Photo URL" 
            value={this.state.photoURL} 
            onChangeText={(text) => this.setState({photoURL: text, errorMessage: null})} />

          <RoundButton style={styles.updateProfileButton} title="Update Profile" onPress={() => this.onUpdateProfile()} />
        </KeyboardAwareScrollView>

        {
          this.state.isLoading 
          ? <LoadingOverlay />
          : null
        }
      </View>
    );
  }
}

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3edee',
  },

  formView: {
    padding: 20,
  },

  textView: {
    marginTop: 7,
    marginBottom: 7,
  },

  updateProfileButton: {
    marginTop: 20,
    marginBottom: 40,
  },
})
