/** @type {AppStorage} */
import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import {
  Button,
  FormLabel,
  FormInput,
  Card,
  Text,
  Header,
  List,
  ListItem,
} from 'react-native-elements';
import { Color } from './screen/Constants.js'
import { ActivityIndicator, ListView, View, Dimensions, Platform, TouchableHighlight, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
let NasdaApp = require('./NasdaApp');

const { width, heigth } = Dimensions.get('window')

export class NasdaButton extends Component {
  render() {
    return (
      <Button
        {...this.props}
        style={{
          marginTop: 20,
          borderRadius: 6,
        }}
        borderRadius={10}
        backgroundColor={Color.button}
      />
    );
  }
  /* icon={{name: 'home', type: 'octicon'}} */
}

export class SafeNasdaArea extends Component {
  render() {
    return (
      <SafeAreaView
        {...this.props}
        forceInset={{ horizontal: 'always' }}
        style={{ flex: 1, backgroundColor: NasdaApp.settings.brandingColor }}
      />
    );
  }
}

export class NasdaCard extends Component {
  render() {
    return (
      <Card
        {...this.props}
        titleStyle={{ color: 'white' }}
        containerStyle={{ backgroundColor: NasdaApp.settings.buttonBackground }}
        wrapperStyle={{ backgroundColor: NasdaApp.settings.buttonBackground }}
      />
    );
  }
}

export class NasdaText extends Component {
  render() {
    return <Text {...this.props} style={{ color: 'white' }} />;
  }
}

export class NasdaLabel extends Component {
  render() {
    var color = Color.light_text
    if (this.props.style !== undefined && this.props.style.color !== undefined) {
      color = this.props.style.color
    }
    return <Text {...this.props} style={[this.props.style, {color: color, fontSize: 12}]} />
  }
}

export class NasdaTitle extends Component {
  render() {
    return <Text {...this.props} style={{ color: Color.normal, fontSize: 14 }} />
  }
}

export class NasdaListItem extends Component {
  render() {
    return (
      <ListItem
        {...this.props}
        containerStyle={styles.listItem}
        titleStyle={{ color: 'white', fontSize: 18 }}
        subtitleStyle={{ color: 'white' }}
      />
    );
  }
}

export class NasdaFormLabel extends Component {
  render() {
    return <FormLabel {...this.props} labelStyle={{ color: 'black' }} />;
  }
}

export class NasdaFormInput extends Component {
  render() {
    return <FormInput {...this.props} inputStyle={{ color: 'black' }} />;
  }
}

export class NasdaHeader extends Component {
  render() {
    return (
      <Header
        {...this.props}
        backgroundColor={NasdaApp.settings.brandingColor}
        height={40}
        statusBarProps={{barStyle: 'light-content'}}
        outerContainerStyles={{ height: Platform.OS === 'ios' ? 80 : 80, borderBottomWidth: 0 }}
      />
    );
  }
}

export class NasdaSpacing extends Component {
  render() {
    return (
      <View
        {...this.props}
        style={{ height: 60, backgroundColor: NasdaApp.settings.brandingColor }}
      />
    );
  }
}

export class NasdaSpacing20 extends Component {
  render() {
    return (
      <View
        {...this.props}
        style={{ height: 20, backgroundColor: NasdaApp.settings.brandingColor }}
      />
    );
  }
}

export class NasdaListView extends Component {
  render() {
    return <ListView {...this.props} />;
  }
}

export class NasdaList extends Component {
  render() {
    return (
      <List
        {...this.props}
        containerStyle={{ backgroundColor: NasdaApp.settings.brandingColor }}
      />
    );
  }
}

export class NasdaView extends Component {
  render() {
    return (
      <View
        {...this.props}
        containerStyle={{ backgroundColor: NasdaApp.settings.brandingColor }}
      />
    );
  }
}

export class NasdaLoading extends Component {
  render() {
    return (
      <SafeNasdaArea>
        <View style={{ flex: 1, paddingTop: 200 }}>
          <ActivityIndicator />
        </View>
      </SafeNasdaArea>
    );
  }
}

export class NasdaWalletItem extends Component {
  render() {
    return (
      <TouchableHighlight {...this.props} style={[styles.item, this.props.style]} underlayColor='#232951'>
        <View style={styles.row}>
          <FontAwesome name='bitcoin' color={Color.mark} size={20} />
          <View style={[styles.column, {marginLeft: 10}]} >
            {/* <Text>{this.props.data.} */}
            <Text style={{color: '#f2f3f8', fontSize: 14}} >{this.props.data.getLabel()} </Text>
            <Text style={{color: '#f2f3f8', fontSize: 14}} >{this.props.data.getBalance()} BTC </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export class NasdaPaper extends Component {
  render() {
    return (
      <View style={styles.paper}>
        <Image style={styles.outline} source={require('./img/outline_top.png')} />
        <View {...this.props} style={[styles.paperContent, this.props.style]} />
        <Image style={styles.outline} source={require('./img/outline_bottom.png')} />
      </View>
    );
  }
}

export class NasdaIcon extends Component {
  render() {
    var size = 30
    if (this.props.size !== undefined) {
      size = this.props.size
    }
    var bkColor = Color.mark
    if (this.props.backgroundColor !== undefined) {
      bkColor = this.props.backgroundColor
    }
    return (
      <View style={{ width: size, height: size, borderRadius: size, backgroundColor: bkColor, alignItems: 'center', justifyContent: 'center'}}>
        {this.props.icon}
      </View>
    );
  }
}

const styles = {
  listItem: {
    borderRadius: 10,
    backgroundColor: '#1b1f39',
    width: width - 30,
    height: 80,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    borderBottomWidth: 0,
  },
  item: {
    borderRadius: 10,
    backgroundColor: Color.item,
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  column: {
    flexDirection: 'column',
    alignItems: "flex-start",
    justifyContent: 'center'
  },
  paper: {
    paddingTop: 30,
    width: '100%'
  },
  outline: {
    width: '100%',
    height: 15
  },
  paperContent: {
    paddingTop: 30,
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    flexDirection: 'column',
    alignItems:'center',
    justifyContent: 'flex-end',
    height: 350,
  }
}
