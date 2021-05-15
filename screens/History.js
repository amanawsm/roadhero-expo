import React, {useState, useEffect} from 'react';
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
  RefreshControl, 
  ScrollView
} from 'react-native';

import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Location from 'expo-location';

import AwesomeAlert from 'react-native-awesome-alerts';


import AsyncStorage from '@react-native-community/async-storage';
import {config} from '../constants';

const History = () => {
    const [checked, setChecked] = React.useState(false);

    const [listData, setListData] = useState(null);

    const [getAddress , setAddress] = useState("");

    const [getModal, setModal] = useState(false);
    const [status, setStatus] =useState(false);

    const[refresh, setRefresh] = useState(false);

    const [items , setItems] = useState(true);

    const [refreshing, setRefreshing] = React.useState(false);

    const[showAlert , setShowAlert] = useState(false);

    const [secondButton , setSecondButton] = useState(false);

    const[AlertTitle, setAlertTitle ] = useState("Confirmation Alert");
    const[AlertMessage, setAlertMessage ] = useState("Custom Message");
    const[confirmationText, setConfirmationText] = useState("Ok");

    const[update , setUpdate] = useState(false);

    const hideAlert = () =>{
      console.log("HIDE");
      setShowAlert(false);
    }
    const cancelAlert = () =>{
      setUpdate(false);
      console.log("HIDE");
    }



    const onRefresh = React.useCallback(() => {
      console.log("Refresh");
      setShowAlert(false);
      setSecondButton(false);
      setAlertTitle("Confirmation Alert");
      setAlertMessage("Custom Message");
      setConfirmationText("Ok");
      setUpdate(true);
     // setRefresh(!refresh);
      console.log(refresh);
      Update();
    }, []);

    const Update = async ()=>{
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
          const response = await fetch(`${config.Api_Url}/getServiceHistory`, {
            method: "GET",
            headers: {
              Authorization : 'Bearer ' + auth,
            }
          });
          setModal(false);
          const responseData = await response.json();
          const status = await responseData.status;
          console.log(`Status Code : ${status}`);
        var newHistory = [];
          console.log("CHECK TRUE FALSE");
          if(status == 200)
          {
            var data = responseData.data;
            if(data.length < 1){
              setItems(true);
              return;
            }
            var i;
            for(i =0 ; i < data.length ; i++){
              if((parseFloat(responseData.data[i].request_id.latitude) > 0) && (parseFloat(data[i].request_id.longitude) > 0) ){
              var longLat = {
                latitude : parseFloat((responseData.data[i].request_id.latitude)),
                longitude : parseFloat((responseData.data[i].request_id.longitude))
              }
              var address;
              await (Location.reverseGeocodeAsync(longLat)).then((location) => {
                console.log("Location")
                console.log(location);
                const loc = location[0];
                console.log(` Country :  ${location[0].country}`);
                address = `${loc.street} , ${loc.subregion} , ${loc.country} , ${loc.region} `;
              });
            }else{
              address = "Invalid Address";
            }
              const date = data[i].request_id.service.updated_at;
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
              const time = `${dateF.getHours()}:${dateF.getMinutes()}`
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
              var history = {
                  id : data[i].request_id.id,
                  vendor : data[i].request_id.name,
                  address,
                  bill : data[i].request_id.service.price,
                  service : data[i].request_id.service.name,
                  image : data[i].request_id.service.image,
                  status : data[i].service_status,
                  rating : data[i].rating,
                  date : dateStr
                }
              newHistory.push(history);
            }
          }
          else if(status == 400){
            setShowAlert(true);
            setAlertTitle("Information Message");
            setConfirmationText("Ok");
            setAlertMessage(`${responseData.message}`);
            if(update){
              console.log("UPDATE THE SSS");
              setUpdate(false);
            }
            setItems(false);
          }
          else{
            setShowAlert(true);
            setAlertTitle("Information Message");
            setConfirmationText("Ok");
            setAlertMessage("Error Getting Data. Something Went Wrong");
          }
        console.log(newHistory);
        setListData(
              newHistory.map((history, index) =>
              ({
                  key: `${index}`,
                  id : history.id,
                  vendor : history.vendor,
                  address : history.address ,
                  bill : history.bill,
                  service : history.service,
                  image : history.image,
                  status : history.status,
                  rating : history.rating,
                  date : history.date
            })));
          console.log(listData);
      }catch(e) {
            console.log(e);
            setShowAlert(true);
            setConfirmationText("Ok");
            setAlertTitle("Error Message");
            setAlertMessage(`Unexpected Error Occur. Refresh your application`);
         //   Alert.alert(`Error : ${e.message} ` );
      }
    }


    useEffect(() => {
      async function UpdateUI() {
        Update()
      }
          UpdateUI();
      }, [refresh]);

      const updateHandler =  async (k) =>{
        const AsyncAlert = async () => new Promise((resolve) => {
          Alert.alert(
            "Confirmation",
            "Have you completely your service??",
            [
              {
                text: "Yes",
                onPress: () => {
                setUpdate(true);
                console.log(`UPDATE ${update}`);
                  //console.log("Ask me later pressed");
                resolve('YES');
              }
              },
              {
                text: "No",
                onPress: () => {
                   console.log("Cancel Pressed")
                   resolve('YES');
                  },
                style: "cancel"
              }
            ]
          );
          console.log(` UPDATS IS  ${update}`);
        });

        await AsyncAlert();


        console.log(`Update is ${update}`);
        if(update){
          var auth;
        try{
          auth = await AsyncStorage.getItem('userToken');
          console.log(` AUTH${auth}`);
        }catch(e){
          console.log(e.message);
          console.log("Error getting auth");
        }
        setSecondButton(false);
        listData.map( async (history)=>{
          if(history.key == k){
            console.log(`History ID :  ${history.id}`);
            try{
              setStatus(true);
              setModal(true);
              const response = await fetch(`${config.Api_Url}/updateVendorServiceRequest/${history.id}`, {
                method: "GET",
                headers: {
                  Authorization : 'Bearer ' + auth ,
                }
              });
              setStatus(false);
              setModal(false);
              const responseData = await response.json();
              const status = await response.status;
              console.log(`Status Code : ${status}`);
            if(status == 200){
              setShowAlert(true);
              setAlertTitle("Confirmation Message");
              setAlertMessage("Service Completed Successfully");
              setListData(null);
              setRefresh(!refresh);
            }
            }catch(message){
            }
          }
        })
        console.log(`Key is ${k}`);
        }
        setUpdate(false);

      }


      const VisibleItem =  props => {
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
                   {/* <Avatar.Image
                      source={{uri : data.item.image}}
                      size={60}
                  /> */}
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
                 { data.item.bill ?
                 `${data.item.bill} $` : `0.00 $`
                 }
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
                <View style = {styles.bottomActions} >
                { data.item.status ?
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={20}
                  style={styles.status}
                  color="#185d98"
                /> :
                <MaterialCommunityIcons
                  name="cancel"
                  size={20}
                  style={styles.status}
                  color="#185d98"
                />
                }
                <Text> { 
                data.item.status ? "Completed" : "Pending"
                } </Text>
                { data.item.rating == 5 ?
                <View style = {{marginLeft: "35%"}} >
                <MaterialCommunityIcons
                  name="star"
                  size={20}
                  style={styles.status}
                  color="#185d98"
                />
                </View> :
                <View style = {{marginLeft: "35%"}} >
                <MaterialCommunityIcons style = {styles.rating}
                name="star-half-full"
                size={20}
                style={styles.status}
                color="#185d98"
              />
              </View>
                } 
                  <Text > { data.item.rating ?  data.item.rating : "Not Rated" } </Text>
                </View>
                {console.log(`Status :  ${data.item.status}`)}
                { data.item.status ? null :
                <View style = {styles.bottomButtons} >
                <TouchableOpacity
                    onPress={() => updateHandler(data.item.key)}
                    style ={[
                        styles.rejectButton, {
                            borderColor: '#185d98',
                            backgroundColor: "#185d98",
                            borderWidth: 1,
                            marginTop: 15
                }]}>
                    <Text style={[styles.rejectText, {
                        color: 'white'
                    }]}>Update</Text>
                </TouchableOpacity>
                </View> 
            } 
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
          showCancelButton={secondButton}
          showConfirmButton={true}
          cancelText="No"
          confirmText= {confirmationText}
          confirmButtonColor="#185d98"
          onCancelPressed={ () =>{ setUpdate(false)}}
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
                   <TouchableOpacity style = {styles.save} >
                   <Text onPress = {()=> {console.log("Update")} } > Save  </Text>
                   </TouchableOpacity>
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
                   <View style = {styles.noRequestsView}  >
                   <Text style = {styles.noRequests} > No History Available. </Text>
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


export default History;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        flex: 1,
      },
      text_header: {
        marginBottom: 20,
        color: '#36586f',
        fontWeight: 'bold',
        fontSize: 30
    },
    save : {
        marginLeft : "auto",
        marginTop : "-7%"
    },
  backTextWhite: {
    color: '#FFF',
  },
  noRequests : {
    fontSize : 25, 
    color : "#185d98",
    marginTop : "50%"
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
bottomButtons : {
  marginTop : "-4%",
  flexDirection : 'row',
  alignItems: 'center',
  justifyContent: 'center'
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
LogInButton  : {
    alignItems: 'center',
},
LogIn: {
    width: '60%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: '25%',
   // marginRight : "-7%",
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
    width: 350 , height: 280
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
bottomActions : {
  flexDirection : 'row',
  marginLeft : "7%",
  marginTop : "5%",
  // alignItems: 'center',
  // justifyContent: 'center'
},
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
    width: 350, height: 250
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#a8c4c7',
    right: 74,
  },
  backRightBtnRight: {
    backgroundColor: '#c79840',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
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
  status : {
    height: 25,
    width: 25,
    //marginRight: 7,
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
  },
  time: {
    fontSize: 13,
    color: '#999',
  },
  patientTitle:{
      fontSize: 14,
      color: '#999',
  },
  patientTitle:{
    fontSize: 14,
    color: '#999',
  },
  patientDetails:{
    fontSize: 14,
    color: '#36586f',
  },
});