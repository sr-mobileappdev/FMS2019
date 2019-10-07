import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import AsyncStorage from '@react-native-community/async-storage';

export default class ScheduleStore {
    @observable restoreScheduleState = new AsyncState();
    @observable loadScheduleState = new AsyncState();

    constructor(ctx) {
        this.ctx = ctx;
        this.list = [];
    }

    @action
    async restoreSchedule() {
        const list = await AsyncStorage.getItem('__schedules__');
        if (list) {
            const jsonList = JSON.parse(list);
            this.list = jsonList; 
            this.restoreScheduleState = new AsyncState('SUCCESS', {...this.list });
        } 
        else {
            this.restoreScheduleState = new AsyncState('API_ERROR');
        }        
    }

    @action
    async loadSchedule(user_id) {
        console.log("user_id = ", user_id);
        this.loadScheduleState = new AsyncState('IN_PROGRESS');
        try {
            const loadResponse = await this.ctx.callApi('engine/my-registered-sessions.php?regid=' + user_id, {
                method: 'GET',
            });

            var response = await loadResponse.text();
            console.log("response = ", response);

            var str1 = response.substring(response.indexOf("<tt>"), response.indexOf("</tt>"));
            var str2 = str1.replace("<tt>\r\n", "").trim();
            
            var jsonData = JSON.parse(str2);
            console.log("jsonData = ", jsonData);            
            var scheduleList = jsonData.records;

            await AsyncStorage.setItem('__schedules__', JSON.stringify(scheduleList));    
            this.loadScheduleState = new AsyncState('SUCCESS', {...scheduleList});    

        } catch (error) {
            console.log("load Schedule error = ", error);
            this.loadScheduleState = new AsyncState('NETWORK_PROBLEMS');
        }
    }
}