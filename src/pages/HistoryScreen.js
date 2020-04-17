/* eslint-disable radix */
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  StatusBar,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {getHistory} from '../redux/action/history';
import {connect} from 'react-redux';
import {Item, Input, ListItem, Left, Radio} from 'native-base';
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

  generateDate = date => {
    const [y, m, d] = date.split('-');
    console.log(y, m, d);
    const month = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const generatedDate = `${d} ${month[parseInt(m) - 1]} ${y}`;
    return generatedDate;
  };

  renderRow = ({item}) => {
    return (
      <View style={styles.card}>
        <View
          style={
            item.status === 'SUCCESS'
              ? styles.successIndicator
              : styles.pendingIndicator
          }
        />
        <View style={styles.cardContent}>
          <View>
            <View style={styles.transfer}>
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
            <View style={styles.transfer}>
              <Text style={styles.amount}>
                Rp{this.generateAmount(item.amount)}{' '}
              </Text>
              <Icon name="lens" style={styles.dot} />
              <Text style={styles.date}>
                {' '}
                {this.generateDate(item.created_at.substr(0, 10))}
              </Text>
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
          <View style={styles.search}>
            <Item style={styles.searchItem}>
              <Icon name="search" style={styles.searchIcon} />
              <Input
                placeholder="Cari nama, bank, atau nominal"
                style={styles.searchInput}
              />
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    modalShown: true,
                  })
                }>
                <View style={styles.sort}>
                  <Text style={styles.sortText}>URUTKAN</Text>
                  <Image
                    source={require('../icons/keyboard_arrow_down.png')}
                    style={styles.sortIcon}
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
              style={styles.full}
              onPress={() => this.setState({modalShown: false})}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <ListItem style={styles.listItem}>
                    <Left>
                      <Radio
                        selected={false}
                        color="#ff6246"
                        selectedColor={'#ff6246'}
                      />
                      <Text style={styles.listItemText}>URUTKAN</Text>
                    </Left>
                  </ListItem>
                  <ListItem style={styles.listItem}>
                    <Left>
                      <Radio
                        selected={false}
                        color="#ff6246"
                        selectedColor={'#ff6246'}
                      />
                      <Text style={styles.listItemText}>Nama A-Z</Text>
                    </Left>
                  </ListItem>
                  <ListItem style={styles.listItem}>
                    <Left>
                      <Radio
                        selected={true}
                        color="#ff6246"
                        selectedColor={'#ff6246'}
                      />
                      <Text style={styles.listItemText}>Nama Z-A</Text>
                    </Left>
                  </ListItem>
                  <ListItem style={styles.listItem}>
                    <Left>
                      <Radio
                        selected={false}
                        color="#ff6246"
                        selectedColor={'#ff6246'}
                      />
                      <Text style={styles.listItemText}>Tanggal Terbaru</Text>
                    </Left>
                  </ListItem>
                  <ListItem style={styles.listItem}>
                    <Left>
                      <Radio
                        selected={false}
                        color="#ff6246"
                        selectedColor={'#ff6246'}
                      />
                      <Text style={styles.listItemText}>Tanggal Terlama</Text>
                    </Left>
                  </ListItem>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* history */}
          {noLoading ? (
            <FlatList
              style={styles.flatList}
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
  full: {flex: 1},
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
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 7,
    marginBottom: 7,
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 20,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transfer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {marginHorizontal: 7, marginTop: 7, marginBottom: 5},
  searchItem: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 8,
  },
  searchIcon: {color: '#ccc', marginLeft: 3, fontSize: 28},
  searchInput: {letterSpacing: 0, fontSize: 14, paddingLeft: 5},
  sort: {flexDirection: 'row', paddingRight: 2},
  sortText: {
    fontSize: 14,
    color: '#ff6246',
    marginRight: -5,
    fontWeight: 'bold',
  },
  sortIcon: {width: 45, height: 18},
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 5,
    paddingBottom: 15,
  },
  listItem: {marginTop: 15, borderColor: '#fff'},
  listItemText: {marginLeft: 10, fontSize: 16},
  flatList: {paddingVertical: 5},
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
  dot: {fontSize: 7},
  successIndicator: {backgroundColor: '#5ab483', width: 5},
  pendingIndicator: {backgroundColor: '#ff6246', width: 5},
});

const mapHistory = state => {
  return {
    histories: state.history,
  };
};

export default connect(mapHistory)(HistoryScreen);
