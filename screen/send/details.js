import React, { Component } from 'react';
import { ActivityIndicator, View, Image, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Text, FormValidationMessage, Icon } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';
import { Color } from '../Constants'
import {
  NasdaSpacing20,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaFormInput,
  NasdaSpacing,
  NasdaHeader,
  NasdaPaper,
  NasdaLabel,
  NasdaIcon,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
const bip21 = require('bip21');
let EV = require('../../events');
let BigNumber = require('bignumber.js');
let NasdaApp = require('../../NasdaApp');

const btcAddressRx = /^[a-zA-Z0-9]{26,35}$/;

export default class SendDetails extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) => (
      focused ?
        <Image source={require('../../img/tabicon/send_focus.png')} style={{ width: 25, height: 25 }} /> :
        <Image source={require('../../img/tabicon/send.png')} style={{ width: 25, height: 25 }} />
    ),
  };

  constructor(props) {
    super(props);
    let startTime = Date.now();
    let address;
    if (props.navigation.state.params)
      address = props.navigation.state.params.address;
    let fromAddress;
    if (props.navigation.state.params)
      fromAddress = props.navigation.state.params.fromAddress;
    let fromWallet = {};

    let startTime2 = Date.now();
    for (let w of NasdaApp.getWallets()) {
      if (w.getAddress() === fromAddress) {
        fromWallet = w;
      }
    }

    let endTime2 = Date.now();
    console.log('getAddress() took', (endTime2 - startTime2) / 1000, 'sec');

    this.state = {
      errorMessage: false,
      fromAddress: fromAddress,
      fromWallet: fromWallet,
      isLoading: true,
      address: address,
      amount: '0.000',
      fee: '',
    };

    EV(EV.enum.CREATE_TRANSACTION_NEW_DESTINATION_ADDRESS, data => {
      console.log('received event with ', data);

      if (btcAddressRx.test(data)) {
        this.setState({
          address: data,
        });
      } else {
        const { address, options } = bip21.decode(data);

        if (btcAddressRx.test(address)) {
          this.setState({
            address,
            amount: options.amount,
            memo: options.label,
          });
        }
      }
    });
    let endTime = Date.now();
    console.log('constructor took', (endTime - startTime) / 1000, 'sec');
  }

  async componentDidMount() {
    let startTime = Date.now();
    console.log('send/details - componentDidMount');
    this.setState({
      isLoading: false,
    });
    let endTime = Date.now();
    console.log('componentDidMount took', (endTime - startTime) / 1000, 'sec');
  }

  recalculateAvailableBalance(balance, amount, fee) {
    if (!amount) amount = 0;
    if (!fee) fee = 0;
    let availableBalance;
    try {
      availableBalance = new BigNumber(balance);
      availableBalance = availableBalance.sub(amount);
      availableBalance = availableBalance.sub(fee);
      availableBalance = availableBalance.toString(10);
    } catch (err) {
      return balance;
    }
    console.log(typeof availableBalance, availableBalance);
    return (availableBalance === 'NaN' && balance) || availableBalance;
  }

  createTransaction() {
    if (!this.state.amount) {
      this.setState({
        errorMessage: 'Amount field is not valid',
      });
      console.log('validation error');
      return;
    }

    if (!this.state.fee) {
      this.setState({
        errorMessage: 'Fee field is not valid',
      });
      console.log('validation error');
      return;
    }

    if (!this.state.address) {
      this.setState({
        errorMessage: 'Address field is not valid',
      });
      console.log('validation error');
      return;
    }

    this.setState({
      errorMessage: '',
    });

    this.props.navigation.navigate('CreateTransaction', {
      amount: this.state.amount,
      fee: this.state.fee,
      address: this.state.address,
      memo: this.state.memo,
      fromAddress: this.state.fromAddress,
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    if (!this.state.fromWallet.getAddress) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <Text>
            System error: Source wallet not found (this should never happen)
          </Text>
        </View>
      );
    }

    return (
      <SafeNasdaArea style={{ flex: 1, paddingTop: 20 }}>
        <NasdaHeader
          rightComponent={
            <Icon
              name="settings"
              color={Color.text}
              size={20}
            // onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          leftComponent={
            <Icon
              name="search"
              color={Color.text}
              size={20}
            // onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          centerComponent={{
            text: 'SEND MONEY',
            style: { color: Color.text, fontSize: 14 },
          }}
        />
        <View style={styles.view}>
          <NasdaPaper>
            <View style={styles.rowBottom} >
              <View style={styles.columnLeft} >
                <NasdaLabel style={{paddingLeft: 5, color: Color.text}}>SENDING TO</NasdaLabel>
                <TextInput
                  style={styles.fullTextInput}
                  underlineColorAndroid='transparent'
                  onChangeText={text => this.setState({ address: text })}
                  placeholder='BTC Address'
                  value={this.state.address}
                />
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('ScanQrAddress')}>
                <NasdaIcon
                  icon={<SimpleLineIcons name='camera' color='white' size={20} />}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={styles.rowBetween} >
              <NasdaIcon
                backgroundColor='transparent'
                icon={<Text>-</Text>}
              /> */}
              <View style={styles.rowCenter}>
              <TextField
                  label=''
                  style={styles.amountTextInput}
                  onChangeText={this.filterAmountText}//({ amount: text })}
                  suffix='BTC'
                  value={this.state.amount + ''}
                />
                {/* <Text style={styles.amountTextInput} >BTC</Text> */}
              </View>
              {/* <NasdaIcon
                backgroundColor='transparent'
                icon={<Text>+</Text>}
              />
            </View> */}
          </NasdaPaper>
          <NasdaCard
            title={'Create Transaction'}
            style={{ alignItems: 'center', flex: 1 }}
          >
            <NasdaFormInput
              style={{ width: 250 }}
              onChangeText={text => this.setState({ address: text })}
              placeholder={'receiver address here'}
              value={this.state.address}
            />

            <NasdaFormInput
              onChangeText={text => this.setState({ amount: text })}
              keyboardType={'numeric'}
              placeholder={'amount to send (in BTC)'}
              value={this.state.amount + ''}
            />

            <NasdaFormInput
              onChangeText={text => this.setState({ fee: text })}
              keyboardType={'numeric'}
              placeholder={'plus transaction fee (in BTC)'}
              value={this.state.fee + ''}
            />

            <NasdaFormInput
              onChangeText={text => this.setState({ memo: text })}
              placeholder={'memo to self'}
              value={this.state.memo}
            />

            <NasdaSpacing20 />
            <NasdaText>
              Remaining balance:{' '}
              {this.recalculateAvailableBalance(
                this.state.fromWallet.getBalance(),
                this.state.amount,
                this.state.fee,
              )}{' '}
              BTC
            </NasdaText>
          </NasdaCard>

          <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>

          <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20 }}>
            <View style={{ flex: 0.33 }}>
              <NasdaButton
                onPress={() => this.props.navigation.goBack()}
                title="Cancel"
              />
            </View>
            <View style={{ flex: 0.33 }}>
              <NasdaButton
                icon={{ name: 'qrcode', type: 'font-awesome' }}
                style={{}}
                title="scan"
                onPress={() => this.props.navigation.navigate('ScanQrAddress')}
              />
            </View>
            <View style={{ flex: 0.33 }}>
              <NasdaButton
                onPress={() => this.createTransaction()}
                title="Create"
              />
            </View>
          </View>
          </View>        
      </SafeNasdaArea>
    );
  }

  filterAmountText = (text) => {
    // const numbers = text.match(/\\d+\\.?\\d*/g)
    // console.log(numbers)
    var hasPoint = false
    var amount = ""
    for (i = 0; i<text.length; i++) {
      if (text[i] == '.' && hasPoint == false) {
        hasPoint = true
        amount += text[i]
      } else if (text[i] >= '0' && text[i] <= '9') {
        amount += text[i]
      }
    }
    this.setState({amount: amount})
  }
}

SendDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.function,
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        address: PropTypes.string,
        fromAddress: PropTypes.string,
      }),
    }),
  }),
};

const styles = {
  view: {
    paddingLeft: 15,
    paddingRight: 15
  },
  columnLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullTextInput: { 
    width: '100%',
    borderBottomColor: Color.light_gray,
    borderBottomWidth: 1
  },
  amountTextInput: {
    color: Color.text,
    fontSize: 25,
    paddingLeft: 5,
    paddingRight: 5,
    // maxWidth: 100,
  }
}
