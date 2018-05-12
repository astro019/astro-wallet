import React, { Component } from 'react';
import { ListView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header, Icon } from 'react-native-elements';
import {
  NasdaLoading,
  NasdaList,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaListItem,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
let EV = require('../../events');
/** @type {AppStorage} */
let NasdaApp = require('../../NasdaApp');

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class TransactionsList extends Component {
  static navigationOptions = {
    tabBarLabel: 'Transactions',
    tabBarIcon: ({ tintColor, focused }) =>
      focused ? (
        <Image
          source={require('../../img/tabIcon/transaction_focus.png')}
          style={{ width: 25, height: 25 }}
        />
      ) : (
        <Image
          source={require('../../img/tabIcon/transaction.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };

    EV(EV.enum.TRANSACTIONS_COUNT_CHANGED, this.refreshFunction.bind(this));
  }

  async componentDidMount() {
    console.log('transaction/list- componentDidMount');
    this.refreshFunction();
  } // end

  refreshFunction() {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            isLoading: false,
            final_balance: NasdaApp.getBalance(),
            dataSource: ds.cloneWithRows(NasdaApp.getTransactions()),
          });
        }, 1);
      },
    );
  }

  txMemo(hash) {
    if (NasdaApp.tx_metadata[hash] && NasdaApp.tx_metadata[hash]['memo']) {
      return ' | ' + NasdaApp.tx_metadata[hash]['memo'];
    }
    return '';
  }

  refresh() {
    this.setState(
      {
        isLoading: true,
      },
      async function() {
        let that = this;
        setTimeout(async function() {
          // more responsive
          let noErr = true;
          try {
            await NasdaApp.fetchWalletTransactions();
            await NasdaApp.fetchWalletBalances();
          } catch (err) {
            noErr = false;
            console.warn(err);
          }
          if (noErr) await NasdaApp.saveToDisk(); // caching
          EV(EV.enum.WALLETS_COUNT_CHANGED); // TODO: some other event type?

          that.setState({
            isLoading: false,
            final_balance: NasdaApp.getBalance(),
            dataSource: ds.cloneWithRows(NasdaApp.getTransactions()),
          });
        }, 10);
      },
    );
  }

  render() {
    const { navigate } = this.props.navigation;

    if (this.state.isLoading) {
      return <NasdaLoading />;
    }

    return (
      <SafeNasdaArea forceInset={{ horizontal: 'always' }} style={{ flex: 1 }}>
        <Header
          backgroundColor={NasdaApp.settings.brandingColor}
          leftComponent={
            <Icon
              name="menu"
              color="#fff"
              onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          centerComponent={{
            text: this.state.final_balance + ' BTC',
            style: { color: '#fff', fontSize: 25 },
          }}
          rightComponent={
            <Icon name="refresh" color="#fff" onPress={() => this.refresh()} />
          }
        />
        <ListView
          style={{ height: 360 }}
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={rowData => {
            return (
              <NasdaListItem
                avatar={
                  <Icon
                    color={(() => {
                      return (
                        (rowData.confirmations &&
                          ((rowData.value < 0 && '#900') || '#080')) ||
                        '#ebebeb'
                      );
                    })()}
                    name={(() => {
                      return (
                        (rowData.value < 0 && 'call-made') ||
                        'call-received'
                      );
                    })()}
                  />
                }
                title={
                  rowData.value / 100000000 +
                  ' BTC' +
                  this.txMemo(rowData.hash)
                }
                subtitle={
                  rowData.received
                    .replace(['T'], ' ')
                    .replace(['Z'], ' ')
                    .split('.')[0] +
                  ' | conf: ' +
                  rowData.confirmations +
                  '\nYOLO'
                }
                onPress={() => {
                  navigate('TransactionDetails', { hash: rowData.hash });
                }}
              />
            );
          }}
        />
      </SafeNasdaArea>
    );
  }
}

TransactionsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};
