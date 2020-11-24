// @flow
import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import moment from 'moment';

export default class OrderListTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 10
    };
    
  }

  componentWillMount() {
    if (this.props.item.accounts.length > 0 && this.props.item.accounts[0].logo_thumb_file_url) {
      Image.getSize(this.props.item.accounts[0].logo_thumb_file_url, (width, height) => {
        const windowWidth = Dimensions.get('window').width;
        const availableWidth = windowWidth / 10;
        const ratio = availableWidth / width;
        this.setState({ width: availableWidth,height: height * ratio });
      });
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.setActivityId(this.props.item.id);
          this.props.navigation.navigate('Details');
        }}
        style={[styles.tileContainer, { marginTop: this.props.index === 0 ? 8 : 0 }]}
      >
        <View style={styles.tileLogoContainer}>
          {this.props.item.accounts.length > 0 && this.props.item.accounts[0].logo_thumb_file_url ? (
            <Image style={{ width: this.state.width, height: this.state.height, flex: 1,resizeMode: 'contain' }} source={{ uri: this.props.item.accounts[0].logo_thumb_file_url }} />
          ) : null}
        </View>
        <View style={styles.tileInfoContainer}>
          {this.props.connectionStatus && <Text style={styles.infoCompany}>{this.props.item.account_name}</Text>}
          {!this.props.connectionStatus && <Text style={styles.infoCompany}>{this.props.item.accounts[0].name}</Text>}
          {this.props.connectionStatus && <Text style={styles.infoTitle}>{this.props.item.item_name}</Text>}
          {!this.props.connectionStatus && <Text style={styles.infoTitle}>{this.props.item.items[0].name}</Text>}
          <View style={styles.infoBottomSection}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.infoBottomText, { marginRight: 20 }]}>#{this.props.item.id}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.infoBottomText}>{this.props.item.date_2 && `Due ${moment(this.props.item.date_2).format('MM/DD/YY')}`}</Text>
            </View>
          </View>
          <View style={styles.infoBottomSection}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.infoBottomText}>
                  {this.props.item.address_1 && `${this.props.item.address_1}, `}
                  {this.props.item.city && `${this.props.item.city}, `}
                  {this.props.item.state && `${this.props.item.state}`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tileContainer: {
    width: '100%',
    paddingTop: 8,
    backgroundColor: 'white',
    marginBottom: 8,
    flexDirection: 'row',
    paddingRight: 16
  },
  tileLogoContainer: {
    width: '15%',
    alignItems: 'center',
    marginLeft: 8
  },
  tileInfoContainer: {
    width: '85%',
    paddingLeft: 8
  },
  infoCompany: {
    fontSize: 14,
    fontWeight: '500'
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '500',
    paddingTop: 8
  },
  infoBottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 32
  },
  infoBottomText: {
    color: '#636363',
    fontSize: 12
  }
});
