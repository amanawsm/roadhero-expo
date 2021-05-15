import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert, 
  Modal,
  ActivityIndicator
} from 'react-native';

import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox } from 'react-native-paper';

import AwesomeAlert from 'react-native-awesome-alerts';


import AsyncStorage from '@react-native-community/async-storage';
import {config} from '../constants';

const OfferedServicesScreen = () => {
    const [checked, setChecked] = React.useState(false);
    const [prevList , setPrevList] = React.useState(null);
    const [listData, setListData] = useState(null);
    const [getModal, setModal] = useState(false);
    const [status, setStatus] =useState(false);

    const[showAlert , setShowAlert] = useState(false);
    const[AlertTitle, setAlertTitle ] = useState("Confirmation Alert");
    const[AlertMessage, setAlertMessage ] = useState("Custom Message");

    const hideAlert = () =>{
      console.log("HIDE");
      setShowAlert(false);
    }
  const[refresh , setRefresh] = useState(null);


    const updateServices = async ()=>{
        var i;
        var ids = "";
        for(i = 0 ; i < listData.length ; i++){
            if(listData[i].status){
                ids = `${listData[i].id},${ids}`;
            }
        }
        const len = ids.length;
        const newIDs = ids.slice(0,len-1);
        var auth;
        try{
          auth = await AsyncStorage.getItem('userToken');
          console.log(` AUTH${auth}`);
        }catch(e){
          console.log(e.message);
          console.log("Error getting auth");
        }
        try{
            setStatus(true);
            setModal(true);
            const response = await fetch(`${config.Api_Url}/updateVendorServices`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization : 'Bearer ' + auth,
              },
              body: JSON.stringify({
                service_ids : newIDs,
              }),
            });
            const status = await response.status;
            console.log(`Status Code : ${status}`);
           setModal(false);
           setStatus(true);
          if(status == 200){
            setShowAlert(true);
            setAlertTitle("Confirmation Message");
            setAlertMessage("Your Services are updated successfully!");
            setListData(null);
            setRefresh(!refresh);
          }
          }catch(message){
            Alert.alert(message.message);
          }
    }
      useEffect(() => {
        async function UpdateUI() {
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
              var newServices = [];
              if(status == 200)
              {
                var i;
                for(i =0 ; i < data.length ; i++){
                  var service = {
                      id : data[i].id,
                      title : data[i].name,
                      details : data[i].detail,
                      bill : data[i].price,
                      status : data[i].status,
                      image : data[i].image,
                      tweek : false
                    }
                    newServices.push(service);
                }
              }else{
                Alert.alert("Error Fetching Data.");
              }
            console.log(newServices);
            setListData(
                newServices.map((service, index) =>
                  ({
                      key: `${index}`,
                      id : service.id,
                      title : service.title,
                      details : service.details,
                      bill : service.bill,
                      status : service.status,
                      image : service.image,
                      tweek : service.tweek
                })));
                setPrevList(
                    newServices.map((service, index) =>
                      ({
                          key: `${index}`,
                          id : service.id,
                          title : service.title,
                          details : service.details,
                          bill : service.bill,
                          status : service.status,
                          image : service.image,
                          tweek : service.tweek
                    })));
              console.log(listData);
           //   newAppointments = [];
          }catch(e) {
                console.log(e);
                Alert.alert(`Error : ${e.message} ` );
          }
            }

            UpdateUI();
        }, [refresh]);


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
                <View flexDirection='row' >
                <Image
                source={{ uri : data.item.image }  }
                style={{ width: 30, height: 30 , marginTop : "4%" }} />
                    <View alignItems='center' >
                        <Text style={styles.name} >
                        {data.item.title}
                        </Text>
                    </View>
                    <View style = {styles.checkItem} >
                    <Checkbox
                        status={data.item.status ? 'checked' : 'unchecked'}
                        onPress={() => {
                            console.log(data.item.key);
                            console.log(listData[data.item.key].status);
                            listData[data.item.key].status = !listData[data.item.key].status;
                        setChecked(!checked);
                    }}
                    />
                    </View>
                </View>
                </TouchableHighlight>
                <View style = {styles.detailsView}>
                <Text style={styles.details} >
                 {data.item.details}
                </Text>
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

      const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
          rowMap[rowKey].closeRow();
        }
      };

      const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
      };

      const HiddenItemWithActions = props => {
          const{ swipeAnimatedValue, onClose, onDelete} = props;
          return(
            <View style={styles.rowBack}>
            <Text>Left</Text>
            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={onClose}>
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={25}
              style={styles.trash}
              color="#fff"
            />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={onDelete}>
            <Animated.View 
            style={[
                styles.trash,
                {
                  transform: [
                    {
                      scale: swipeAnimatedValue.interpolate({
                        inputRange: [-90, -45],
                        outputRange: [1, 0],
                        extrapolate: 'clamp',
                      }), },],},
              ]}>

            <MaterialCommunityIcons
              name="trash-can-outline"
              size={25}
              style={styles.trash}
              color="#fff"
            />
            </Animated.View>
            </TouchableOpacity>
        </View>
          );
      }

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
          <StatusBar barStyle="dark-content"/>
          <TouchableOpacity style = {styles.save} >
          <Text onPress = {()=> {console.log("Update")} } > Save  </Text>
          </TouchableOpacity>
          <SwipeListView
            data={listData}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-150}
            disableRightSwipe
            disableLeftSwipe
          />
          <View style = {styles.bottomButtons} >
                <TouchableOpacity 
                    onPress={() => updateServices()}
                    style ={[
                        styles.rejectButton, {
                            borderColor: '#185d98',
                            backgroundColor: "#185d98",
                            borderWidth: 1,
                            marginTop: 15
                }]}>
                    <Text style={[styles.rejectText, {
                        color: 'white'
                    }]}>Done</Text>
                </TouchableOpacity>
                </View>
        </View>
      );
};

export default OfferedServicesScreen;

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
        elevation: 3,
       // position : "absolute",
        marginLeft : "auto",
        marginTop : "-7%"
    },
  backTextWhite: {
    color: '#FFF',
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
    marginBottom : "5%",
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  detailsView : {
      marginLeft : "14%",
      marginTop : "-10%",
      //marginBottom : "4%",
      width : "70%",
  },
LogInButton  : {
    alignItems: 'center',
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
    height: 70,
    margin: 5,
    marginTop: "-1%",
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    //shadowColor: '#999',
    //shadowOffset: {width: 0, height: 1},
    //shadowOpacity: 0.8,
    //shadowRadius: 2,
    //elevation: 5,
    width: 350, height: 130
  },
  checkItem : {
    marginLeft : "auto",
    marginTop : "5%"
    },
  rowFrontVisible: {
    //backgroundColor: '#FFF',
    borderRadius: 5,
    height:  "40%" ,
    padding: 10,
    marginBottom: 15,
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
    width: 350, height: 90
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: "5%",
    //marginRight : "50%",
    color: 'black'
  },
  details: {
    fontSize: 12,
  //  fontWeight: 'bold',
   // marginBottom: "15%",
    color: 'grey',
   // marginBottom: "19%"
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