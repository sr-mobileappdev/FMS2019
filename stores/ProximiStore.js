import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import { PROXIMIIO_TOKEN } from '../config/constants.js';

export default class ProximiStore {
    @observable loadFloorsState = new AsyncState();

    constructor(ctx) {
        this.floors = [];
    }

    @action
    async loadFloors() {
        this.loadFloorsState = new AsyncState('IN_PROGRESS');
        fetch('http://api.proximi.fi/core/floors', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + PROXIMIIO_TOKEN,
          }          
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("responseJson = ", responseJson);
            this.floors = responseJson;
            this.loadFloorsState = new AsyncState('SUCCESS', {...this.floors});    
        })
        .catch((error) => {
            console.error(error);
            this.loadFloorsState = new AsyncState('NETWORK_PROBLEMS');
        });
    }
}