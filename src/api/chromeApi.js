import { tools } from './recolorTools';
import { ApiError } from './error/ApiError';
import { NotFoundError } from './error/NotFoundError';
import { TransactionError } from './error/TransactionError';

export function chromeCurrentTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        resolve(tabs[0]);
      } else {
        reject(new ApiError(`Sorry, we can't find the app. 😣\n\n${tools.reportIssue}`));
      }
    });
  });
}

export function getAllSettings() {
  return new Promise(resolve => {
    chrome.storage.sync.get('recolorSettings', stored => {
      resolve(stored.recolorSettings ? stored.recolorSettings : []);
    });
  });
}

export function getCurrentSettings() {
  return new Promise((resolve, reject) => {
    chromeCurrentTab().then(
      tab => {
        const currentUrl = tools.parseUrl(tab.url);
        getAllSettings().then(recolorSettings => {
          const storedSettings = recolorSettings.find(s => s.domain === currentUrl);
          if (tools.isValidSettingObject(storedSettings)) {
            resolve({ storedSettings, currentUrl });
          } else {
            reject(new NotFoundError(currentUrl));
          }
        });
      },
      error => reject(error)
    );
  });
}

export function sendSettings(settings) {
  return new Promise((resolve, reject) => {
    chromeCurrentTab().then(
      tab => {
        chrome.tabs.sendMessage(tab.id, settings, response => {
          if (tools.isValidTransaction(response)) {
            resolve(response);
          } else {
            reject(new TransactionError(response));
          }
        });
      },
      error => reject(error)
    );
  });
}
