import { Website } from '../shared/interfaces';
import { isValidHexColor, getTabUrl, extractHostname, saveWebsite, getCurrentTab, getWebsites, updateWebsite } from './../shared/functions';

document.getElementById('recolor-add-rule-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const color = `#${(<HTMLInputElement>document.getElementById('recolor-color-field')).value}`;

  if (isValidHexColor(color)) getTabUrl((url: string) => {
    const domain = extractHostname(url)
    const website: Website = { domain: domain, color: color }
    getWebsites((websites: Website[]) => {
      const currentSettings = websites.find(website => domain.includes(website.domain))
      if (typeof currentSettings === 'object') {
        updateWebsite(websites, website, () => {
          console.log(`Updated theme-color to ${color}`);
          getCurrentTab((tab: chrome.tabs.Tab) => chrome.tabs.reload(tab.id));
        });
      } else {
        saveWebsite(website, () => {
          console.log(`Added theme-color to ${color}`);
          getCurrentTab((tab: chrome.tabs.Tab) => chrome.tabs.reload(tab.id));
        });
      }
    })
  });

});