import { tools } from './api/recolorTools';

let shoudAddAsNew = true;

export function getSettings(callback) {
  chrome.storage.sync.get('recolorSettings', stored => {
    callback(stored.recolorSettings ? stored.recolorSettings : []);
  });
}

function saveSettings(setting, callback) {
  getSettings(storedSettings => {
    chrome.storage.sync.set({ recolorSettings: [...storedSettings, setting] }, () => {
      shoudAddAsNew = false;
      if (callback) callback();
    });
  });
}

function updateSettings(setting, callback) {
  getSettings(storedSettingsList => {
    const websiteIndex = storedSettingsList.findIndex(s => s.domain === setting.domain);
    const storedSetting = storedSettingsList[websiteIndex];
    const preservedExtraOptionsSetting = { ...storedSetting, ...setting };
    storedSettingsList[websiteIndex] = preservedExtraOptionsSetting;
    chrome.storage.sync.set({ recolorSettings: storedSettingsList }, () => {
      if (callback) callback(preservedExtraOptionsSetting);
    });
  });
}

getSettings(storedSettings => {
  const currentSite = document.location.hostname.replace('www.', '');
  let currentSettings = storedSettings.find(s => s.domain.includes(currentSite));
  if (tools.isValidSettingObject(currentSettings) && currentSettings.enabled) {
    console.log('Applying colors!');
    console.log(currentSettings);
    tools.changeThemeColor(`#${currentSettings.color}`);
    shoudAddAsNew = false;
  }
});

chrome.runtime.onMessage.addListener((newSettings, sender, sendResponse) => {
  if (tools.isValidSettingObject(newSettings)) {
    if (shoudAddAsNew) {
      // check for meta theme color
      if (document.querySelector('meta[name=theme-color]')) {
        // add backup theme color to setting
        const currentThemeColor = tools.getDefaultThemeColor();
        newSettings.backupColor = currentThemeColor;
        console.log(`Current Theme Color detected: ${currentThemeColor}`);
      }
      saveSettings(newSettings, () => {
        tools.changeThemeColor(`#${newSettings.color}`);
      });
      sendResponse({ success: true, message: 'Enjoy the new color! 🥳' });
    } else {
      updateSettings(newSettings, modifiedSetting => {
        const shouldLoadBackup = typeof modifiedSetting.backupColor === 'string' && !modifiedSetting.enabled;
        tools.changeThemeColor(`#${shouldLoadBackup ? modifiedSetting.backupColor : modifiedSetting.color}`);
      });
      sendResponse({ success: true, message: 'Enjoy the updated color! 🥳' });
    }
  } else {
    sendResponse(`Sorry but we couldn't change the title bar color for this app. 😔\n\n${tools.reportIssue}`);
  }
});
