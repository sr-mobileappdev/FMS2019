import CookieManager from 'react-native-cookies';
import { BASE_URL } from '../config/constants.js';
import UserStore from './UserStore';
import SpeakerStore from './SpeakerStore';
import KeynoteStore from './KeynoteStore';
import AgendaStore from './AgendaStore';
import SponsorStore from './SponsorStore';
import ScheduleStore from './ScheduleStore';
import ProximiStore from './ProximiStore';

export class ApiContext {
  session = null;
  authHeader = null;

  async callApi(endpoint, args) {
    let url = args && args.fullPath ? endpoint : (BASE_URL + endpoint);
    const method = args && args.method || 'GET';
    const headers = {};
    let body = null;

    if (args && args.params) {
      Object.keys(args.params).forEach((key, index) => {
        url += (index === 0 ? '?' : '&') + key + '=' + encodeURIComponent(args.params[key]);
      });
    }
    if (args && args.body) {
      headers['Content-Type'] = 'multipart/form-data';
      body = new FormData();
      for (let key in args.body) {
        body.append(key, args.body[key]);
      }
    }
    if (args && args.auth) {
      headers['Authorization'] = this.authHeader;
    }

    console.log(method + ' ' + url);

    const response = await fetch(url, {
      method,
      headers,
      body,
      credentials: 'omit',
    });

    if (args && args.cleanupCookies) {
      await CookieManager.clearAll();
    }
    if (args && args.auth && response.status === 401) {
      console.log('token expired. logging out')
      if (this.stores)
        await this.stores.authStore.logout(false);
      return response;
    }

    return response;
  }
}

const ctx = new ApiContext();
const stores = {
  userStore: new UserStore(ctx),
  speakerStore: new SpeakerStore(ctx),
  keynoteStore: new KeynoteStore(ctx),
  agendaStore: new AgendaStore(ctx),
  sponsorStore: new SponsorStore(ctx),
  scheduleStore: new ScheduleStore(ctx),
  proximiStore: new ProximiStore(ctx),
};
ctx.stores = stores;

export default stores;