import React from 'react';
import { 
	Dimensions,
	Text, 
	Image, 
	StyleSheet, 
	TouchableOpacity, 
	View,
	FlatList,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import PropTypes from "prop-types";
import MenuItem from "./MenuItem";

const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;

var offsetY = 0;
if (screenHeight >= 812) {
  offsetY = 40;
}

export default class SideMenu extends React.Component {
	constructor(props) {
    	super(props)

    	this.state = {
	      data: [
    	    {
        	  name: 'Program at a Glance',
          	page: 'ProgramAtGlance',
        	},
        	{
        	  name: 'Speakers',
          	page: 'Speaker',
        	},
        	{
        	  name: 'Venue',
          	page: 'Venue',
        	},
        	{
        	  name: 'Exhibitors & Sponsors',
          	page: 'SponsorExhibitors',
        	},
        	{
        	  name: 'Keynotes',
          	page: 'Keynote',
        	},
        	{
        	  name: 'My Schedule',
          	page: 'MySchedule',
        	},
        	{
        	  name: 'Social',
          	page: 'Social',
        	},
          {
            name: 'Account Settings',
            page: 'Account',
          }
      	],
   	}
  }

  onSelectItem(item) {
    this.props.navigation.toggleDrawer();
    const navigateAction = NavigationActions.navigate({
      routeName: item.page,
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    return (
	    <View style={styles.container}>
        <View style={styles.headerView}>
        	<Text style={styles.headerTitle}>MENU</Text>
        </View>

        <FlatList
	        data={this.state.data}
	        keyExtractor={item => item.name}
	        renderItem={({ item }) => (
	          <MenuItem
	            data={item}
	            onSelectItem={(item) => this.onSelectItem(item)}
	          />
	        )}
	     />
	    </View>
    );
  }
}

SideMenu.propTypes = {
	
}

const styles = StyleSheet.create({
	container: {
    backgroundColor: '#0A6CB5',
    flex: 1,
	},

	headerView: {
		width: '100%',
		backgroundColor: '#263485',
		paddingTop: 10 + offsetY,
		borderBottomWidth: 2,
		borderBottomColor: 'white',
	},

	headerTitle: {
    fontFamily: 'FuturaPT-Bold',
		fontSize: 30,
		color: 'white',
		fontWeight: 'bold',
		padding: 16,
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
  	textShadowOffset: {width: 0, height: 2},
  	textShadowRadius: 5,
	},
});