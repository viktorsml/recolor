import Vue from 'vue';
import RecolorPicker from './RecolorPicker';

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#RecolorPicker',
  render: h => h(RecolorPicker),
});
