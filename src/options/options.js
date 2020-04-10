import Vue from 'vue';
import RecolorSettings from './RecolorSettings';

global.browser = require('webextension-polyfill');

/* eslint-disable no-new */
new Vue({
  el: '#RecolorSettings',
  render: h => h(RecolorSettings),
});
