import 'react-native-gesture-handler';
import React , {useState , useEffect , useRef} from 'react';
import {
  Modal , AppState, ActivityIndicator , StyleSheet, Image,  TouchableOpacity ,  SafeAreaView, Button, View , Dimensions, Alert , RefreshControl  , ScrollView 
 } from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple
} from 'react-native-paper';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-community/async-storage';
import MapView from 'react-native-maps';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import {config} from '../constants';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen({navigation}) {

  const [location, setLocation] = useState(null);
  //const [errorMsg, setErrorMsg] = useState(null);
  const [isLocation, setIsLocation] = useState(null);
  const[address , setAddress] = useState(null);
  const [serviceName, setServiceName] = useState(null);
  const[user, setUser] = useState(null);
  const[price, setPrice] = useState(null);
  const[id, setId] = useState(null);
  const[car, setCar] = useState(null);
  const [image , setImage] = useState(null);
  const[show,setShow] = useState(false);
  const [color,serColor] = useState(null);

    const [getModal, setModal] = useState(false);
    const [message , setMessage] = useState('Please Wait');
    const [status, setStatus] =useState(false);


    const [checked, setChecked] = useState(false);
  //const[car , car]

  const [refreshing, setRefreshing] = React.useState(false);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notTitle , setNotTitle ] = useState("Custom Notification");

  const [mapShowed , setMapShow] = useState(false);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);



  useEffect(() => {
    async function UpdateUI() {
  //      var newAppointments = [];
      var auth;
        try{
          auth = await AsyncStorage.getItem('userToken');
          console.log(` AUTH${auth}`);
        }catch(e){
          console.log(e.message);
          console.log("Error getting auth");
        }
        try {
          const response = await fetch(`${config.Api_Url}/getAllRequests`, {
            method: "GET",
            headers: {
              Authorization : 'Bearer ' + auth,
            }
          });
          const responseData = await response.json();
         // const appointments = responseData.appointments;
          const status = await response.status;
          console.log(`Status Code : ${status}`);
          console.log(responseData);
          var data = responseData.data;
          var newRequest = [];
          if(status == 200)
          {
            var i;
            for(i =0 ; i < data.length ; i++){
              if(responseData.data[i].longitude > 0 && responseData.data[i].latitude > 0 ){
              console.log(`Long : ${responseData.data[i].longitude}`);
              console.log(`Lati : ${responseData.data[i].latitude}`);
              var longLat = {
                latitude : parseFloat((responseData.data[i].latitude)),
                longitude : parseFloat((responseData.data[i].longitude))
              }
              var address;
              await (Location.reverseGeocodeAsync(longLat)).then((location) => {
                  console.log("Location")
                  console.log(location);
                  const loc = location[0];
                  console.log(` Country :  ${location[0].country}`);
                  address = `${loc.street} , ${loc.subregion} , ${loc.country} , ${loc.region} `;
                  setAddress(address);
                });
            }else{
              address = "Invalid Address"
            }
            var request = {
              id : data[i].id,
              serviceName : data[i].service.name,
              user : data[i].name,
              address,
              price : data[i].service.price,
              car : data[i].vehicle.name,
              service : data[i].service.name,
              image : data[i].vehicle.color_id.model.vehicle_company.icon,
              color : data[i].vehicle.color_id.name
            }
           newRequest.push(request);
            }
          }else{
            Alert.alert("Error Fetching Data.");
          }
          if(newRequest.length > 0){
            setShow(true);
            var max = 0;
            var index;
            for(i =0; i < newRequest.length ; i ++){
              if(max < newRequest[i].id){
                max = newRequest[i].id;
                index = i;
              }
              }
              console.log(index);
              setId(newRequest[index].id);
              setServiceName(newRequest[index].serviceName);
              setUser(newRequest[index].user);
              setPrice(newRequest[index].price);
              setAddress(address);
              setCar(newRequest[index].car);
              serColor(newRequest[index].color)
              setImage(newRequest[index].image);
          }
           }catch(e) {
            console.log(e);
           // Alert.alert(`Error : ${e.message} ` );
      }
        }
        UpdateUI();
    }, []);


  useEffect(() => {
    (async () => {
      const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
      try{
      if (status === 'granted') {
        console.log("test");
      let location = await Location.getCurrentPositionAsync({});
      console.log(` Location Is`);
      console.log(location)
      setLocation(location);
      setIsLocation(true);
      } else {
        console.log("ERROR MESSAGE");
        setErrorMsg('Permission to access location was denied');
        throw new Error('Location permission not granted');
      }
    }catch(e){
      console.log(e.message);
    }
    })();
  }, []);

      useEffect(()=>{
      const interval = setInterval(async () => {
      console.log("IN NEW REW");
      checkNewData();
    }, 8000);
    });

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });

        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);
      useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);

        return () => {
          AppState.removeEventListener('change', _handleAppStateChange);
        };
      }, []);


      const _handleAppStateChange = (nextAppState) => {
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState', appState.current);
      };


      const checkNewData = async () =>{
        var auth;
        try{
          auth = await AsyncStorage.getItem('userToken');
        //  console.log(` AUTH${auth}`);
        }catch(e){
          console.log(e.message);
          console.log("Error getting auth");
        }
        try {
          const response = await fetch(`${config.Api_Url}/getAllRequests`, {
            method: "GET",
            headers: {
              Authorization : 'Bearer ' + auth,
            }
          });
          const responseData = await response.json();
          const status = await response.status;
          var data = responseData.data;
          var newRequest = [];
          if(status == 200)
          {
            var i;
            if(data.length < 0){
              setShow(false);
              return;
            }
            for(i =0 ; i < data.length ; i++){
              if((parseFloat(responseData.data[i].latitude) > 0) && (parseFloat(data[0].longitude)) > 0 ){
              var longLat = {
                latitude : parseFloat((responseData.data[i].latitude)),
                longitude : parseFloat((responseData.data[i].longitude))
              }
             var address ;
              console.log("APP STATE");
              console.log(appState.current);
              if(appState.current == "active"){
                console.log(`APPP STATE ${appState.current}`);
                await (Location.reverseGeocodeAsync(longLat)).then((location) => {
                  console.log("Location")
                  console.log(location);
                  const loc = location[0];
                  console.log(` Country :  ${location[0].country}`);
                  address = `${loc.street} , ${loc.subregion} , ${loc.country} , ${loc.region} `;
                  setAddress(address);
                });
              }else{
                address = "Waiting for address";
              }
            }else{
              address = "Invalid Address"
            }
            var request = {
              id : data[i].id,
              serviceName : data[i].service.name,
              user : data[i].name,
              address,
              price : data[i].service.price,
              car : data[i].vehicle.color_id.model.name,
              service : data[i].service.name,
              image : data[i].vehicle.color_id.model.vehicle_company.icon,
              color : data[i].vehicle.color_id.name
            }
           newRequest.push(request);
            }
          }else{
          }
          if(newRequest.length > 0){
            setShow(true);
            var max = 0;
            var index;
            for(i =0; i < newRequest.length ; i ++){
              if(max < newRequest[i].id){
                console.log(`Max ${max}`);
                max = newRequest[i].id;
                index = i;
              }
              }
              let requestID;
              try {
                requestID = await AsyncStorage.getItem('requestID');
              } catch(e) {
                console.log(e);
              }
              if((newRequest[index].id).toString() == requestID  ){
                console.log("Not To update");
              }else{
                console.log("Needs to update");
                console.log(index);
                await sendPushNotification(expoPushToken);
                setId(newRequest[index].id);
                setServiceName(newRequest[index].serviceName);
                setUser(newRequest[index].user);
                setPrice(newRequest[index].price);
                setAddress(address);
                setCar(newRequest[index].car);
                serColor(newRequest[index].color)
                setImage(newRequest[index].image);
                await sendPushNotification(expoPushToken);
               try {
                await AsyncStorage.setItem('requestID', (newRequest[index].id).toString()); 
               } catch(e) {
                 console.log(e);
               }
              }
          }else{
            console.log("NO DATA");
          }
      }catch(e) {
            console.log(e);
      }
      }


  const rejectHandler = async ()=>{

  var auth;
  try{
    auth = await AsyncStorage.getItem('userToken');
    console.log(` AUTH${auth}`);
  }catch(e){
    console.log(e.message);
    console.log("Error getting auth");
  }
try{
setMessage("Rejecting Request ! Please Wait");
setModal(true);
const response = await fetch(`${config.Api_Url}/RejectVendorServiceRequest/${id}`, {
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
if(status == 200){
Alert.alert("Service Rejected");
setChecked(!checked);
}
}catch(e){
Alert.alert("Error Rejecting Service");
}
}

  const acceptHandler = async () =>{
    var auth;
        try{
          auth = await AsyncStorage.getItem('userToken');
          console.log(` AUTH${auth}`);
        }catch(e){
          console.log(e.message);
          console.log("Error getting auth");
        }
        console.log(`${config.Api_Url}/AcceptVendorServiceRequest/${id}`);
    try{
      const response = await fetch(`${config.Api_Url}/AcceptVendorServiceRequest/${id}`, {
        method: "GET",
        headers: {
          Authorization : 'Bearer ' + auth ,
        }
      });
      const responseData = await response.json();
      const status = await responseData.status;
      console.log(`Status Code : ${status}`);
      console.log(responseData);
    if(status == 200){
      Alert.alert("Service Accepted");
    }
    }catch(e){
      Alert.alert("Error Accepting Request! Please Try Again Later");
    }
  }

  const ChangeHandler = async (val)=>{
    console.log("Test");
    console.log(val);
    var address;
    var auth;
        try{
          auth = await AsyncStorage.getItem('userToken');
          console.log(` AUTH${auth}`);
        }catch(e){
          console.log(e.message);
          console.log("Error getting auth");
        }
    await (Location.reverseGeocodeAsync(val)).then((location) => {
      console.log(location);
      const loc = location[0];
      address = `${loc.street} , ${loc.subregion} , ${loc.country} , ${loc.region} `;
      console.log(`Address ${address}`);
    } );
    var long = val.longitude;
    var lat = val.latitude;
    var id = await AsyncStorage.getItem('id');
    console.log(` ${id} , ${long}, ${lat} , ${address}`);
    try{
      const link = `${config.Api_Url}/setVendorLocation/${id}/${lat}/${long}/${address}`;
        console.log(link);
        const responseData = await fetch(link, {
          method: "GET",
            headers: {
              Authorization : `Bearer ${auth}`,
          }
        });
       const response = await responseData.json();
        const status = await response.status;
        console.log(response);
        console.log(status);
        if(status==200){
          Alert.alert("Location Saved!");
        }
    }catch(message){
      console.log(message);
    }
  }

  if(show){
    return (
      <View style={styles.container}>
        { isLocation ?
         <MapView style={styles.map}
          loadingEnabled = {true}
          region = {{
            longitude : location.coords.longitude,
            latitude : location.coords.latitude,
            latitudeDelta : 0.221,
            longitudeDelta : 0.121
          }}
          >
          <MapView.Marker
          coordinate = {
            {
            longitude : location.coords.longitude,
            latitude : location.coords.latitude,
            }
          }
          title = {"Your Location"}
          description = {"Long Press To Change Location"}
          draggable = {true}
          onDragEnd = { (e) => ChangeHandler(e.nativeEvent.coordinate) }
          >
          </MapView.Marker>
        </MapView> : <Text> Loading Maps </Text>
      }
      <View style = {styles.bottomView} >
        <Text style = {styles.serviceTitle} > New Service Request </Text>
      </View>
      <Text style = {styles.serviceName} >{serviceName} </Text>
      <View style = {styles.detailsView}>
              <View style =  {{flexDirection : 'row'}} >
              <EvilIcons
                  name="user"
                  size={30}
                  style={styles.trash}
                  color="black"
                />
                  <Text style={styles.service} >
                   {user}
          </Text>
          <Feather
                  name="dollar-sign"
                  size={20}
                  style={styles.dollar}
                  color="black"
                />
                <Text style={styles.vendor} >
                   {`${price}$`}
                  </Text>
          </View>
        </View>
        <View style = {styles.detailsView} >
            <Image
              source={{ uri : image }  }
              style={{ width: 30, height: 30 }} />
              <Text style = {{marginLeft: "3%" , marginTop: "3%"}} > {`${color} ${car} `} </Text>
            </View>
              <View style = {styles.detailsView} >
              <Entypo
                  name="location-pin"
                  size={25}
                  style={styles.trash}
                  color="black"
              />
            <Text style = {{marginLeft: "3%" , marginTop: "3%"}} > {address}</Text>
          </View>
          <View style = {styles.bottomButtons} >
                  <TouchableOpacity
                      onPress={rejectHandler}
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
                      onPress={acceptHandler}
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
    );
  }else{
    return (
      <View style={styles.container}>
        { isLocation ?
         <MapView style={styles.map}
        loadingEnabled = {true}
        region = {{
          longitude : location.coords.longitude,
          latitude : location.coords.latitude,
          latitudeDelta : 0.221,
          longitudeDelta : 0.121
        }}
        >
        <MapView.Marker
        coordinate = {
          {
          longitude : location.coords.longitude,
          latitude : location.coords.latitude,
          }
        }
        title = {"Your Location"}
        description = {"Long Press To Change Location"}
        draggable = {true}
        onDragEnd = { (e) => ChangeHandler(e.nativeEvent.coordinate) }
        >
        </MapView.Marker>
        </MapView> : <Text> Loading Maps </Text>
      }
     </View>
    );
  }
}


// Can use this function below, OR use Expo's Push Notification Tool- https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: "Request Notification",
    body: 'New Service Request Received!',
    data: { someData: 'goes here' },
    android: {
      channelId: 'chat-messages',
    },
  };
  try{
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
 }catch(e){
  }

}


