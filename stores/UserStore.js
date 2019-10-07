import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import AsyncStorage from '@react-native-community/async-storage';

export default class UserStore {
    @observable restoreUserState = new AsyncState();
    @observable updateUserSettingState = new AsyncState();
    @observable loginState = new AsyncState();
    @observable signUpState = new AsyncState();
    @observable forgotPasswordState = new AsyncState();
    @observable updateGeoLocationState = new AsyncState();
    @observable updateUserState = new AsyncState();

    constructor(ctx) {
        this.ctx = ctx;
        this.currentUser = null;
        this.oneSignalID = '';
    }

    @action
    async restoreUser() {
        const user = await AsyncStorage.getItem('__currentUser__');
        const oneSignalID = await AsyncStorage.getItem('__oneSignalID__');

        if (user) {
            const interUser = JSON.parse(user);
            this.currentUser = interUser; 
            this.restoreUserState = new AsyncState('SUCCESS', {...this.currentUser });
        } 
        else {
            this.restoreUserState = new AsyncState('API_ERROR');
        }        

        if (oneSignalID) {
            this.oneSignalID = oneSignalID; 
        }
    }

    @action
    async setOneSignalID(user_id) {
        this.oneSignalID = user_id;
        await AsyncStorage.setItem('__oneSignalID__', user_id);    
    }

    @action
    async signUp(firstName, lastName, email, password, deviceId, onesignal_id) {
        this.signUpState = new AsyncState('IN_PROGRESS');
        try {
            const signUpResponse = await this.ctx.callApi('engine/w2x-engine-mobile.php', {
                method: 'POST',
                body: {
                    sObj: "rie__Registration__c",
                    id_rie__Event__c: "a0J1J00001H0ji2",
                    string_rie__First_Name__c: firstName,
                    string_rie__Last_Name__c: lastName,
                    email_rie__Email__c: email,
                    string_Password__c: password,
                    string_rie__BLE_UUID__c: deviceId,
                    string_rie__One_Signal_Player_ID__c: onesignal_id,
                }
            });

            var response = await signUpResponse.text();
            console.log(response);
            
            response = response.replace("\n", "");
            const array1 = response.split('}{');
            if (array1.length > 0) {
                const userText = array1[0] + "}";
                var userObject = JSON.parse(userText);
                console.log("userObject = ", userObject);
                if (array1.length > 1) {
                    const statusText = "{" + array1[1];
                    const statusObject = JSON.parse(statusText);
                    console.log("statusObject = ", statusObject);

                    if (statusObject.success) {
                        userObject.id = statusObject.id;
                        this.currentUser = userObject;             
                        
                        await AsyncStorage.setItem('__currentUser__', JSON.stringify(userObject));    
                        this.signUpState = new AsyncState('SUCCESS', {...userObject});    
                    }
                } else {
                    this.signUpState = new AsyncState('API_ERROR', null, "Sign up is failed.");    
                }
            } else {
                this.signUpState = new AsyncState('API_ERROR', null, "Sign up is failed.");    
            }

        } catch (error) {
            console.log("sign up error = ", error);
            this.signUpState = new AsyncState('NETWORK_PROBLEMS');
        }
    }

    @action
    async login(username, password, onesignal_id) {
       this.loginState = new AsyncState('IN_PROGRESS');
        try {
            console.log("username = ", username);
            console.log("password = ", password);
            
            let url = 'engine/login-engine3.php?username=' + username + '&password=' + password;
            console.log("url = ", url);
            const loginResponse = await this.ctx.callApi(url, {
                method: 'POST',
            });

            var response = await loginResponse.text();
            response = response.replace("\r\n", "");
            console.log("login response: ", response);

            let json = JSON.parse(response);

            if (json.records.length > 0) {
                let user = json.records[0];
                console.log(user);

                var userObject = user.fields;
                userObject.id = user.Id;
                this.currentUser = userObject;             
                console.log(userObject);

                await AsyncStorage.setItem('__currentUser__', JSON.stringify(userObject));    
                this.loginState = new AsyncState('SUCCESS', {...userObject});
            }
            else {
                this.loginState = new AsyncState('API_ERROR', null, '');    
            }
            
        } catch (error) {
            console.log("error = ", error);
            this.loginState = new AsyncState('NETWORK_PROBLEMS');
        }
    }

    @action
    async updateGeoLocation(id, lat, lng) {
        this.updateGeoLocationState = new AsyncState('IN_PROGRESS');
        try {
            const updateGeoLocationResponse = await this.ctx.callApi('engine/w2x-engine.php', {
                method: 'POST',
                body: {
                    sObj: "rie__Scan__c",
                    id_rie__Event__c: "a0J1J00001H0ji2",
                    id_rie__Session__c: "a0R1J00000CRKEF",
                    id_rie__Registration__c: id,
                    string_rie__Location__Latitude__s: lat,
                    string_rie__Location__Longitude__s: lng,
                }
            });

            var response = await updateGeoLocationResponse.text();
            console.log("Update Location Response: ", response);

        } catch (error) {
            console.log("update geo location error = ", error);
            this.updateGeoLocationState = new AsyncState('NETWORK_PROBLEMS');
        }
    }


