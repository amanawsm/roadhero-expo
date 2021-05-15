import 'react-native-gesture-handler';
import React , {useEffect} from 'react';
import { StyleSheet, SafeAreaView, Button, View } from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple, TouchableOpacity
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-community/async-storage';
import {config} from '../constants';

export default function ProfileScreen() {
  const [data, setData] = React.useState({
    email: '',
    name : '',
    phoneNo : '',
    address :  '',
    qualification : '',
    hospital : '',
    specialization : '',
    userToken : '',
});
const [imageURL , setImage ] = React.useState('http://192.168.43.49:5000/uploads/images/user.jpg');

  useEffect(() => {
    async function updateUI() {
      try{
        userEmail = await AsyncStorage.getItem('userEmail');
        userName = await AsyncStorage.getItem('userName');
        setData({
          ...data,
          name : userName,
          email: userEmail,
      });

      }catch(mess){
        console.log(mess);
      }
    }
    updateUI();
}, []);
  const renderDetailsInner = () => (
    <View style={styles.panel} backgroundColor="#fff">
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Professional Details</Text>
      </View>
      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => bs.current.snapTo(0)}  style={styles.infoBoxWrapper}>
          <View style={styles.menuItem}> 
            <FontAwesome name="user-md" color='#c79840' size={25}/>
            <Text style={styles.menuItemText}>Qualification</Text>
            <Caption style={styles.caption} marginLeft={30}>{data.qualification}</Caption>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}} style={styles.infoBoxWrapper}> 
          <View style={styles.menuItem}>
            <Icon name="credit-card" color='#c79840' size={25}/>
            <Text style={styles.menuItemText}>Speciality</Text>
            <Caption style={styles.caption} >{data.specialization}</Caption>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}} style={styles.infoBoxWrapper}> 
          <View style={styles.menuItem}>
            <Icon name="credit-card" color='#c79840' size={25}/>
            <Text style={styles.menuItemText}>Hospital / Clinic</Text>
            <Caption style={styles.caption} >{data.hospital}</Caption>
          </View>
        </TouchableRipple>
        <Text></Text>
      </View>
    </View>
  );

  const renderDocumentsInner = () => (
    <View style={styles.panel} backgroundColor="#fff">
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Documents</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

   const bs = React.createRef();
   const bsdoc =React.createRef();
   const fall = new Animated.Value(1);

  return (
    <SafeAreaView style={styles.container}>
       <BottomSheet
        ref={bs}
        snapPoints={[340, 0]}
        renderContent={renderDetailsInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <BottomSheet
        ref={bsdoc}
        snapPoints={[355, 0]}
        renderContent={renderDocumentsInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />

      <Animated.View style={{margin: 20,
        opacity: Animated.add(0.2, Animated.multiply(fall, 1.0)),
    }}>
    <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image
            source={require("../images/user.jpg")}
            size={80}
          />
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
              color:'#36586f'
            }]}>{data.name}</Title>
            <Caption style={styles.caption}>{data.specialization}</Caption>
          </View>
        </View>

        <View style={styles.userInfoSection} marginLeft={-20}>
        <View style={styles.row} marginTop={35}>
          <Icon style={styles.contactImage}
              name= "map-marker-radius"/>
          <Text style={styles.contactText}>{"User Address"}</Text>
        </View>
        <View style={styles.row}>
          <Icon style={styles.contactImage}
              name= "phone"/>
          <Text style={styles.contactText}>{data.phoneNo}</Text>
        </View>
        <View style={styles.row}>
          <Icon style={styles.contactImage}
              name= "email"/>
          <Text style={styles.contactText}>{data.email}</Text>
        </View>
        </View>
      </View>

      <View style={styles.slotsBoxWrapper}>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
            <Title color= '#36586f'>10</Title>
            <Caption>Scheduled Appointments</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title color='#36586f'>8</Title>
            <Caption >Scheduled Slots</Caption>
          </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => bs.current.snapTo(0)}  style={styles.infoBoxWrapper}>
          <View style={styles.menuItem}> 
            <FontAwesome name="user-md" color='#c79840' size={25}/>
            <Text style={styles.menuItemText}>Professional Details</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => bsdoc.current.snapTo(0)} style={styles.infoBoxWrapper}> 
          <View style={styles.menuItem}>
            <Icon name="credit-card" color='#c79840' size={25}/>
            <Text style={styles.menuItemText}>Professional Documents</Text>
          </View>
        </TouchableRipple>
      </View>
    </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:25
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  slotsBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 80,
    marginTop: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 60,
    marginTop: 25,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: -5,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#36586f',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  contactText:{
    color:"#777777", 
    marginLeft: 20
  },
  contactImage:{
    color:"#777777", 
    fontSize: 15
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    height: 35,
    color: '#36586f',
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#c79840',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  caption:{
    fontSize: 14,
    color: '#999',
  },
});