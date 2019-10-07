import React from 'react';
import { Dimensions, Text, StyleSheet, TouchableOpacity, View, Image, Keyboard } from 'react-native';
import PropTypes from "prop-types";
import FormInput from './FormInput';
import RoundButton from './RoundButton';
import Messages from '../constants/Messages';

const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;

export default class LoginDialog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      error: '',
    }
  }

  onLoginPressed() {
  	Keyboard.dismiss();
  	if (this.state.email == null || this.state.email == "") {
      this.setState({ error: Messages.invalidEmailMessage });
      return;
    }

    if (this.state.password == null || this.state.password == "") {
      this.setState({ error: Messages.invalidPasswordMessage });
      return;
    }

    this.setState({ errorMessage: null });    
  	this.props.onLogin(this.state.email, this.state.password);
  }

  render() {
    return (
	    <View style={styles.container}>
	    	<View style={styles.dardBackgroundView} />
	    	<View style={styles.dialogContainer}>
	    		<TouchableOpacity style={styles.closeButton} onPress={() => this.props.onClose()}>
	    			<Image
	    				style={styles.closeButtonImage}
			            source={require('./../assets/images/close_icon.png')}
			         />        
	    		</TouchableOpacity>
	    		<Text style={styles.mainTitle}>Login to Your Account</Text>
	    		<FormInput 
	    			style={styles.emailField} 
	    			type="email" 
	    			placeholder="johndoe@mail.com"  
	    			value={this.state.email} 
                	onChangeText={(text) => this.setState({email: text, error: null})}
	    			/>

	    		<FormInput 
	    			type="forgot_password" 
	    			placeholder="***********" 
	    			onForgotPassword={() => this.props.onForgotPassword()} 
	    			value={this.state.password} 
                	onChangeText={(text) => this.setState({password: text, error: null})}
	    			/>

	    		<RoundButton 
	    			style={styles.loginButton} 
	    			title="Login" 
	    			onPress={() => this.onLoginPressed()}>
	    		</RoundButton>

	    		{
	               this.state.error
	                ? <Text style={styles.errorMessage}>{this.state.error}</Text>
	                : null
	            }

	            {
	               this.props.errorMessage
	                ? <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
	                : null
	            }
	    	</View>
	    </View>
    );
  }
}

LoginDialog.propTypes = {
	errorMessage: PropTypes.string,
	onLogin: PropTypes.func,
	onForgotPassword: PropTypes.func,
	onClose: PropTypes.func,
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
		backgroundColor: 'white',
		textAlign: 'center',
		padding: 15,
		borderRadius: 10,
	},

	mainTitle: {
		color: '#263485',
		fontSize: 26,
		textAlign: 'center',
		marginBottom: 18,
		marginTop: 25,
		fontFamily: 'FuturaPT-Bold',
	},

	emailField: {
		marginBottom: 9,
	},

	loginButton: {
		marginTop: 17
	},

	closeButton: {
		position: 'absolute',
		right: 10,
		top: 10,
		zIndex: 2,
	},

	closeButtonImage: {
		width: 30,
		height: 30,
	},

	buttonText: {
		color: 'white',
		textTransform: 'uppercase',
		fontSize: 17,
		paddingTop: 18,
		paddingBottom: 18,
		fontFamily: 'FuturaPT-Bold',
	},

	errorMessage: {
	    color: 'red',
	    fontSize: 12,
	    marginTop: 5,
	    textAlign: 'center',
	    fontFamily: 'FuturaPT-Book',
	 },
});