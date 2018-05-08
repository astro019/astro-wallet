import React, { Component } from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaSpacing,
  NasdaLoading,
  NasdaSpacing20,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
/** @type {AppStorage} */
let NasdaApp = require('../../NasdaApp');

export default class TransactionsDetails extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) => (
      focused ?
        <Image source={require('../../img/tabicon/transaction_focus.png')} style={{ width: 25, height: 25 }} /> :
        <Image source={require('../../img/tabicon/transaction.png')} style={{ width: 25, height: 25 }} />
    ),
  };

  constructor(props) {
    super(props);
    let hash = props.navigation.state.params.hash;
    let foundTx = {};
    let from = [];
    let to = [];
    for (let tx of NasdaApp.getTransactions()) {
      if (tx.hash === hash) {
        console.log(tx);
        foundTx = tx;
        for (let input of foundTx.inputs) {
          from = from.concat(input.addresses);
        }
        for (let output of foundTx.outputs) {
          to = to.concat(output.addresses);
        }
      }
    }

    this.state = {
      isLoading: true,
      tx: foundTx,
      from,
      to,
    };
  }

  async componentDidMount() {
    console.log('transactions/details - componentDidMount');
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
          title={'Transaction details'}
          style={{ alignItems: 'center', flex: 1 }}
        >
          {(() => {
            if (NasdaApp.tx_metadata[this.state.tx.hash]) {
              if (NasdaApp.tx_metadata[this.state.tx.hash]['memo']) {
                return (
                  <View>
                    <NasdaText h4>
                      {NasdaApp.tx_metadata[this.state.tx.hash]['memo']}
                    </NasdaText>
                    <NasdaSpacing20 />
                  </View>
                );
              }
            }
          })()}

          <NasdaText h4>From:</NasdaText>
          <NasdaText style={{ marginBottom: 10 }}>
            {this.state.from.join(', ')}
          </NasdaText>

          <NasdaText h4>To:</NasdaText>
          <NasdaText style={{ marginBottom: 10 }}>
            {this.state.to.join(', ')}
          </NasdaText>

          <NasdaText>Txid: {this.state.tx.hash}</NasdaText>
          <NasdaText>received: {this.state.tx.received}</NasdaText>
          <NasdaText>confirmed: {this.state.tx.confirmed}</NasdaText>
          <NasdaText>confirmations: {this.state.tx.confirmations}</NasdaText>
          <NasdaText>inputs: {this.state.tx.inputs.length}</NasdaText>
          <NasdaText>outputs: {this.state.tx.outputs.length}</NasdaText>

          <NasdaText style={{ marginBottom: 10 }} />
        </NasdaCard>

        {(() => {
          if (this.state.tx.confirmations === 0) {
            return (
              <NasdaButton
                onPress={() =>
                  this.props.navigation.navigate('RBF', {
                    txid: this.state.tx.hash,
                  })
                }
                title="Replace-By-Fee (RBF)"
              />
            );
          }
        })()}

        <NasdaButton
          icon={{ name: 'arrow-left', type: 'octicon' }}
          onPress={() => this.props.navigation.goBack()}
          title="Go back"
        />
      </SafeNasdaArea>
    );
  }
}

TransactionsDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.function,
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        hash: PropTypes.string,
      }),
    }),
  }),
};
