/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
const PushNotification = require('react-native-push-notification');

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish();
  },

  requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel(
  {
    channelId: 'channel-default',
    channelName: 'Notifications',
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`createChannel returned '${created}'`),
);

AppRegistry.registerComponent(appName, () => App);
