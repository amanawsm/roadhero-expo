import React , {useState , useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {Modal, ActivityIndicator, TouchableOpacity , ImageBackground, StyleSheet, Text, View , TextInput , Alert } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { config } from '../constants';


const image = '../images/road.jpg';

const App = ({navigation}) => {
    const [data, setData] = React.useState({
        email: '',
        firstName : '',
        lastName : '',
        mobile : '',
        password: '',
        confirm_password: '',
        check_emailInputChange: false,
        check_nameInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true
    });
    const [getModal, setModal] = useState(false);
    const [status, setStatus] =useState(true);
    const [check, setCheck] =useState(true);

    useEffect(() => {

    }, [check]);

    const emailInputChange = (val) => {
        if( val.length == 0 ) {
            setData({
                ...data,
                email: val,
                check_emailInputChange: false,
            });
        } else {
            setData({
                ...data,
                email: val,
                check_emailInputChange: true,
            });
        }
    }
    const nameInputChange = (val) => {
        console.log(val);
        if( val.length == 0 ) {
            setData({
                ...data,
                firstName: val,
                check_nameInputChange: false,
            });
        } else {
            setData({
                ...data,
                firstName: val,
                check_nameInputChange: true,
            });
        }
    }

    const lastNameInputChange = (val) => {
        console.log(val);
        if( val.length == 0 ) {
            setData({
                ...data,
                lastName: val,
                check_nameInputChange: false,
            });
        } else {
            setData({
                ...data,
                lastName: val,
                check_nameInputChange: true,
            });
        }
    }

    const mobileInputChange = (val) => {
        console.log(val);
        if( val.length == 0 ) {
            setData({
                ...data,
                mobile: val,
                check_nameInputChange: false,
            });
        } else {
            setData({
                ...data,
                mobile: val,
                check_nameInputChange: true,
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }
    const signUpHandler = async () =>{
        console.log("GET IN SIGN UP");
        console.log(data);
        //setData({firstName : ''});
        //setCheck(!check);
        if(data.password != data.confirm_password){
            Alert.alert("Password not match. Check the Password and try again! ");
            return;
        }
try {
    setStatus(false);
    setModal(true);
    console.log("data");
    console.log(data);
    const response = await fetch(`${config.Api_Url}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.mobile,
        password: data.password
      }),
    });

    const responseData = await response.json();
    const status = await responseData.status;
    console.log(responseData);
    setStatus(true);
    setModal(false);
    console.log(status);
    var a = [];
    //console.log(typeof(responseData.data.phone));
    //user with this phone already exists.
    console.log(`Type of email ${typeof(responseData.data.email)}`);
    if(status == 200  || (status == 400 && typeof(responseData.data.phone) == 'object') || (status == 400 && typeof(responseData.data.email) == 'object')){
        if(typeof(responseData.data.phone) == 'object'){
            Alert.alert("Use with the Phone Number Already exsist");
            console.log("USER EXISTS");
            return;
        }
        if(typeof(responseData.data.email) == 'object'){
            Alert.alert(`Unable to register ,  ${responseData.data.email[0]} `);
            return;
        }
        try {
            const link = `${config.Api_Url}/verifyPhone/${data.mobile}`;
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
                Alert.alert(`A 4 digit verification code sent to ${data.mobile} Enter To Verify `);
                setData({firstName : ''});
                setCheck(!check);
                try {
                    await AsyncStorage.setItem('phone', data.mobile);
                  } catch(e) {
                    console.log(e);
                  }
                navigation.navigate('OTPScreen');
            }else{
                Alert.alert(`Error Sending OTP. ${responsePhone.message} `);
            }
            }catch(err){
                console.log(err);
                console.log(err.message);
                Alert.alert(err.message);
            }
    }else{
        Alert.alert(responseData.message);
    }
    }catch(err){
        console.log(err);
        console.log(err.message);
    }

}


    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
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
      <Text style = {styles.caption} > It'S EASY TO GET STARTED</Text>
      <View styles = {styles.NameView}>
      <TextInput
        placeholder="First Name"
        style={styles.textInput}
        autoCapitalize="none"
        onChangeText={(val) =>  nameInputChange(val)}
        value={data.firstName}
    />
    <TextInput
        placeholder="Last Name"
        style={styles.lastInput}
        autoCapitalize="none"
        onChangeText={(val) =>  lastNameInputChange(val)}
        value={data.lastName}
    />
    </View>
    <TextInput
        placeholder="Email"
        style={styles.nextInput}
        autoCapitalize="none"
       onChangeText={(val) =>  emailInputChange(val)}
       value={data.email}
    />
    <TextInput
        placeholder="Mobile"
        style={styles.nextInput}
        autoCapitalize="none"
       onChangeText={(val) =>  mobileInputChange(val)}
       value={data.mobile}
    />
    <TextInput
    placeholder="Enter Password"
    style={styles.passwordInput}
    autoCapitalize="none"
    secureTextEntry={data.secureTextEntry ? true : false}
    onChangeText={(val) => handlePasswordChange(val)}
     value={data.password}
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
    onChangeText={(val) => handleConfirmPasswordChange(val)}
    value={data.confirm_password}
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
    <TouchableOpacity style={styles.signInButton}
    onPress={signUpHandler}
     >
            <Text style={styles.textSign} > Join Now </Text>
            <View >
            </View>
     </TouchableOpacity>
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
signInButton  : {
    alignItems: 'flex-end',
    width: '60%',
    height: '10%',
    backgroundColor: '#185d98',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: '20%',
    marginLeft : 'auto',
    marginRight : "-7%"
},
signUp: {
    width: '60%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: '30%',
    marginRight : "-7%",
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
    fontSize : 25,
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
     textAlign: 'center',
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

export default App;
