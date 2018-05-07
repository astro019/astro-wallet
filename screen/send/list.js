import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import {
  SafeNasdaArea,
  NasdaCard,
  NasdaListItem,
  NasdaHeader,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
let EV = require('../../events');
/** @type {AppStorage} */
let NasdaApp = require('../../NasdaApp');

export default class SendList extends Component {
  static navigationOptions = {
    tabBarLabel: 'Send',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'md-paper-plane' : 'md-paper-plane'}
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
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <SafeNasdaArea forceInset={{ horizontal: 'always' }} style={{ flex: 1 }}>
        <NasdaHeader
          leftComponent={
            <Icon
              name="menu"
              color="#fff"
              onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          centerComponent={{
            text: 'Choose a wallet to send from',
            style: { color: '#fff', fontSize: 25 },
          }}
        />

        <View>
          {this.state.list.map((item, i) => (
            <NasdaListItem
              onPress={() => {
                navigate('SendDetails', { fromAddress: item.title });
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

SendList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};
