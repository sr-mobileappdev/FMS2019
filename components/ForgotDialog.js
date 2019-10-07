import React from 'react';
import { Dimensions, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from "prop-types";
import FormInput from './FormInput';
import RoundButton from './RoundButton';
import Messages from '../constants/Messages';

const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;

export default class ForgotDialog extends React.Component {
 constructor(props) {
    super(props)
    this.state = {
      email: '',
      errorMessage: '',
    }
  }

  onSubmit() {
  	if (this.state.email == null || this.state.email == "") {
      this.setState({ errorMessage: Messages.invalidEmailMessage });
      return;
    }

    this.props.onSubmitForgot(this.state.email);
  }

  render() {
    return (
	    <View style={styles.container}>
	    	<View style={styles.dardBackgroundView} />
	    	<View style={styles.dialogContainer}>
	    		<Text style={styles.mainTitle}>Password Reset</Text>
				<Text style={styles.description}>Please enter the email address that you registered with and we will send you a password reset link</Text>

				<FormInput 
	    			style={styles.emailField} 
	    			type="email" 
	    			placeholder="johndoe@mail.com"  
	    			value={this.state.email} 
                	onChangeText={(text) => this.setState({email: text, errorMessage: null})}
	    			/>


	    		<RoundButton style={styles.loginButton} title="Submit" onPress={() => this.onSubmit()}></RoundButton>
	    		{
	               this.state.errorMessage
	                ? <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
	                : null
	            }

	    	</View>
	    </View>
    );
  }
}

ForgotDialog.propTypes = {
	
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	dardBackgroundView: {
		position: 'absolute',		
		width: screenWidth,
		height: screenHeight,
		left: 0,
		top: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},

	dialogContainer: {
		width: screenWidth - 40,
		backgroundColor: '#e3edee',
		textAlign: 'center',
		padding: 15,
		borderRadius: 10,
	},

	mainTitle: {
		fontFamily: 'FuturaPT-Bold',
		color: '#0d4e6c',
		fontSize: 26,
		textAlign: 'center',
		marginBottom: 10,
	},

	description: {
		fontFamily: 'FuturaPT-Book',
		fontSize: 18,
		textAlign: 'center',
		marginBottom: 20,
	},

	emailField: {
		marginBottom: 9,
	},

	loginButton: {
		marginTop: 17
	},

	buttonText: {
		fontFamily: 'FuturaPT-Book',
		color: 'white',
		textTransform: 'uppercase',
		fontSize: 17,
		paddingTop: 18,
		paddingBottom: 18,
		fontWeight: 'bold'
	},

	errorMessage: {
	    color: 'red',
	    fontSize: 12,
	    marginTop: 5,
	    textAlign: 'center',
	    fontFamily: 'FuturaPT-Book',
	 },
});