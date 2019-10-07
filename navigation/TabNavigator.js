import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';

import Dashboard from '../screens/DashboardScreen';
import Discover from '../screens/DiscoverScreen';
import Users from '../screens/UsersScreen';

const TabStack = createBottomTabNavigator({
    Dashboard: { 
    	screen: Dashboard, 
    	navigationOptions: {
        	tabBarLabel: 'Dashboard',
    	}
    },
    Discover: { 
    	screen: Discover,
    	navigationOptions: {
        	tabBarLabel: 'Discover',
    	}
    },
    Users: { 
    	screen: Users,
    	navigationOptions: {
        	tabBarLabel: 'Users',
    	}
    },
});

export default TabStack;

