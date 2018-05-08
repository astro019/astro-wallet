import { TabNavigator } from 'react-navigation';

import transactions from './screen/transactions';
import wallets from './screen/wallets';
import send from './screen/send';
import settins from './screen/settings';
import receive from './screen/receive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Color } from './screen/Constants'

/**
 *
 * @type {AppStorage}
 */
let NasdaApp = require('./NasdaApp');

const Tabs = TabNavigator(
  {
    Transactions: {
      screen: transactions,
      path: 'trans',
    },
    Send: {
      screen: send,
      path: 'cart',
    },
    Wallets: {
      screen: wallets,
      path: 'wallets',
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
    initialRouteName: 'Wallets',
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      activeTintColor: 'white',
      activeBackgroundColor: 'transparent',
      inactiveBackgroundColor: 'transparent',
      inactiveTintColor: 'black',
      style: {
        backgroundColor: Color.background,
        height: 50,
        borderColor: 'transparent',
        shadowColor: 'transparent',
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        }
      },
      indicatorStyle: {
        opacity: 0
      }
    },
  },
);

export default Tabs;
