import React, { Component } from 'react';
import PropTypes from "prop-types"
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native';

const win = Dimensions.get('window');
const screenWidth = win.width;
const screenHeight = win.height;

class FormInput extends Component {
    static propTypes = {
        value: PropTypes.string,
        placeholder: PropTypes.string,
        type: PropTypes.string.isRequired,
        floatSize: PropTypes.bool,
        errorMessage: PropTypes.string,
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={[{width: 'auto'}, this.props.style, styles.container]}>
                {
                    (this.props.type === "text")
                    ? <TextInput
                        style={styles.textInput}
                        underlineColorAndroid='transparent'
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                    />
                    : null
                }

                {
                    (this.props.type === "email")
                    ? <TextInput
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={styles.textInput}
                        underlineColorAndroid='transparent'
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                    />
                    : null
                }

                {
                    (this.props.type === "password")
                    ? <TextInput
                        secureTextEntry={true}
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={styles.textInput}
                        underlineColorAndroid='transparent'
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                    />
                    : null
                }

                {
                    (this.props.type === "forgot_password")
                    ? <View style={styles.formField}>
                        <TextInput
                            secureTextEntry={true}
                            autoCapitalize='none' 
                            autoCorrect={false}
                            style={[styles.forgotTextInput]}
                            underlineColorAndroid='transparent'
                            onChangeText={this.props.onChangeText}
                            value={this.props.value}
                            placeholder={this.props.placeholder}
                        />
                        <TouchableOpacity style={styles.forgotButton} onPress={() => this.props.onForgotPassword()}>
                            <Text style={styles.forgotButtonText}>Forgot</Text>
                        </TouchableOpacity>
                    </View>
                    : null
                }  

                {
                    this.props.errorMessage 
                    ? <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
                    : null
                }              
            </View>
        );
    }
}

export default FormInput;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: 44,
    },
    containerError: {
        borderBottomColor: '#ed0a3f',
    },

    textInput: {
        color: '#474747',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 17,
        height: '100%',
        fontFamily: 'FuturaPT-Book',
    },

    forgotTextInput: {
        color: '#474747',
        paddingLeft: 5,
        fontSize: 17,
        position: 'relative',
        fontFamily: 'FuturaPT-Book',
        width: screenWidth - 140,
        height: '100%',
    },

    forgotButton: {
        position: 'absolute',
        right: 0,
    },

    forgotButtonText: {
        fontFamily: 'FuturaPT-Book',
        fontSize: 11,
        backgroundColor: '#263485',
        textTransform: 'uppercase',
        color: 'white',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
    },

    errorMessage: {
        fontFamily: 'FuturaPT-Book',
        fontStyle: 'italic',
        color: 'red',
    },

    formField: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    eye_icon: {
        width: 22,
        height: 14,
    },
});