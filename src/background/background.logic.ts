import { Website } from './../shared/interfaces';
import { getWebsites, changeThemeColor } from './../shared/functions';

getWebsites((websites: Website[]) => {
  let currentSettings = websites.find(website => website.domain.includes(document.domain));
  if (typeof currentSettings === 'object') {
    console.log('Applying colors!');
    changeThemeColor(currentSettings.color);
  }
});
