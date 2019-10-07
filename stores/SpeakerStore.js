import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import AsyncStorage from '@react-native-community/async-storage';
import {Platform} from 'react-native';

export default class SpeakerStore {
    @observable restoreSpeakerState = new AsyncState();
    @observable loadSpeakerState = new AsyncState();

    constructor(ctx) {
        this.ctx = ctx;
        this.speakers = [];
    }

    @action
    async restoreSpeakers() {
        const list = await AsyncStorage.getItem('__speakers__');
        if (list) {
            const jsonList = JSON.parse(list);
            this.speakers = jsonList; 
            this.restoreSpeakerState = new AsyncState('SUCCESS', {...this.speakers });
        } 
        else {
            this.restoreSpeakerState = new AsyncState('API_ERROR');
        }        
    }

    @action
    async loadSpeakers() {
        this.loadSpeakerState = new AsyncState('IN_PROGRESS');
        try {
            const loadResponse = await this.ctx.callApi('FMS_xmlcreator/a0J1J00001H0ji2_showspeakerlist.json', {
                method: 'GET',
            });

            if (Platform.OS == 'ios') {
                var response = await loadResponse.json();
                var speakers = response.speakerlist.speaker;

                await AsyncStorage.setItem('__speakers__', JSON.stringify(speakers));    
                this.loadSpeakerState = new AsyncState('SUCCESS', {...speakers});   
            } 
            else {
                var response = await loadResponse.text();

                var startIndex = response.indexOf("[");
                var endIndex = response.lastIndexOf("]");
                var subText = response.slice(startIndex, endIndex + 1).trim();
                var list = JSON.parse(subText);    
                
                await AsyncStorage.setItem('__speakers__', JSON.stringify(list));    
                this.loadSpeakerState = new AsyncState('SUCCESS', {...list});     
            }
        } catch (error) {
            console.log("load speakers error = ", error);
            this.loadSpeakerState = new AsyncState('NETWORK_PROBLEMS');
        }
    }
}