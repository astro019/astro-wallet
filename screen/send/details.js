import React, { Component } from 'react';
import {
  Text,
  ActivityIndicator,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Dash from 'react-native-dash';
import { Color } from '../Constants';
import { getDate } from '../customAPI';
import {
  SafeNasdaArea,
  NasdaHeader,
  NasdaPaper,
  NasdaIcon,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
const bip21 = require('bip21');
let EV = require('../../events');
let BigNumber = require('bignumber.js');
let NasdaApp = require('../../NasdaApp');

const btcAddressRx = /^[a-zA-Z0-9]{26,35}$/;
const { height } = Dimensions.get('window');

export default class SendDetails extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) =>
      focused ? (
        <Image
          source={require('../../img/tabIcon/send_focus.png')}
          style={{ width: 25, height: 25 }}
        />
      ) : (
        <Image
          source={require('../../img/tabIcon/send.png')}
          style={{ width: 25, height: 25 }}
        />
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
      amount: '',
      fee: '',
      memo: '',
      coins: ['NSD', 'BTC'],
      selectedCoinIndex: 1,
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

  _scrollToInput(reactNode) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode)
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

    const { dateString, timeString, weekDay } = getDate();

    return (
      <SafeNasdaArea style={{ flex: 1, paddingTop: 20 }}>
        <NasdaHeader
          rightComponent={
            <Icon
              name="settings"
              color={Color.light_text}
              size={20}
              // onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          leftComponent={
            <Icon
              name="search"
              color={Color.light_text}
              size={20}
              // onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          centerComponent={{
            text: 'SEND MONEY',
            style: { color: Color.light_text, fontSize: 14 },
          }}
        />
        <KeyboardAwareScrollView
          style={styles.view}
          containerStyle={styles.container}
          innerRef={ref => (this.scroll = ref)}
        >
          <NasdaPaper
            options={this.state.coins}
            initialOption={this.state.selectedCoinIndex}
            onChangeOption={index =>
              this.setState({
                selectedCoinIndex: index,
              })
            }
            icon={<SimpleLineIcons name="camera" color="white" size={20} />}
          >
            <View style={styles.rowBottom} >
              <View style={styles.columnLeft} >
                <Text
                  style={{
                    paddingLeft: 5,
                    color: Color.text,
                    fontSize: 12,
                  }}
                >
                  SENDING TO
                </Text>
                <TextInput
                  style={styles.fullTextInput}
                  underlineColorAndroid="transparent"
                  onChangeText={text => this.setState({ address: text })}
                  placeholder={
                    this.state.coins[this.state.selectedCoinIndex] + ' Address'
                  }
                  value={this.state.address}
                  onSubmitEditing={() => this.amountInput.focusInput()}
                />
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ScanQrAddress')}
              >
                <NasdaIcon
                  icon={
                    <SimpleLineIcons name="camera" color="white" size={20} />
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.amountRowBetween} >
              <Feather name="minus" color={Color.mark} size={20} />
              <View style={styles.rowCenter}>
                <TextInput
                  ref={o => (this.amountInput = o)}
                  style={styles.amountTextInput}
                  onChangeText={this.filterAmountText}
                  fontSize={25}
                  textColor={Color.text}
                  value={this.state.amount}
                  placeholder="0.00"
                  onSubmitEditing={() => this.messageInput.focusInput()}
                />
                <Text
                  style={[
                    styles.amountTextInput,
                    {
                      marginLeft: 5,
                    },
                  ]}
                >
                  {this.state.coins[this.state.selectedCoinIndex]}
                </Text>
              </View>
              <Feather name="plus" color={Color.mark} size={20} />
            </View>
            <Text style={styles.fiatCurrency}>$350</Text>
            <View style={styles.rowBottom} >
              <View style={styles.columnLeft} >
                <Text
                  style={{
                    paddingLeft: 5,
                    color: Color.text,
                    fontSize: 12,
                  }}
                >
                  MESSAGE
                </Text>
                <View style={styles.fullTextInput} >
                  <TextInput
                    ref={o => (this.messageInput = o)}
                    activeLineWidth={200}
                    style={{
                      flex: 1,
                    }}
                    underlineColorAndroid="transparent"
                    onChangeText={text => this.setState({ memo: text })}
                    placeholder="Hello, Input message here"
                    onSubmitEditing={() => this.amountInput.focusInput()}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      color: '#c9c9cc',
                    }}>
                    {this.state.memo.length.toString()}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.rowBottom,
                {
                  marginTop: 10,
                },
              ]}
            >
              <View style={styles.columnLeft} >
                <Text style={{ color: Color.text, fontSize: 12 }}>
                  TOTAL BALANCE
                </Text>
                <Text style={{ color: Color.mark, fontSize: 12 }}>
                  {this.state.fromWallet.getBalance()} {this.state.coins[this.state.selectedCoinIndex]}
                </Text>
              </View>
              <View style={[styles.columnLeft, { flex: 0.6 }]}>
                <Text style={{ color: Color.text, fontSize: 12 }}>FEE</Text>
                <Text style={{ color: Color.mark, fontSize: 12 }}>
                  {this.state.fromWallet.getBalance()} {this.state.coins[this.state.selectedCoinIndex]}
                </Text>
              </View>
              <View style={[styles.columnLeft, { flex: 0.4 }]}>
                <Text style={{ color: Color.text, fontSize: 12 }}>LIMIT</Text>
                <Text style={{ color: Color.mark, fontSize: 12 }}>
                  0.5 {this.state.coins[this.state.selectedCoinIndex]}
                </Text>
              </View>
            </View>
            <Dash
              style={{
                width: '100%',
                height: 1,
                marginTop: 5,
                marginBottom: 10,
              }}
              dashThickness={1}
              dashColor={Color.light_gray}
            />
            <View style={styles.rowBetween} >
              <Text style={{ color: Color.text, fontSize: 12 }}>{weekDay}</Text>
              <Text style={{ color: Color.text, fontSize: 12 }}>TIME</Text>
            </View>
            <View style={styles.rowBetween} >
              <Text style={{ color: Color.mark, fontSize: 14 }}>
                {dateString}
              </Text>
              <Text style={{ color: Color.mark, fontSize: 14 }}>
                {timeString}
              </Text>
            </View>
          </NasdaPaper>

          <View style={[styles.rowCenter, { width: '100%' }]}>
            <TouchableHighlight underlayColor={Color.button_underlay}
              style={styles.button}
              onPress={() => this.createTransaction()}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Start</Text>
            </TouchableHighlight>
          </View>
          {/* <NasdaCard
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
          </View> */}
        </KeyboardAwareScrollView>
      </SafeNasdaArea>
    );
  }

  filterAmountText = text => {
    // const numbers = text.match(/\\d+\\.?\\d*/g)
    // console.log(numbers)
    var hasPoint = false;
    var amount = '';
    for (var i = 0; i < text.length; i++) {
      if (text[i] === '.' && hasPoint === false) {
        hasPoint = true;
        amount += text[i];
      } else if (text[i] >= '0' && text[i] <= '9') {
        amount += text[i];
      }
    }
    this.setState({ amount: amount });
    console.log(this.state.amount);
  };
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
    width: '100%',
    height: '100%',
    paddingLeft: 15,
    paddingRight: 15,
  },
  container: {
    width: '100%',
    height: height,
    backgroundColor: 'green',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  amountRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 50,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullTextInput: {
    width: '100%',
    borderBottomColor: Color.light_gray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountTextInput: {
    maxWidth: '80%',
    color: Color.text,
    fontSize: 25,
    minWidth: 50,
  },
  fiatCurrency: {
    color: Color.light_text,
    fontSize: 20,
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    backgroundColor: Color.button,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
