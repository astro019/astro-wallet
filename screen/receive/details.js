import React, { Component } from 'react';
import { TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode';
import {
  NasdaLoading,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaSpacing,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
let NasdaApp = require('../../NasdaApp');

export default class ReceiveDetails extends Component {
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
    let address = props.navigation.state.params.address;
    this.state = {
      isLoading: true,
      address: address,
    };
    console.log(JSON.stringify(address));
  }

  async componentDidMount() {
    console.log('wallets/details - componentDidMount');
    this.setState({
      isLoading: false,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <NasdaLoading />;
    }

    return (
      <SafeNasdaArea
        forceInset={{ horizontal: 'always' }}
        style={{ flex: 1, paddingTop: 20 }}
      >
        <NasdaSpacing />
        <NasdaCard
          title={'Share this address with payer'}
          style={{ alignItems: 'center', flex: 1 }}
        >
          <TextInput
            style={{ marginBottom: 20, color: 'white' }}
            editable
            value={this.state.address}
          />
          <QRCode
            value={this.state.address}
            size={150}
            bgColor="white"
            fgColor={NasdaApp.settings.brandingColor}
          />
        </NasdaCard>

        <NasdaButton
          icon={{ name: 'arrow-left', type: 'octicon' }}
          backgroundColor={NasdaApp.settings.buttonBackground}
          onPress={() => this.props.navigation.goBack()}
          title="Go back"
        />
      </SafeNasdaArea>
    );
  }
}

ReceiveDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.function,
    state: PropTypes.shape({
      params: PropTypes.shape({
        address: PropTypes.string,
      }),
    }),
  }),
};
