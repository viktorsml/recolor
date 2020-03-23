import { Website } from './interfaces';

export function getWebsites(callback: Function): void {
  chrome.storage.sync.get('websites', (stored) => {
    callback(stored.websites ? stored.websites : []);
  });
}

export function saveWebsite(website: Website, callback?: Function) {
  getWebsites((websites: Website[]) => {
    chrome.storage.sync.set({ websites: [...websites, website] }, () => {
      if (callback) callback();
    });
  });
}

export function updateWebsite(websiteList: Website[], website: Website, callback?: Function) {
  const websiteIndex = websiteList.findIndex(w => w.domain === website.domain);
  websiteList[websiteIndex].color = website.color;
  chrome.storage.sync.set({ websites: websiteList }, () => {
    if (callback) callback();
  });
}

export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

export function getCurrentTab(callback: Function): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tab: chrome.tabs.Tab[]) => {
    callback(tab[0]);
  });
}

export function getTabUrl(callback: Function) {
  getCurrentTab((tab: chrome.tabs.Tab) => {
    callback(tab.url);
  });
}

export function extractHostname(url: string) {
  let hostname;
  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
}

export function changeThemeColor(color: string): void {
  var metaThemeColor = document.querySelector('meta[name=theme-color]');
  updateColor((metaThemeColor) ? metaThemeColor : createMetaTag(), color);
}

function createMetaTag(): HTMLElement {
  let meta = document.createElement('meta');
  meta.name = "theme-color";
  return document.getElementsByTagName('head')[0].appendChild(meta)
}

function updateColor(metaTag: Element, color: string): void {
  metaTag.setAttribute('content', color);
}