import React, {useState , useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
  RefreshControl
} from 'react-native';

import {SwipeListView} from 'react-native-swipe-list-view';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

import * as Location from 'expo-location';

import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

import AwesomeAlert from 'react-native-awesome-alerts';
import {config} from '../constants';


const ServicesRequests = () => {
    const [checked, setChecked] = React.useState(false);

    const [listData, setListData] = useState(null);

    const [getModal, setModal] = useState(false);
    const [status, setStatus] =useState(false);

      const [date , setDate] = useState(new Date());

      const [refresh , setRefresh] = useState(null);

      const [refreshing, setRefreshing] = React.useState(false);

      const [items , setItems] = useState(true);

      const[showAlert , setShowAlert] = useState(false);
      const[AlertTitle, setAlertTitle ] = useState("Confirmation Alert");
      const[AlertMessage, setAlertMessage ] = useState("Custom Message");
  
      const hideAlert = () =>{
        console.log("HIDE");
        setShowAlert(false);
      }
  

      const onRefresh = React.useCallback(() => {
      //  setRefresh(!refresh);
        Update();
        // setRefreshing(true);
        // wait(2000).then(() => setRefreshing(false));
      }, []);

      const Update = async () =>{
        function tConvert (time) {
          time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
          if (time.length > 1) { // If time format correct
            time = time.slice (1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
          }
          return time.join (''); // return adjusted time or original string
        }
        var auth;
      try{
        auth = await AsyncStorage.getItem('userToken');
        console.log(` AUTH${auth}`);
      }catch(e){
        console.log(e.message);
        console.log("Error getting auth");
      }
          try {
          setModal(true);
            const response = await fetch(`${config.Api_Url}/getAllRequests`, {
              method: "GET",
              headers: {
                Authorization : 'Bearer ' + auth ,
              }
            });
            setModal(false);
            const responseData = await response.json();
            const status = await responseData.status;
            console.log(`Status Code : ${status}`);
            console.log(responseData);
            var newRequest = [];
            if(status == 200)
            {
              if(responseData.data.length < 1){
                setItems(false);
                return;
              }
              var data = responseData.data;
              var i;
              for(i =0 ; i < data.length ; i++){
                if(responseData.data[i].longitude > 0 && responseData.data[i].latitude  ){
                console.log(`Long : ${responseData.data[i].longitude}`);
                console.log(`Lati : ${responseData.data[i].latitude}`);
                var longLat = {
                  latitude : parseFloat((responseData.data[i].latitude)),
                  longitude : parseFloat((responseData.data[i].longitude))
                }
                //console.log(val);
                var address;
                //var ch = false;
                //let promise =
                await (Location.reverseGeocodeAsync(longLat)).then((location) => {
                  console.log("Location")
                  console.log(location);
                  const loc = location[0];
                  console.log(` Country :  ${location[0].country}`);
                  address = `${loc.street} , ${loc.subregion} , ${loc.country} , ${loc.region} `;
                });

                }else{
                  address = "Invalid Address"
                }
                const date = data[i].created_at;
                const y = date.slice(0,4);
                console.log(`Year : ${y}`);
                const m = date.slice(5,7);
                console.log(`mon : ${m}`);
                const d = date.slice(8,10);
                console.log(`date : ${d}`);
                 const h = date.slice(11,13 );
                 console.log(`hour : ${h}`);
                 const mi = date.slice(14,16);
                 console.log(`Min ${mi} ` );
                 console.log(`Date get ${date}`);
                const dateF = new Date(y,m,d,h,mi);
                console.log(`Date Converted ${dateF}`);
                var dateAppended = (dateF.getHours()).toString() ;
                var timeAppended = dateF.getMinutes().toString();
                console.log(`Date Len ${dateAppended.length}`);
                console.log(`Time Len ${timeAppended.length}`);
                if(dateAppended.length < 2){
                  console.log("test");
                  dateAppended = `0${dateAppended}`;
                }
                if(timeAppended.length < 2){
                  timeAppended = `0${timeAppended}`;
                }
                const time = `${dateAppended}:${timeAppended}`;
                console.log(time);
                const timeTw = tConvert(time);
                const monthId = dateF.getMonth();
                var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July' ,
                'August', 'Sept' , 'Oct' , 'Nov' , 'Dec'];
                var monName = months[monthId-1];
                var dateId = dateF.getDate();
                var year = dateF.getFullYear();

                const dateStr = `${monName} ${dateId} ${year} ${timeTw} `;

                console.log(dateStr);
                var request = {
                    id : data[i].id,
                    vendor : data[i].name,
                    address,
                    bill : data[i].service.price,
                    service : data[i].service.name,
                    image : data[i].service.image,
                    date : dateStr
                  }
                newRequest.push(request);
              }
            }
            else if(status == 400){
              setShowAlert(true);
              setAlertTitle("Information Message");
              setAlertMessage(`${responseData.message}`);
              setItems(false);
            }
            else{
              setShowAlert(true);
              setAlertTitle("Error Message");
              setAlertMessage("Error Fetching Data.");
            }
          console.log(newRequest);
          setListData(
                newRequest.map((request, index) =>
                ({
                    key: `${index}`,
                    id : request.id,
                    vendor : request.vendor,
                    address : request.address ,
                    bill : request.bill,
                    service : request.service,
                    image : request.image,
                    date : request.date
              })));
            console.log(listData);
        }catch(e) {
              console.log(e); 
              setShowAlert(true);
              setAlertTitle("Error Message");
              setAlertMessage("Unexpected Error Occur. Try Again!");
        }
      }

      useEffect(() => {
        async function UpdateUI() {
          Update();
            }
            UpdateUI();
        }, [refresh]);

        const acceptHandler = (k) => {
          listData.map( async (request)=>{
            if(request.key == k){
              console.log(`Request index :  ${k}`);
              console.log(`Request ID :  ${request.id}`);
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
                console.log(`REQUESSSSST ID IS ${request.id}`);
                console.log(`${config.Api_Url}/AcceptVendorServiceRequest/${request.id}`);

                const response = await fetch(`${config.Api_Url}/AcceptVendorServiceRequest/${request.id}`, {
                  method: "GET",
                  headers: {
                    Authorization : 'Bearer ' + auth ,
                  }
                });
                setModal(false);
                const responseData = await response.json();
                const status = await response.status;
                console.log(responseData);
              if(status == 200){
              setShowAlert(true);
              setAlertTitle("Confirmation Message");
              setAlertMessage("Service Accepted!");
              //  Alert.alert("Service Accepted");
                setListData(null);
                setRefresh(!refresh);
              }else{
                setShowAlert(true);
              setAlertTitle("Error Message");
               setAlertMessage(`${responseData.message}`);
          //      Alert.alert(responseData.message);
              }
              }catch(e){
                setShowAlert(true);
                setAlertTitle("Error Message");
               setAlertMessage("Error Accepting Service. Try Again!");
              //   Alert.alert(e.message);

              }
            }
          })
          console.log(`Key is ${k}`);
          console.log(k);
          setChecked(!checked);
        }

        const rejectHandler = (k) => {
          listData.map( async (request)=>{
            var auth;
              try{
                auth = await AsyncStorage.getItem('userToken');
                console.log(` AUTH${auth}`);
              }catch(e){
                console.log(e.message);
                console.log("Error getting auth");
              }
            if(request.key == k){
              console.log(`History ID :  ${request.id}`);
              try{
                setModal(true);
                const response = await fetch(`${config.Api_Url}/RejectVendorServiceRequest/${request.id}`, {
                  method: "GET",
                  headers: {
                    Authorization : 'Bearer ' + auth,
                  }
                });
                setModal(false);
                const status = await response.status;
                console.log(`Status Code : ${status}`);
              if(status == 200){
                setShowAlert(true);
                setAlertTitle("Confirmation Message");
                setAlertMessage("Request Rejected");
                setListData(null);
                setRefresh(!refresh);
              }
              }catch(message){
                setShowAlert(true);
                setAlertTitle("Confirmation Message");
                 setAlertMessage("Error Rejecting Service. Try Again!");
              }
            }
          })
          console.log(`Key is ${k}`);
          console.log(k);
          setChecked(!checked);
        }

      const VisibleItem = props => {
        const { data } = props;
        return (
            <View>
                <View style={styles.rowFront} >
                <TouchableHighlight
                  style={styles.rowFrontVisible}
                  onPress={() => console.log(`Element touched ${data.item.key}`)}
                  underlayColor={'#fffff'}
                  >
                <View flexDirection='row'>
                    <View alignItems='center' >
                        <Text style={styles.name} >
                        {data.item.title}
                        </Text>
                    </View>
                    <View style = {styles.checkItem} >
                    <Text> {data.item.date}</Text>
                        </View>
                </View>
                </TouchableHighlight>
                <View style = {styles.detailsView}>
                <Entypo
                name="location-pin"
                size={25}
                style={styles.trash}
                color="black"
            />
                <Text style={styles.details} >
                 {data.item.address}
                </Text>
                </View>
                <View style = {styles.vendorView}>
                <EvilIcons
                name="user"
                size={30}
                style={styles.trash}
                color="black"
              />
                <Text style={styles.vendor} >
                 {data.item.vendor}
                </Text>
                <Feather
                name="dollar-sign"
                size={20}
                style={styles.dollar}
                color="black"
              />
                <Text style={styles.vendor} >
                 {data.item.bill}
                </Text>
                </View>
                <View style = {styles.serviceView}>
                <Image
            source={{ uri : data.item.image }  }
            style={{ width: 30, height: 30 , marginTop : "-2%"  }} />
                <Text style={styles.service} >
                 {data.item.service}
                </Text>
                </View>
                <View style = {styles.bottomButtons} >
                <TouchableOpacity
                    onPress={() => rejectHandler(data.item.key)}
                    style ={[
                        styles.rejectButton, {
                            borderColor: 'red',
                            borderWidth: 1,
                            marginTop: 15
                }]}>
                    <Text style={[styles.rejectText, {
                        color: 'red'
                    }]}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => acceptHandler(data.item.key)}
                    style ={[
                        styles.rejectButton, {
                            borderColor: 'green',
                            backgroundColor: "green",
                            borderWidth: 1,
                            marginTop: 15
                }]}>
                    <Text style={[styles.rejectText, {
                        color: 'white'
                    }]}>Accept</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>

            );
      };

      const renderItem = (data, rowMap) => {
        return (
          <VisibleItem data={data} />
        );
      };
      const renderHiddenItem = (data, rowMap) => {
        return (
            <View></View>
          );
      };

    return (
        <View style={styles.container} marginTop={10}>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title= {AlertTitle}
          message= {AlertMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          //showCancelButton={true}
          showConfirmButton={true}
          //cancelText="No, cancel"
          confirmText="Ok"
          confirmButtonColor="#185d98"
          //onCancelPressed={hideAlert}
          onConfirmPressed={hideAlert}
        />
        <Modal
        animationType="none"
        transparent={true}
        visible={getModal}
        onRequestClose={() => {
        setModal(false);
        }}>
        <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
            {status == false ? (
            <Text>Please Wait... fetching Data </Text>
            ) : (
            <Text>Updating Services</Text>
            )}

            <ActivityIndicator size="small" color="#0000ff" />
        </View>
        </View>
        </Modal>
        {items ?
        <View>
        <StatusBar barStyle="dark-content"/>
        <SwipeListView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
          data={listData}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
          disableLeftSwipe
        />
        </View> :
        <View>
        <Text style = {styles.noRequests} > No Recent Requests. </Text>
        <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        >
        </ScrollView>
        </View>
        }
        </View>
      );
};


