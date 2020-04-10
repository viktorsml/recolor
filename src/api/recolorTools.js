function createMetaTag() {
  let meta = document.createElement('meta');
  meta.name = 'theme-color';
  return document.getElementsByTagName('head')[0].appendChild(meta);
}

function updateColor(metaTag, color) {
  metaTag.setAttribute('content', color);
}

export const tools = {
  reportIssue: 'Please report this at https://github.com/viktorsml/recolor/issues.',
  parseUrl: url => {
    return new URL(url).hostname.replace('www.', '');
  },
  isValidColor: color => {
    return /^([A-Fa-f0-9]{6})$/.test(color);
  },
  getDefaultThemeColor: () => {
    return document
      .querySelector('meta[name=theme-color]')
      .getAttribute('content')
      .substr(1);
  },
  changeThemeColor: color => {
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    updateColor(metaThemeColor || createMetaTag(), color);
  },
  isValidSettingObject: settings => {
    return (
      typeof settings === 'object' &&
      typeof settings.enabled === 'boolean' &&
      typeof settings.domain === 'string' &&
      typeof settings.color === 'string'
    );
  },
  isValidTransaction: transactionResponse => {
    return typeof transactionResponse === 'object' &&
      typeof transactionResponse.success === 'boolean' &&
      typeof transactionResponse.message === 'string'
      ? transactionResponse.success
      : false;
  },
};
