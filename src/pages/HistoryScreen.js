import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Picker,
  TextInput,
  Keyboard,
  StatusBar,
  Image,
  Modal,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {getHistory} from '../redux/action/history';
import {connect} from 'react-redux';
import {
  Item,
  Input,
  ListItem,
  List,
  Right,
  Left,
  Radio,
  Body,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

class HistoryScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      search: '',
      modalShown: false,
      isFetching: false,
    };
  }
  componentDidMount() {
    this.getHistory();
  }

  componentDidUpdate() {
    if (this.state.data.length < 1) {
      let data = [];
      Object.keys(this.props.histories.history).forEach(e => {
        let newData = this.props.histories.history[e];
        data.push(newData);
        this.setState({data});
      });
    }
  }

  refreshData = () => {
    this.setState({isFetching: true});
    this.props.dispatch(getHistory());
    this.setState({isFetching: false});
  };

  getHistory() {
    this.props.dispatch(getHistory());
  }

  capitalizecheck = bankName => {
    let nameResult = '';
    bankName.length > 4
      ? (nameResult = bankName[0].toUpperCase() + bankName.slice(1))
      : (nameResult = bankName.toUpperCase());
    return nameResult;
  };

  generateAmount = amount => {
    const newAmountFormat = amount
      .toString()
      .split('')
      .reverse()
      .join('')
      .match(/\d{1,3}/g)
      .join('.')
      .split('')
      .reverse()
      .join('');
    return newAmountFormat;
  };

  renderRow = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          marginHorizontal: 7,
          marginBottom: 7,
          flexDirection: 'row',
          borderRadius: 5,
          overflow: 'hidden',
        }}>
        <View
          style={{
            backgroundColor: item.status === 'SUCCESS' ? '#5ab483' : '#ff6246',
            width: 5,
          }}
        />
        <View
          style={{
            flex: 1,
            paddingVertical: 15,
            paddingLeft: 20,
            paddingRight: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.bankText}>
                {this.capitalizecheck(item.sender_bank)}{' '}
              </Text>
              <Icon name="arrow-forward" style={styles.bankText} />
              <Text style={styles.bankText}>
                {' '}
                {this.capitalizecheck(item.beneficiary_bank)}
              </Text>
            </View>
            <Text style={styles.beneficiery}>
              {item.beneficiary_name.toUpperCase()}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.amount}>
                Rp{this.generateAmount(item.amount)}{' '}
              </Text>
              <Icon name="lens" style={{fontSize: 7}} />
              <Text style={styles.date}> {item.created_at}</Text>
            </View>
          </View>
          <View
            style={item.status === 'SUCCESS' ? styles.success : styles.pending}>
            <Text
              style={
                item.status === 'SUCCESS'
                  ? styles.successText
                  : styles.pendingText
              }>
              {item.status === 'SUCCESS' ? 'Berhasil' : 'Pengecekan'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {noLoading} = this.props.histories;
    console.log(this.state.data);
    return (
      <>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={
            this.state.modalShown ? 'rgba(rgba(0,0,0,.5))' : '#edf4f0'
          }
        />
        <View style={styles.contentContainer}>
          {/* search */}
          <View style={{marginHorizontal: 7, marginTop: 7, marginBottom: 5}}>
            <Item
              style={{
                backgroundColor: '#fff',
                borderColor: '#fff',
                borderRadius: 8,
              }}>
              <Icon
                name="search"
                style={{color: '#ccc', marginLeft: 3, fontSize: 28}}
              />
              <Input
                placeholder="Cari nama, bank, atau nominal"
                style={{letterSpacing: 0, fontSize: 14, paddingLeft: 5}}
              />
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    modalShown: true,
                  })
                }>
                <View style={{flexDirection: 'row', paddingRight: 2}}>
                  <Text style={{fontSize: 14, color: '#ff6246'}}>URUTKAN</Text>
                  <Image
                    source={require('../icons/keyboard_arrow_down.png')}
                    style={{width: 45, height: 18}}
                  />
                </View>
              </TouchableOpacity>
            </Item>
          </View>

          {/* modal */}
          <Modal
            visible={this.state.modalShown}
            transparent={true}
            // onRequestClose={() => {
            //   Alert.alert('Modal has been closed.');
            // }}
          >
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.setState({modalShown: false})}>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,.5)',
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    marginHorizontal: 20,
                    borderRadius: 5,
                    paddingBottom: 15,
                  }}>
                  <ListItem style={{marginTop: 15, borderColor: '#fff'}}>
                    <Left>
                      <Radio
                        selected={false}
                        color="#ff6246"
                        selectedColor={'#ff6246'}
                      />
                      <Text style={{marginLeft: 10, fontSize: 16}}>
                        URUTKAN
                      </Text>
                    </Left>
                  </ListItem>
                  <ListItem style={{marginTop: 15, borderColor: '#fff'}}>
                    <Left>
                      <Radio
                        selected={false}
                        color="#ff6246"
                        selectedColor={'#ff6246'}
                      />
                      <Text style={{marginLeft: 10, fontSize: 16}}>
                        Nama A-Z
                      </Text>
                    </Left>
                  </ListItem>
                  <ListItem style={{marginTop: 15, borderColor: '#fff'}}>
                    <Left>
                      <Radio
                        selected={true}
                        color="#ff6246"
                        selectedColor={'#ff6246'}
                      />
                      <Text style={{marginLeft: 10, fontSize: 16}}>
                        Nama Z-A
                      </Text>
                    </Left>
                  </ListItem>
                  <ListItem style={{marginTop: 15, borderColor: '#fff'}}>
                    <Left>
                      <Radio
                        selected={false}
                        color="#ff6246"
                        selectedColor={'#ff6246'}
                      />
                      <Text style={{marginLeft: 10, fontSize: 16}}>
                        Tanggal Terbaru
                      </Text>
                    </Left>
                  </ListItem>
                  <ListItem style={{marginTop: 15, borderColor: '#fff'}}>
                    <Left>
                      <Radio
                        selected={false}
                        color="#ff6246"
                        selectedColor={'#ff6246'}
                      />
                      <Text style={{marginLeft: 10, fontSize: 16}}>
                        Tanggal Terlama
                      </Text>
                    </Left>
                  </ListItem>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* history */}
          {noLoading ? (
            <FlatList
              style={{paddingVertical: 5}}
              onRefresh={() => this.refreshData()}
              refreshing={this.state.isFetching}
              showsVerticalScrollIndicator={false}
              data={this.state.data}
              renderItem={this.renderRow}
              keyExtractor={item => item.id.toString()}
            />
          ) : (
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#ff6246" />
            </View>
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#edf4f0',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#edf4f0',
  },
  success: {
    backgroundColor: '#5ab483',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    borderColor: '#ff6246',
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pendingText: {
    fontWeight: 'bold',
  },
  bankText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  beneficiery: {
    fontSize: 18,
  },
  amount: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
  },
});

const mapHistory = state => {
  return {
    histories: state.history,
  };
};

export default connect(mapHistory)(HistoryScreen);
