import 'react-native-gesture-handler';
import React , {useEffect , useState } from 'react';
import { StyleSheet, SafeAreaView, Button, View } from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple, TouchableOpacity,
  Modal,
  ActivityIndicator
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-community/async-storage';
import {config} from '../constants';

export default function ProfileScreen() {
  const [data, setData] = React.useState({
    email: '',
    name : '',
    phoneNo : '',
    address :  '',
    userToken : '',
});
const [request,setRequest] = useState(0);
const [services,setServices] = useState("0");
const[refresh , setRefresh] = useState(null);
const [message , setMessage] = useState('Please Wait');
const [getModal , setModal] = useState(null);

  useEffect(() => {
    async function updateUI() {
    console.log("Request in change name ");
    try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userName = await AsyncStorage.getItem('userName');
        const userPh = await AsyncStorage.getItem('phone');
        const location = await AsyncStorage.getItem('userAddress');
        console.log("PHONE");
        console.log(userPh);
        setData({
            ...data,
            name : userName,
            email : userEmail,
            phoneNo : userPh
        })
      } catch(e) {
        console.log(e);
      }
      var auth;
      try{
        auth = await AsyncStorage.getItem('userToken');
        console.log(` AUTH${auth}`);
      }catch(e){
        console.log(e.message);
        console.log("Error getting auth");
      }
      try{
        setModal(true);
        setMessage("Getting All Requests");
        const response = await fetch(`${config.Api_Url}/getAllRequests`, {
            method: "GET",
            headers: {
              Authorization : 'Bearer ' + auth ,
            }
          });
          setModal(false);
          const responseData = await response.json();
         // const appointments = responseData.appointments;
          const status = await response.status;
          console.log(`Status Code : ${status}`);
          console.log(responseData);
          var data = responseData.data;
          console.log(`Length ${data.length}`);
        //   setData({
        //       ...data,
        //       requests : data.length
        //   });
        setRequest(data.length);
      }catch(error){
          console.log(`Error ${error.message}`);
      }
      try{
        setModal(true);
        setMessage("Getting Vendor Services");
        const response = await fetch(`${config.Api_Url}/vendorServices`, {
                method: "GET",
                headers: {
                  Authorization : 'Bearer ' + auth,
                }
              });
            setModal(false);
              const responseData = await response.json();
              const status = await response.status;
              console.log(`Status Code : ${status}`);
              console.log(responseData);
              var data = responseData.data;
           //   var newServices = [];
              var ser = 0 ;
              if(status == 200)
              {
                var i;
                for(i =0 ; i < data.length ; i++){
                  if(data[i].status){
                      ser++;
                  }
                }
              }else{
                Alert.alert("Error Fetching Data.");
              }
              //console.log("")
              setServices(ser);
      }catch(message){

      }

    }
    updateUI();
}, []);

   const bs = React.createRef();
   const bsdoc =React.createRef();
   const fall = new Animated.Value(1);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{margin: 20,
        opacity: Animated.add(0.2, Animated.multiply(fall, 1.0)),
    }}>
    <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image
            source={require('../images/user.jpg')}
            size={80}
          />
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
              color:'#36586f'
            }]}>{data.name}</Title>
          </View>
        </View>

        <View style={styles.userInfoSection} marginLeft={-20}>
        <View style={styles.row} marginTop={35}>
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
            <Title color= '#36586f'>{services}</Title>
            <Caption>Services Offered</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title color='#36586f'>{request}</Title>
            <Caption >Services Requests</Caption>
          </View>
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
modalBackground: {
  flex: 1,
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'space-around',
  backgroundColor: '#00000080',
},
activityIndicatorWrapper: {
  backgroundColor: 'white',
  height: '20%',
  width: '80%',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#C0C0C0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
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