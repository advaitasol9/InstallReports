import React from 'react';
import {
  StyleSheet, View, FlatList, StatusBar,
} from 'react-native';
import { apiGetJson } from '../../core/api';


import { Text } from '../../components/StyledText';
import { Header, OrderListTile } from '../../components';
import { colors } from '../../styles';

export default function WorkOrderScreen(props) {
  // const rnsUrl = 'https://reactnativestarter.com';
  // const handleClick = () => {
  //   Linking.canOpenURL(rnsUrl).then(supported => {
  //     if (supported) {
  //       Linking.openURL(rnsUrl);
  //     } else {
  //       console.log(`Don't know how to open URI: ${rnsUrl}`);
  //     }
  //   });
  // };

  const renderTile = (item, index) => (
    <OrderListTile
      index={index}
      item={item}
      setItemId={props.setItemId}
      setActivityId={props.setActivityId}
      navigation={props.navigation}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} barStyle="dark-content" />
      <Header
        connectionStatus={props.connectionStatus}
        changesNum={props.changes.length}
        navigation={props.navigation}
        sortAndFilter
        indicator
      />
      {
        props.orderList === [] && props.connectionStatus
          ? (
            <View style={styles.containerIndicator}>
              <Text>There is no connection</Text>
            </View>
          )
          : (
            <FlatList
              ListHeaderComponent={null}
              scrollEventThrottle={16}
              refreshing={false}
              onRefresh={async () => {
                if (props.connectionStatus) {
                  const data = await apiGetJson('test-app-1/activities?with=[%22items%22]', props.token);
                  const result = [];
                  await data.data.forEach((activity) => {
                    if (activity.items.length > 0
                      && activity.status !== 'Partial'
                      && activity.status !== 'Failed'
                      && activity.status !== 'Complete'
                    ) {
                      result.push(activity);
                    }
                  });
                  props.setOrderList(result);
                }
              }}
              data={props.orderList}
              keyExtractor={item => item.activityId}
              renderItem={({ item, index }) => renderTile(item, index)}
            />
          )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.lightGray,
  },
  containerIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  bgImage: {
    flex: 1,
    position: 'absolute',
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 30,
  },
  tileContainer: {
    width: '100%',
    paddingTop: 8,
    backgroundColor: 'white',
    marginBottom: 8,
    flexDirection: 'row',
    paddingRight: 16,
  },
  tileLogoContainer: {
    width: '15%',
    alignItems: 'center',
  },
  tileLogo: {
    width: 50,
    height: 50,
    aspectRatio: 1,
  },
  tileInfoContainer: {
    width: '85%',
    paddingLeft: 8,
  },
  infoCompany: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '500',
    paddingTop: 8,
  },
  infoBottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 32,
  },
  infoBottomText: {
    color: '#636363',
    fontSize: 12,
  },
});