export default ServicesRequests;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        flex: 1,
      },
    save : {
        marginLeft : "auto",
        marginTop : "-7%"
    },
  backTextWhite: {
    color: '#FFF',
  },
  vendorView : {
    flexDirection : 'row',
    marginLeft : "7%",
    marginTop :  "5%"
  },
  detailsView : {
      flexDirection : 'row',
      marginLeft : "7%",
      marginTop : "-60%",
      width : "70%",
  },
  serviceView : {
    flexDirection : 'row',
    marginLeft : "7%",
    marginTop : "5%",
    width : "70%",
  },
  noRequests : {
    fontSize : 25, 
    color : "#185d98",
    marginTop : "40%"

  },
  noRequestsView : {
    alignItems : 'center',
    justifyContent : 'center'
  },
textSign: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: '4%',
    fontSize : 22,
},
  rowFront: {
    //backgroundColor: '#FFF',
    borderRadius: 5,
    height: "60%",
    margin: 5,
    marginBottom: 15,
    //borderBottomWidth: 1,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: 350 , height: 250
  },
  checkItem : {
    backgroundColor : "#dfa900",
    marginLeft : "auto",
    width : "45%",
    justifyContent : "center",
    alignItems : "center"
    //marginTop : '-1%'
    //marginLeft : '-3%',
    },
  rowFrontVisible: {
    //backgroundColor: '#FFF',
    borderRadius: 5,
    height: "80%",
    padding: 10,
    marginBottom: 15,
    width: 350 , height: 250
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
  rejectButton: {
    width: '40%',
    height: 50,
    marginLeft : '3%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
},
  rejectText: {
    fontSize: 18,
    fontWeight: 'bold'
},
bottomButtons : {
  flexDirection : 'row',
  alignItems: 'center',
  justifyContent: 'center'
},
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  dollar: {
    height: 25,
    width: 25,
    marginLeft: "20%",
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: "5%",
    //marginRight : "50%",
    color: '#36586f'
  },
  details: {
    fontSize: 12,
  //  fontWeight: 'bold',
    //marginBottom: "10%",
    color: '#36586f',
   // marginLeft: 10
  }
});