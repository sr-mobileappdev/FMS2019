import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import AsyncStorage from '@react-native-community/async-storage';
import {Platform} from 'react-native';

export default class AgendaStore {
    @observable restoreAgendaState = new AsyncState();
    @observable loadAgendaState = new AsyncState();

    constructor(ctx) {
        this.ctx = ctx;
        this.list = [];
    }

    @action
    async restoreAgenda() {
        const list = await AsyncStorage.getItem('__agenda__');
        if (list) {
            const jsonList = JSON.parse(list);
            this.list = jsonList; 
            this.restoreAgendaState = new AsyncState('SUCCESS', {...this.list });
        } 
        else {
            this.restoreAgendaState = new AsyncState('API_ERROR');
        }        
    }

    @action
    async loadAgenda() {
        console.log("loadAgenda");
        this.loadAgendaState = new AsyncState('IN_PROGRESS');
        try {
            const loadResponse = await this.ctx.callApi('FMS_xmlcreator/a0J1J00001H0ji2_showagenda.json', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (Platform.OS == 'ios') {
                var response = await loadResponse.json();
                var agendalist = response.agendalist.agenda;

                await AsyncStorage.setItem('__agenda__', JSON.stringify(agendalist));    
                this.loadAgendaState = new AsyncState('SUCCESS', {...agendalist});    
            } 
            else {
                var response = await loadResponse.text();

                var startIndex = response.indexOf("[");
                var endIndex = response.lastIndexOf("]");
                var subText = response.slice(startIndex, endIndex + 1).trim();
                var list = JSON.parse(subText);    
                await AsyncStorage.setItem('__agenda__', JSON.stringify(list));    
                this.loadAgendaState = new AsyncState('SUCCESS', {...list});    
            }
            
        } catch (error) {
            console.log("load agenda error = ", error);
            this.loadAgendaState = new AsyncState('NETWORK_PROBLEMS');
        }
    }
}