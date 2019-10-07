import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import AsyncStorage from '@react-native-community/async-storage';
import {Platform} from 'react-native';

export default class KeynoteStore {
    @observable restoreKeynoteState = new AsyncState();
    @observable loadKeynoteState = new AsyncState();

    constructor(ctx) {
        this.ctx = ctx;
        this.keynotes = [];
    }

    @action
    async restoreKeynotes() {
        const list = await AsyncStorage.getItem('__Keynotes__');
        if (list) {
            const jsonList = JSON.parse(list);
            this.keynotes = jsonList; 
            this.restoreKeynoteState = new AsyncState('SUCCESS', {...this.keynotes });
        } 
        else {
            this.restoreKeynoteState = new AsyncState('API_ERROR');
        }        
    }

    @action
    async loadKeynotes() {
        this.loadKeynoteState = new AsyncState('IN_PROGRESS');
        try {
            const loadResponse = await this.ctx.callApi('FMS_xmlcreator/a0J1J00001H0ji2_showspeakerlistkeynotes.json', {
                method: 'GET',
            });

            if (Platform.OS == 'ios') {
                var response = await loadResponse.json();
                var keynotes = response.speakerlist.speaker;

                await AsyncStorage.setItem('__Keynotes__', JSON.stringify(keynotes));    
                this.loadKeynoteState = new AsyncState('SUCCESS', {...keynotes});      
            } 
            else {
                var response = await loadResponse.text();

                var startIndex = response.indexOf("[");
                var endIndex = response.lastIndexOf("]");
                var subText = response.slice(startIndex, endIndex + 1).trim();
                var list = JSON.parse(subText);    

                await AsyncStorage.setItem('__Keynotes__', JSON.stringify(list));    
                this.loadKeynoteState = new AsyncState('SUCCESS', {...list});      
            }

            

        } catch (error) {
            console.log("load Keynotes error = ", error);
            this.loadKeynoteState = new AsyncState('NETWORK_PROBLEMS');
        }
    }
}