<template src="./RecolorPicker.template.html"></template>
<style src="./RecolorPicker.style.css"></style>
<script>
import { tools } from '../api/recolorTools';
import { sendSettings, getCurrentSettings } from '../api/chromeApi';
import { NotFoundError } from '../api/error/NotFoundError';

const initialFeedback = {
  toggle: false,
  status: {
    error: false,
    message: '',
  },
};

let attributes = {
  generalError: false,
  isNew: true,
  isEnabled: false,
  hasBackupColor: false,
  isPristine: true,
  currentPage: '',
  hexColor: '',
  feedback: initialFeedback,
};

let methods = {
  notPristineAnymore() {
    this.isPristine = false;
  },
  isValidColor() {
    return tools.isValidColor(this.hexColor);
  },
  onToggleActive() {
    this.feedback = initialFeedback;
    if (this.isValidColor() && !this.isNew) {
      sendSettings({ enabled: this.isEnabled, color: this.hexColor, domain: this.currentPage })
        .then(() => {
          console.log(`Status toggled to: ${this.isEnabled}`);
        })
        .catch(error => {
          console.error(error);
          this.feedback = {
            toggle: true,
            status: { error: true, message: error.message },
          };
        });
    }
  },
  onSubmit(e) {
    e.preventDefault();
    if (this.isValidColor()) {
      this.notPristineAnymore();
      sendSettings({ enabled: this.isEnabled, color: this.hexColor, domain: this.currentPage })
        .then(response => {
          this.isNew = false;
          this.feedback = {
            toggle: true,
            status: { error: !response.success, message: response.message },
          };
        })
        .catch(error => {
          console.error(error);
          this.feedback = {
            toggle: true,
            status: { error: true, message: error.message },
          };
        });
    }
  },
  clearFeedback() {
    this.hexColor = this.hexColor.toUpperCase();
    this.feedback = initialFeedback;
    this.notPristineAnymore();
  },
};

export default {
  data: () => attributes,
  created() {
    getCurrentSettings()
      .then(data => {
        console.log('data:');
        console.log(data);
        this.currentPage = data.currentUrl;
        this.isEnabled = data.storedSettings.enabled;
        this.hexColor = data.storedSettings.color;
        this.isNew = false;
        this.hasBackupColor = !!data.storedSettings.backupColor;
        console.log(`Has backup color? : ${this.hasBackupColor}`);
        console.log(data.storedSettings);
      })
      .catch(error => {
        if (error instanceof NotFoundError) {
          this.currentPage = error.message;
          this.isEnabled = false;
          this.isNew = true;
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        this.generalError = !(this.currentPage.length > 0);
      });
  },
  methods,
};
</script>
