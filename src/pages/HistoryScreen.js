import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
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
import DateGenerator from '../generator/DateGenerator';
import NumberGenerator from '../generator/NumberGenerator';
import CapitalizeCheck from '../generator/CapitalizeCheck';
import Styles from '../stylesheet/HistoryStyle';

class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notFilteredData: [],
      data: [],
      search: '',
      modalShown: false,
      isFetching: false,
      sortBy: [
        'URUTKAN',
        'Nama A-Z',
        'Nama Z-A',
        'Tanggal Terbaru',
        'Tanggal Terlama',
      ],
      activeSort: 'URUTKAN',
    };
  }
  componentDidMount() {
    this.getHistory();
  }

  componentDidUpdate() {
    if (this.state.notFilteredData.length < 1) {
      let data = [];
      Object.keys(this.props.histories.history).forEach(e => {
        let newData = this.props.histories.history[e];
        data.push(newData);
        this.setState({
          notFilteredData: data,
          data,
        });
      });
    }
  }

  refreshData = () => {
    this.setState({isFetching: true, notFilteredData: []});
    this.getHistory();
    this.setState({isFetching: false});
  };

  getHistory() {
    this.props.dispatch(getHistory());
  }

  searchHistory = text => {
    let newData = this.state.notFilteredData.filter(preData => {
      let name = preData.beneficiary_name
        .toLowerCase()
        .match(text.toLowerCase());
      let beneficiary_bank = preData.beneficiary_bank
        .toLowerCase()
        .match(text.toLowerCase());
      let sender_bank = preData.sender_bank
        .toLowerCase()
        .match(text.toLowerCase());
      let amount = preData.amount
        .toString()
        .toLowerCase()
        .match(text.toLowerCase());
      return name + amount + beneficiary_bank + sender_bank;
    });
    if (text !== '') {
      this.setState({data: newData, search: text});
    } else {
      this.setState({data: this.state.notFilteredData, search: text});
    }
  };

  sorting = sortType => {
    let result = this.state.notFilteredData.sort((a, b) => {
      if (sortType === 'Nama A-Z') {
        return (
          a.beneficiary_name.toLowerCase() > b.beneficiary_name.toLowerCase()
        );
      } else if (sortType === 'Nama Z-A') {
        return (
          b.beneficiary_name.toLowerCase() > a.beneficiary_name.toLowerCase()
        );
      } else if (sortType === 'Tanggal Terlama') {
        return b.created_at < a.created_at;
      } else if (sortType === 'Tanggal Terbaru') {
        return a.created_at < b.created_at;
      } else {
        return a.created_at < b.created_at;
      }
    });
    this.setState({
      data: result,
      activeSort: sortType,
      modalShown: false,
      search: '',
    });
  };

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Detail', {data: item})}>
        <View style={Styles.card}>
          <View
            style={
              item.status === 'SUCCESS'
                ? Styles.successIndicator
                : Styles.pendingIndicator
            }
          />
          <View style={Styles.cardContent}>
            <View>
              <View style={Styles.transfer}>
                <Text style={Styles.bankText}>
                  <CapitalizeCheck bankName={item.sender_bank} />{' '}
                </Text>
                <Icon name="arrow-forward" style={Styles.bankText} />
                <Text style={Styles.bankText}>
                  {' '}
                  <CapitalizeCheck bankName={item.beneficiary_bank} />
                </Text>
              </View>
              <Text style={Styles.beneficiery}>
                {item.beneficiary_name.toUpperCase()}
              </Text>
              <View style={Styles.transfer}>
                <Text style={Styles.amount}>
                  Rp
                  <NumberGenerator data={item.amount} />{' '}
                </Text>
                <Icon name="lens" style={Styles.dot} />
                <Text style={Styles.date}>
                  {' '}
                  <DateGenerator data={item.created_at.substr(0, 10)} />
                </Text>
              </View>
            </View>
            <View
              style={
                item.status === 'SUCCESS' ? Styles.success : Styles.pending
              }>
              <Text
                style={
                  item.status === 'SUCCESS'
                    ? Styles.successText
                    : Styles.pendingText
                }>
                {item.status === 'SUCCESS' ? 'Berhasil' : 'Pengecekan'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {noLoading} = this.props.histories;
    console.log('notfiltered', this.state.notFilteredData);
    return (
      <>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={
            this.state.modalShown ? 'rgba(rgba(0,0,0,.5))' : '#edf4f0'
          }
        />
        <View style={Styles.contentContainer}>
          {/* search */}
          <View style={Styles.search}>
            <Item style={Styles.searchItem}>
              <Icon name="search" style={Styles.searchIcon} />
              <Input
                placeholder="Cari nama, bank, atau nominal"
                style={Styles.searchInput}
                onChangeText={text => this.searchHistory(text)}
                value={this.state.search}
              />
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    modalShown: true,
                  })
                }>
                <View style={Styles.sort}>
                  <Text style={Styles.sortText}>{this.state.activeSort}</Text>
                  <Image
                    source={require('../icons/keyboard_arrow_down.png')}
                    style={Styles.sortIcon}
                  />
                </View>
              </TouchableOpacity>
            </Item>
          </View>

          {/* modal */}
          <Modal visible={this.state.modalShown} transparent={true}>
            <TouchableOpacity
              style={Styles.full}
              onPress={() => this.setState({modalShown: false})}>
              <View style={Styles.modalOverlay}>
                <View style={Styles.modalContent}>
                  {this.state.sortBy.map((sortType, index) => (
                    <ListItem
                      style={Styles.listItem}
                      key={index}
                      onPress={() => this.sorting(sortType)}>
                      <Left>
                        <Radio
                          onPress={() => this.sorting(sortType)}
                          selected={
                            sortType === this.state.activeSort ? true : false
                          }
                          color="#ff6246"
                          selectedColor={'#ff6246'}
                        />
                        <Text style={Styles.listItemText}>{sortType}</Text>
                      </Left>
                    </ListItem>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* history */}
          {noLoading ? (
            <FlatList
              style={Styles.flatList}
              onRefresh={() => this.refreshData()}
              refreshing={this.state.isFetching}
              showsVerticalScrollIndicator={false}
              data={this.state.data}
              renderItem={this.renderRow}
              keyExtractor={item => item.id.toString()}
            />
          ) : (
            <View style={Styles.container}>
              <ActivityIndicator size="large" color="#ff6246" />
            </View>
          )}
        </View>
      </>
    );
  }
}

const mapHistory = state => {
  return {
    histories: state.history,
  };
};

export default connect(mapHistory)(HistoryScreen);
