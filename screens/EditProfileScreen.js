import React , {useState} from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity , Modal , ActivityIndicator , Alert ,
    ImageBackground, StyleSheet, Text, View , TextInput } from 'react-native';

import { AuthContext } from '../components/context';

import {Appbar} from 'react-native-paper';


import AsyncStorage from '@react-native-community/async-storage';
import {config} from '../constants';


const SignInScreen = ({navigation}) => {
    const { signIn } = React.useContext(AuthContext);
    const [data, setData] = React.useState({
        email: '',
        password: '',
        confirm_password: '',
        old_password : '',
        phoneNumber : '' ,
        otp : '',
        secureTextEntry: true,
        old_secureTextEntry: true,
        confirm_secureTextEntry: true
    });

    const [getModal, setModal] = useState(false);
    const [status, setStatus] =useState(true);
    const [enterPhone, setEnterPhone] =useState(false);
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }
    const loginHandler = async () => {
      console.log("IN LOGIN");
      var auth;
      try{
        auth = await AsyncStorage.getItem('userToken');
        console.log(` AUTH${auth}`);
      }catch(e){
        console.log(e.message);
        console.log("Error getting auth");
      }
      console.log(` AUTH${auth}`);
      try {
        console.log(data.password);
        console.log(data.confirm_password);
        console.log(data.password != data.confirm_password);
        if(data.password != data.confirm_password){
          Alert.alert("Password do not match. Enter same password");
          return;
        }
        setModal(true);
        console.log(`Phone${data.old_password} ${data.new_password}`)
        const link = `${config.Api_Url}/changePassword/${data.old_password}/${data.password}`;
        console.log(link);
        const responseData = await fetch(link, {
          method: "GET",
            headers: {
              Authorization : `Bearer ${auth}`,
          }
        });
        setModal(false);
        const responsePhone = await responseData.json();
        const statusPhone = await responseData.status;
        console.log(responsePhone);
        console.log(statusPhone);
        if(status == 200){
          Alert.alert(`A 4 digit verification code sent to ${data.phoneNumber} Enter To Verify `);
      setEnterPhone(true);
        }
        if(status == 500){
          Alert.alert(`Wrong Password`);
        }
        else{
          Alert.alert(`Error Updating Phone Number. ${responsePhone.message} `);
        }
      }catch(message){
        console.log(message.message);
        Alert.alert(`Error Updating Password.`);
      }
    }

    const oldPassInputChange = (val) =>{
      setData({
        ...data,
        old_password: val
    });
    }
    const newPassInputChange = (val) =>{
      setData({
        ...data,
        password: val
    });
    }
    const confirmPasswordInputChange = (val) =>{
      setData({
        ...data,
        confirm_password: val
    });
    }

    const phoneInputChange = (val) =>{
      setData({
        ...data,
        phoneNumber : val
    });
    }

    const OTPInputChange = (val) =>{
      setData({
        ...data,
        otp : val
    });
    }

    const confirm_updateChange = (val) =>{
      setData({
        ...data,
        confirm_password: val
    });
    }

    const verifyOTPHandler = async (val)=>{
      console.log("Verify OTP");
      try{
          setModal(true);
          console.log(`Phone${data.phoneNumber}`);
          console.log(`OTP${data.otp}`)
          const link = `${config.Api_Url}/verifyOTP/${data.phoneNumber}/${data.otp}`;
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
          if(status == 200){
            Alert.alert(`Verified`);
            const link = `${config.Api_Url}/UpdatePhoneNumber/${data.phoneNumber}`;
          console.log(link);
          setModal(true);
          const responseUpdate = await fetch(link, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          setModal(false);
          const response = await responseUpdate.json();
          const upStatus = await response.status;
          console.log(response);
          console.log(upStatus);
        //setEnterPhone(true);
        if(upStatus){

        }
          }else{
            Alert.alert(responsePhone.message);
          }
      }catch(message){

      }
    }

    const oldSecureTextEntry = () => {
      setData({
          ...data,
          old_secureTextEntry: !data.old_secureTextEntry
      });
  }

  const sendOTPHandler = async ()=>{
    try {
      setModal(true);
      console.log(`Phone${data.phoneNumber}`)
      const link = `${config.Api_Url}/verifyPhone/${data.phoneNumber}`;
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
      if(status == 200){
        Alert.alert(`A 4 digit verification code sent to ${data.phoneNumber} Enter To Verify `);
    setEnterPhone(true);
      }else{
        Alert.alert(`Error Sending OTP. ${responsePhone.message} `);
      }
    }catch(message){
      console.log(message.message);
      console.log(message);
      Alert.alert(`Error Sending Verification Code.`);
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
      <Appbar.Header style = {styles.header} >
      <Appbar.BackAction onPress={()=> {navigation.goBack()}} />
      <Appbar.Content title="Help"
      />
    </Appbar.Header>
             <Modal
        animationType="none"
        transparent={true}
        visible={getModal}
        onRequestClose={() => {
        setModal(false);
        }}>
        <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
        <Text>Please Wait...  </Text>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
        </View>
        </Modal>

      <View>
      <Text style = {styles.caption} > Change Password </Text>
      <TextInput
        placeholder="Enter Old Password"
        style={styles.nextInput}
        autoCapitalize="none"
        secureTextEntry={data.old_secureTextEntry ? true : false}
        onChangeText={(val) =>  oldPassInputChange(val)}
     //   value={data.name}
    />
    <TouchableOpacity style = {styles.feather} onPress={oldSecureTextEntry}>
    {data.old_secureTextEntry ?
        <Feather
            name="eye-off"
            color="#36586f"
            size={15}
        />
    :
        <Feather
            name="eye"
            color="#36586f"
            size={15}
        />
    }
    </TouchableOpacity>

    <TextInput
        placeholder="Enter New Password"
        style={styles.nextInput}
        autoCapitalize="none"
        secureTextEntry={data.secureTextEntry ? true : false}
        onChangeText={(val) =>  newPassInputChange(val)}
     //   value={data.name}
    />
    <TouchableOpacity style = {styles.feather} onPress={updateSecureTextEntry}>
    {data.secureTextEntry ?
        <Feather
            name="eye-off"
            color="#36586f"
            size={15}
        />
    :
        <Feather
            name="eye"
            color="#36586f"
            size={15}
        />
    }
    </TouchableOpacity>
    <TextInput
    placeholder="Confirm Password"
    style={styles.passwordInput}
    autoCapitalize="none"
    secureTextEntry={data.confirm_secureTextEntry ? true : false}
    onChangeText={(val) => confirmPasswordInputChange(val)}
    />
    <TouchableOpacity style = {styles.feather} onPress={confirm_updateSecureTextEntry}>
    {data.confirm_secureTextEntry ?
        <Feather
            name="eye-off"
            color="#36586f"
            size={15}
        />
    :
        <Feather
            name="eye"
            color="#36586f"
            size={15}
        />
    }
    </TouchableOpacity>
    <TouchableOpacity style={styles.LogInButton}
    onPress= {loginHandler}
     >
    
            <Text style={styles.textSign} > Confirm Change </Text>
    </TouchableOpacity>
  
  </View>
  <View>
      <Text style = {styles.captionPh} > Change Phone  Number </Text>
    {enterPhone ?
     <TextInput
    placeholder="Enter OTP"
    style={styles.nextInput}
    autoCapitalize="none"
    onChangeText={(val) =>  OTPInputChange(val)}
    /> : 
    <TextInput
        placeholder="Enter Phone Number"
        style={styles.nextInput}
        autoCapitalize="none"
        onChangeText={(val) =>  phoneInputChange(val)}
    />
    }
    { enterPhone ?
    <TouchableOpacity style={ styles.OTP}
    onPress= {verifyOTPHandler}
     >
        <LinearGradient
        colors={['#185d98', '#185d98']}
        style={styles.LogIn}
        >
            <Text style={styles.textSign} > Verify OTP </Text>
        </LinearGradient>
    </TouchableOpacity> :
    <TouchableOpacity style={ styles.OTP}
     onPress= {sendOTPHandler}
      >
             <Text style={styles.textSign} > Send OTP </Text>
     </TouchableOpacity>
    }
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
modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000080',
  },
  header : {
    backgroundColor : "#185d98",
    height : "5%"
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
    marginTop : "-6%",
    justifyContent: 'center',
    alignItems: 'center'
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
    marginTop: "7%",
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
    width: '45%',
    height: '15%',
    backgroundColor: '#185d98',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: '7%',
    marginLeft : '26%',
},
// LogIn: {
//     width: '45%',
//     height: '30%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 50,
//     flexDirection: 'row',
//     marginTop: '7%',
//    // marginRight : "-7%",
// },
OTP : {
  width: '45%',
  height: '23%',
  backgroundColor: '#185d98',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 50,
  flexDirection: 'row',
  marginTop: '7%',
  marginLeft : '26%',
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
    fontSize : 18,
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
  captionPh : {
    color: 'black',
    fontSize: 22,
   // fontWeight: 'bold',
     //marginTop : '-25%',
    fontWeight: 'bold',
    marginLeft : "2%"
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

export default SignInScreen;
