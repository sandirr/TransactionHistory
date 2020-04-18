import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Clipboard,
  ToastAndroid,
} from 'react-native';
import Styles from '../stylesheet/DetailHistory';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateGenerator from '../generator/DateGenerator';
import NumberGenerator from '../generator/NumberGenerator';
import CapitalizeCheck from '../generator/CapitalizeCheck';

const DetailHistory = props => {
  const {
    id,
    beneficiary_name,
    beneficiary_bank,
    sender_bank,
    unique_code,
    amount,
    created_at,
    remark,
    account_number,
  } = props.navigation.getParam('data');
  const copyId = () => {
    Clipboard.setString(id);
    ToastAndroid.show(
      'ID COPIED TO CLIPBOARD',
      ToastAndroid.LONG,
      ToastAndroid.TOP,
    );
  };
  return (
    <View style={Styles.container}>
      <View style={Styles.cardDetail}>
        <View style={Styles.idtrx}>
          <View style={Styles.trxContent}>
            <Text style={Styles.headerText}>ID TRANSAKSI: #{id}</Text>
            <TouchableOpacity style={Styles.copy} onPress={copyId}>
              <Image
                source={require('../icons/copy.png')}
                style={Styles.copyIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={Styles.textDetail}>
            <View style={Styles.viewText}>
              <Text style={Styles.headerText}>DETAIL TRANSAKSI</Text>
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <Text style={Styles.backText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={Styles.transfer}>
          <Text style={Styles.bankText}>
            <CapitalizeCheck bankName={sender_bank} />{' '}
          </Text>
          <Icon name="arrow-forward" style={Styles.bankText} />
          <Text style={Styles.bankText}>
            {' '}
            <CapitalizeCheck bankName={beneficiary_bank} />
          </Text>
        </View>

        <View style={Styles.sectionDetail}>
          <View style={Styles.sectionLeft}>
            <View style={Styles.eachData}>
              <Text style={Styles.secondHeader}>
                {beneficiary_name.toUpperCase()}
              </Text>
              <Text style={Styles.eachValue}>{account_number}</Text>
            </View>
            <View style={Styles.eachData}>
              <Text style={Styles.secondHeader}>BERITA TRANSFER</Text>
              <Text style={Styles.eachValue}>{remark}</Text>
            </View>
            <View style={Styles.eachData}>
              <Text style={Styles.secondHeader}>WAKTU DIBUAT</Text>
              <Text style={Styles.eachValue}>
                <DateGenerator data={created_at.substr(0, 10)} />
              </Text>
            </View>
          </View>
          <View style={Styles.sectionRight}>
            <View style={Styles.eachData}>
              <Text style={Styles.secondHeader}>NOMINAL</Text>
              <Text style={Styles.eachValue}>
                Rp
                <NumberGenerator data={amount} />
              </Text>
            </View>
            <View style={Styles.eachData}>
              <Text style={Styles.secondHeader}>KODE UNIK</Text>
              <Text style={Styles.eachValue}>{unique_code}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DetailHistory;