    @action
    async updateProfile(user) {
        
        /*
        var formData = new FormData();
        formData.append('sObj', 'rie__Registration__c');
        formData.append('id_rie__Registration__c', user.user_id);
        formData.append('string_rie__First_Name__c', user.first_name);
        formData.append('string_rie__Last_Name__c', user.last_name);
        formData.append('string_rie__Job_Title__c', user.title);
        formData.append('string_rie__Company__c', user.company);
        formData.append('string_rie__Mobile__c', user.cellPhone);
        formData.append('string_rie__Twitter__c', user.twitter);
        formData.append('string_rie__Linkedin_Public_URL__c', user.linkedIn);
        formData.append('string_rie__Photo__c', user.photoURL);
        
        let postData = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        };

        fetch("https://realintelligence.com/customers/expos/00Do0000000aAt2/engine/update-engine-mobile-profile.php", postData)
        .then((response) => {
            console.log(response);
            return response.text();
        })
        .then((responseJson) => { console.log('response:', responseJson); })
        .catch((error) => { console.error(error); });
        */
        
        this.updateUserState = new AsyncState('IN_PROGRESS');
        try {
            const params = {
                "sObj": "rie__Registration__c",
                "id_rie__Registration__c": user.user_id,
                "string_rie__First_Name__c": user.first_name,
                "string_rie__Last_Name__c": user.last_name,
                "string_rie__Job_Title__c": user.title,
                "string_rie__Company__c": user.company,
                "string_rie__Mobile__c": user.cellPhone,
                "string_rie__Twitter__c": user.twitter,
                "string_rie__Linkedin_Public_URL__c": user.linkedIn, 
                "string_rie__Photo__c": user.photoURL
            };

            console.log("params = ", params);
            const response = await this.ctx.callApi('engine/update-engine-mobile-profile.php', {
                method: 'POST',
                body: params, 
                header: {
                    "Content-Type": "application/json",
                }
            });

            var data = await response.text();
            console.log("Update Profile: ", data);

            data = data.trim();
            data = data.replace("\r\n\n", ""); 
            var lastStatus = data.substr(data.length - 7);
            if (lastStatus == "success") {
                console.log("success");
                data = data.substr(0, data.length - 7);

                var user = JSON.parse(data);   
                console.log("user: ", user);

                if (user.rie__First_Name__c) {
                    this.currentUser.rie__First_Name__c = user.rie__First_Name__c;    
                }             

                if (user.rie__Last_Name__c) {
                    this.currentUser.rie__Last_Name__c = user.rie__Last_Name__c;    
                }  

                if (user.rie__Job_Title__c) {
                    this.currentUser.rie__Job_Title__c = user.rie__Job_Title__c;    
                }  

                if (user.rie__Company__c) {
                    this.currentUser.rie__Company__c = user.rie__Company__c;    
                }  

                if (user.rie__Mobile__c) {
                    this.currentUser.rie__Mobile__c = user.rie__Mobile__c;    
                }  

                if (user.rie__Twitter__c) {
                    this.currentUser.rie__Twitter__c = user.rie__Twitter__c;    
                } 

                if (user.rie__Linkedin_Public_URL__c) {
                    this.currentUser.rie__Linkedin_Public_URL__c = user.rie__Linkedin_Public_URL__c;    
                }  

                if (user.rie__Photo__c) {
                    this.currentUser.rie__Photo__c = user.rie__Photo__c;    
                }  


                await AsyncStorage.setItem('__currentUser__', JSON.stringify(this.currentUser));      
                this.updateUserState = new AsyncState('SUCCESS', {...this.currentUser});    

            } else {
                console.log("failed");
                this.updateUserState = new AsyncState('API_ERROR', null, "Couldn't update profile.");
            }

        } catch (error) {
            console.log("error = ", error);
            this.updateUserState = new AsyncState('NETWORK_PROBLEMS');
        }
    }

    @action
    async forgotPassword(email) {
        this.forgotPasswordState = new AsyncState('IN_PROGRESS');
        try {
            const params = {
                email: email,
            };

            const response = await this.ctx.callApi('FMS_2019/project/API/resetRegPassword', {
                method: 'POST',
                body: params
            });


            const data = await response.json();
            if (data.code) {
                this.forgotPasswordState = new AsyncState('SUCCESS', data.msg);    
            } else {
                this.forgotPasswordState = new AsyncState('API_ERROR', null, data.msg);    
            }
         } catch (error) {
            console.log("error = ", error);
            this.forgotPasswordState = new AsyncState('NETWORK_PROBLEMS');
        }
    }


    @action
    async signOut() {
        await AsyncStorage.removeItem('__currentUser__');
        this.currentUser = null;
    }   
     
}