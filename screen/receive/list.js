/** @type {AppStorage} */
import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import {View} from 'react-native'
import {
  NasdaLoading,
  SafeNasdaArea,
  NasdaCard,
  NasdaListItem,
  NasdaHeader,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
let NasdaApp = require('../../NasdaApp');
let EV = require('../../events');

export default class ReceiveList extends Component {
  static navigationOptions = {
    tabBarLabel: 'Receive',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-cash' : 'ios-cash-outline'}
        size={26}
        style={{ color: tintColor }}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    this.walletsCount = 0;
    EV(EV.enum.WALLETS_COUNT_CHANGED, () => {
      return this.componentDidMount();
    });
  }

  async componentDidMount() {
    console.log('receive/list - componentDidMount');
    let list = [];

    this.walletsCount = 0;
    for (let w of NasdaApp.getWallets()) {
      list.push({
        title: w.getAddress(),
        subtitle: w.getLabel(),
      });
      this.walletsCount++;
    }

    this.setState({
      isLoading: false,
      list: list,
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    if (this.state.isLoading) {
      return <NasdaLoading />;
    }

    return (
      <SafeNasdaArea forceInset={{ horizontal: 'always' }} style={{ flex: 1 }}>
        <NasdaHeader
          backgroundColor={NasdaApp.settings.brandingColor}
          leftComponent={
            <Icon
              name="menu"
              color="#fff"
              onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          centerComponent={{
            text: 'Choose a wallet to receive',
            style: { color: '#fff', fontSize: 25 },
          }}
        />

        <View>
          {this.state.list.map((item, i) => (
            <NasdaListItem
              onPress={() => {
                navigate('ReceiveDetails', { address: item.title });
              }}
              key={i}
              title={item.title}
              subtitle={item.subtitle}
              leftIcon={{
                name: 'bitcoin',
                type: 'font-awesome',
                color: 'white',
              }}
            />
          ))}
        </View>
      </SafeNasdaArea>
    );
  }
}

ReceiveList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};
