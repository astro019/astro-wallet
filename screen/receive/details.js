import React, { Component } from 'react';
import {
  TextInput,
  Image,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { Icon } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Dash from 'react-native-dash';
import {
  NasdaLoading,
  SafeNasdaArea,
  NasdaPaper,
  NasdaHeader,
  NasdaButton,
  NasdaSpacing,
  NasdaCard,
} from '../../NasdaComponents.js';
import { Color } from '../Constants';
import { getDate } from '../customAPI';
import PropTypes from 'prop-types';
let NasdaApp = require('../../NasdaApp');

export default class ReceiveDetails extends Component {
  static navigationOptions = {
    tabBarLabel: 'Receive',
    tabBarIcon: ({ tintColor, focused }) =>
      focused ? (
        <Image
          source={require('../../img/tabIcon/request_focus.png')}
          style={{ width: 25, height: 25 }}
        />
      ) : (
        <Image
          source={require('../../img/tabIcon/request.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
  };

  constructor(props) {
    super(props);
    let address = props.navigation.state.params.address;
    this.state = {
      isLoading: true,
      address: address,
      coins: ['NSD', 'BTC'],
      selectedCoinIndex: 1,
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
            text: 'REQUEST MONEY',
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
            <Text style={{ color: Color.text, fontSize: 14, marginBottom: 5 }}>
              {this.state.coins[this.state.selectedCoinIndex]} ADDRESS
            </Text>
            <QRCode
              value={this.state.address}
              size={180}
              bgColor="white"
              fgColor={NasdaApp.settings.brandingColor}
            />
            <Text style={{ color: Color.text, fontSize: 12, marginTop: 5 }}>
              {this.state.address}
            </Text>
            {/* <View style={styles.amountRowBetween} >
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
            <Text style={styles.fiatCurrency}>$350</Text> */}
            <Dash
              style={{
                width: '100%',
                height: 1,
                marginTop: 20,
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
              // onPress={() => this.createTransaction()}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Share</Text>
            </TouchableHighlight>
          </View>
        </KeyboardAwareScrollView>
      </SafeNasdaArea>

      /* <SafeNasdaArea
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
      </SafeNasdaArea> */
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

const { height } = Dimensions.get('window');

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
