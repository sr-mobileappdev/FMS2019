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
import TopBar from './../components/TopBar';

const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;

var offsetY = 0;
if (screenHeight == 896) {
  offsetY = 40;
}

class DetailScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)

    this.state = {
      mainImage: require('./../assets/images/James_Whale.jpg'),
      nameText: '',
   }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    const data = this.props.navigation.getParam('item');
    const name = data['name'];
    const type = data['type'];

    var image = require('./../assets/images/James_Whale.jpg');
    if (type == "beacon") {
      image = require('./../assets/images/truck.jpg');
    } 

    this.setState({nameText: name, mainImage: image});
  }

  render() {
    return (
      <View style={styles.container}>
        
        <TopBar onBack={() => this.onBack()}/>
        <View style={styles.containerView}>
          <Image
              style={styles.profileImage}
              source={this.state.mainImage}
            />    

          <View style={styles.infoView}>
            <Text style={styles.usernameText}>{this.props.navigation.getParam('item')['name']}</Text>    
            <Text style={styles.companyText}>Company: Real Intelligence</Text>
            <Text style={styles.descripionText}>Real location Intelligence is my focus. I have a vision and want to execute on that vision.</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  profileImage: {
    height: 300,
    width: '100%',
  },

  infoView: {
    padding: 15,
    backgroundColor: 'white',
    height: '100%',
  },

  usernameText: {
    fontSize: 34,
    marginBottom: 10,
  },

  companyText: {
    fontSize: 28,
    color: 'gray',
    marginBottom: 10,
  },

  descripionText: {
    fontSize: 20,
    color: 'gray',
  },
})
