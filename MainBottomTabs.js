import { TabNavigator } from 'react-navigation';

import transactions from './screen/transactions';
import wallets from './screen/wallets';
import send from './screen/send';
import settins from './screen/settings';
import receive from './screen/receive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 *
 * @type {AppStorage}
 */
let NasdaApp = require('./NasdaApp');

const Tabs = TabNavigator(
  {
    Wallets: {
      screen: wallets,
      path: 'wallets',
    },
    Transactions: {
      screen: transactions,
      path: 'trans',
    },
    Send: {
      screen: send,
      path: 'cart',
    },
    Receive: {
      screen: receive,
      path: 'receive',
    },
    Settings: {
      screen: settins,
      path: 'settings',
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: 'white',
      activeBackgroundColor: '#33bdf1',
      inactiveBackgroundColor: NasdaApp.settings.brandingColor,
      inactiveTintColor: 'white',
    },
  },
);

export default Tabs;