async function registerForPushNotificationsAsync() {
  let token;
  try{
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('chat-messages', {
      name: 'Chat messages',
      sound : true,
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}catch(e){
}
  return token;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  //  alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    marginTop : "-40%",
    width: Dimensions.get('window').width,
    height: ( Dimensions.get('window').height/2 )
  },
  backTextWhite: {
    color: '#FFF',
  },
  bottomView : {
    marginTop : "2%",
    width : "90%",
  },
  serviceName : {
    marginTop :"2%",
    marginLeft : "4%",
    fontSize : 16,
    fontWeight : "bold"
  },
  service : {
    marginLeft : "3%"
  },
  serviceTitle: {
    color : "#185d98",
    fontSize : 25,
    marginLeft : "3%",
    paddingBottom : "2%",
    borderBottomWidth : 1,
    borderBottomColor : "#185d98"
  },
  vendorView : {
    flexDirection : 'row',
    marginLeft : "7%",
    marginTop :  "5%"
  },
  vendor  : {
//    marginLeft : "19%"

  },
  detailsView : {
      flexDirection : 'row',
     // marginLeft : "7%",
      marginTop : "2%",
      marginLeft : "3%",
      paddingBottom : "2%",
      borderBottomWidth : 1,
      borderBottomColor : "#185d98",
      width : "90%",
      // alignItems : 'center',
      // justifyContent : 'center'
  },
  serviceView : {
    flexDirection : 'row',
    marginLeft : "7%",
    marginTop : "5%",
    width : "70%",
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
    //height: "80%",
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