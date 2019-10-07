import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import AsyncStorage from '@react-native-community/async-storage';
import {Platform} from 'react-native';

export default class SponsorStore {
    @observable restoreSponsorState = new AsyncState();
    @observable loadSponsorState = new AsyncState();

    constructor(ctx) {
        this.ctx = ctx;
        this.list = [];
    }

    @action
    async restoreSponsor() {
        const list = await AsyncStorage.getItem('__sponsors__');
        if (list) {
            const jsonList = JSON.parse(list);
            this.list = jsonList; 
            this.restoreSponsorState = new AsyncState('SUCCESS', {...this.list });
        } 
        else {
            this.restoreSponsorState = new AsyncState('API_ERROR');
        }        
    }

    @action
    async loadSponsor() {
        this.loadSponsorState = new AsyncState('IN_PROGRESS');
        try {
            const loadResponse = await this.ctx.callApi('/FMS_xmlcreator/a191J00000tBn3G_specific-exhibitor-list.json', {
                method: 'GET',
            });

            if (Platform.OS == 'ios') {
                var response = await loadResponse.json();
                var sponsorList = response.roomlist.room;

                await AsyncStorage.setItem('__sponsors__', JSON.stringify(sponsorList));    
                this.loadSponsorState = new AsyncState('SUCCESS', {...sponsorList});       
            } 
            else {
                var response = await loadResponse.text();

                var startIndex = response.indexOf("[");
                var endIndex = response.lastIndexOf("]");
                var subText = response.slice(startIndex, endIndex + 1).trim();
                var list = JSON.parse(subText);    

                await AsyncStorage.setItem('__sponsors__', JSON.stringify(list));    
                this.loadSponsorState = new AsyncState('SUCCESS', {...list});                  
            }

               

        } catch (error) {
            console.log("load Sponsor error = ", error);
            this.loadSponsorState = new AsyncState('NETWORK_PROBLEMS');
        }
    }
}