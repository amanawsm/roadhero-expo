import React , {useState} from 'react';
import {Modal , ActivityIndicator , Alert,  TouchableOpacity , ImageBackground, StyleSheet, Text, View , TextInput , Image } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';


import { AuthContext } from '../components/context';
import {config} from '../constants';

const image = '../images/road.jpg';

const OTPScreen = ({navigation}) => {
    const { signIn } = React.useContext(AuthContext);
    const[otp , setOTP] = useState(null);
    const[phone,setPhone] = useState(null);
    const [getModal, setModal] = useState(false);
    const [status, setStatus] =useState(true);
    // const [data, setData] = React.useState({
    //     email: '',
    //     name : '',
    //     password: '',
    //     confirm_password: '',
    //     role : 'Patient',
    //     check_emailInputChange: false,
    //     check_nameInputChange: false,
    //     secureTextEntry: true,
    //     confirm_secureTextEntry: true
    // });

    const otpChange = (val)=>{
        console.log(val);
        setOTP(val);
    }
    const ResendOtp = async () =>{
      var ph;
      try {
           ph = (await AsyncStorage.getItem('phone'));
           console.log(`Phone ${ph}`);
        } catch(e) {
          console.log(e);
        }
        try{
          const link = `${config.Api_Url}/verifyPhone/${ph}`;
          console.log(link);
          const responseData = await fetch(link, {
              method: "GET",
              headers: {
              "Content-Type": "application/json",
              }
          });
          setModal(false);
          const responsePhone = await responseData.json();
          const status = await responseData.status;
          console.log(status);
          console.log(responsePhone);
          if(status == 200){
              Alert.alert(`A 4 digit verification code sent to ${ph} Enter To Verify `);
        }else{
          Alert("Error Sending OTP");
        }

    }catch(message){
      console.log(message);
      Alert.alert("Something Went Wrong.")
    }
  }

    const OTPHandler  = async () => {
        var ph;
        try {
             ph = (await AsyncStorage.getItem('phone'));
             console.log(`Phone ${ph}`);
          } catch(e) {
            console.log(e);
          }
        try {
            setStatus(false);
            setModal(true);
            console.log(otp);
            console.log(ph);
            const link = `${config.Api_Url}/verifyCode/${ph}/${otp}`;
            console.log(link);
            const responseData = await fetch(link, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            });
            setModal(false);
            setStatus(true);
            const responsePhone = await responseData.json();
            const statusPhone = await responsePhone.status;
            console.log(statusPhone);
            console.log(responsePhone);
            if(statusPhone == 200){
                Alert.alert("Verified OTP");
                // setCheck(false);
            }else{
              Alert.alert(responsePhone.message);
                Alert("Something Went Wrong TRy Again");
            }
            }catch(err){
              Alert.alert("Invalid OTP");
              console.log("Error");
                console.log(err);
                console.log(err.message);
            }
    }

    const confirm_updateSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }
    return (
  <View style={styles.container}>
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
            <Text>Please Wait... Sending Your Data </Text>
            ) : (
            <Text>Data Is Coming</Text>
            )}

            <ActivityIndicator size="small" color="#0000ff" />
        </View>
        </View>
        </Modal>
      <View>
      <Text style = {styles.caption} > Enter OTP </Text>
    <TextInput
        placeholder="OTP"
        style={styles.nextInput}
        autoCapitalize="none"
        onChangeText={otpChange}
     //   value={data.name}
    />
    <TouchableOpacity style={styles.LogInButton}
    onPress= {OTPHandler}
     >
            <Text style={styles.textSign} > Submit </Text>
    </TouchableOpacity>
    <View style = {styles.bottomView} >
    <Text style = {styles.end} > Did Not Receive OTP? </Text>
    <TouchableOpacity
    onPress={ResendOtp}
     >
        <View>
            <Text style = {styles.signUpText} >Resend Now</Text>
        </View>
    </TouchableOpacity>
    </View>
  </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  NameView : {
    flex: 1,
    flexDirection: 'row',
  },
  textInput: {
    marginLeft : "2%",
    marginTop: "8%",
    paddingLeft: 10,
    borderBottomWidth : 1,
    borderBottomColor : "#185d98",
    width : "40%"
   // color: '#05375a',
},
lastInput : {
    marginLeft : "50%",
    marginTop: "-8%",
    paddingLeft: 10,
    borderBottomWidth : 1,
    borderBottomColor : "#185d98",
    width : "40%"
},
bottomView : {
    flexDirection: 'row',
    marginTop : "3%",
    justifyContent: 'center',
    alignItems: 'center'
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
passwordInput : {
    marginLeft : "2%",
    marginTop: "10%",
    paddingLeft: 10,
    borderBottomWidth : 1,
    borderBottomColor : "#185d98",
    width : "90%"
},
feather : {
    marginLeft : "87%",
    marginTop : "-6%"
},
nextInput: {
    marginLeft : "2%",
    marginTop: "10%",
    paddingLeft: 10,
    borderBottomWidth : 1,
    borderBottomColor : "#185d98",
    width : "90%"
   // color: '#05375a',
},

  image: {
     flex: 1,
    resizeMode: 'cover',
    // justifyContent: 'center',
  },
  button: {
    alignItems: 'flex-end',
    marginTop: '5%'
},
LogInButton  : {
    alignItems: 'center',
    width: '40%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: '25%',
    marginLeft : '28%',
    marginBottom : "4%",
    backgroundColor: '#185d98'
},
signIn: {
    width: '57%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginRight : "-7%",
},
textSign: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: '4%',
    fontSize : 22,
},

  title: {
    color: '#EEB462',
    fontSize: 42,
    fontWeight: 'bold',
    marginTop : '30%',
     textAlign: 'center',
    // backgroundColor: '#000000a0',
  },
  caption:{
    color: 'black',
    fontSize: 22,
   // fontWeight: 'bold',
     marginTop : '6%',
    fontWeight: 'bold',
    marginLeft : "2%",
     // textAlign: 'center',
  },
  end : {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
    //fontWeight: 'bold',
   // marginLeft : "8%",
  //  marginTop : "-6%"
  },
  signUpText: {
    //color: 'black',
    fontSize: 15,
    color : "#185d98",
    //fontWeight: 'bold',
    marginLeft : "2%",
    marginTop : "-2%"
     // textAlign: 'center',
  },
   or:{
    color: 'white',
    fontSize: 22,
    marginTop : '-12%',
    marginBottom: '3%',
    marginLeft : "30%",
   // fontWeight: 'bold',
     textAlign: 'center',
  }
});

export default OTPScreen;
