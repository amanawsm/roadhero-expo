import React , {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity , Modal , ActivityIndicator , ImageBackground, StyleSheet, Text, View , TextInput } from 'react-native';

import { AuthContext } from '../components/context';
import {config} from '../constants';

const image = '../images/road.jpg';

const SignInScreen = ({navigation}) => {
    const { signIn } = React.useContext(AuthContext);
    const [data, setData] = React.useState({
        email: '',
        password: '',
        secureTextEntry: true,
    });

    const [getModal, setModal] = useState(false);
    const [status, setStatus] =useState(true);
    const [check, setCheck] =useState(true);

    const emailInputChange = (val) => {
            setData({
                ...data,
                email: val,
            });
    }

    const passInputChange = (val) => {
        setData({
            ...data,
            password: val,
        });
}

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }
    const loginHandler = () => {
        const foundUser = {
            mailID : data.email,
            password : data.password
        }
        signIn(foundUser);

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
            <Text>Please Wait... Checking Your Credentials </Text>
            ) : (
            <Text>Data Is Coming</Text>
            )}

            <ActivityIndicator size="small" color="#0000ff" />
        </View>
        </View>
        </Modal>
      <View>
      <Text style = {styles.caption} > Login Account </Text>
    <TextInput
        placeholder="Email"
        style={styles.nextInput}
        autoCapitalize="none"
        onChangeText={(val) =>  emailInputChange(val)}
    />
    <TextInput
    placeholder="Enter Password"
    style={styles.passwordInput}
    autoCapitalize="none"
    secureTextEntry={data.secureTextEntry ? true : false}
    onChangeText={(val) => passInputChange(val)}
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
    <TouchableOpacity style={styles.LogInButton}
    onPress= {loginHandler}
     >
            <Text style={styles.textSign} > LOGIN </Text>
     </TouchableOpacity>
    <View style = {styles.bottomView} >
    <Text style = {styles.end} > New to become a road hero? </Text>
    <TouchableOpacity
    onPress={() => navigation.navigate('SignUpScreen')}
     >
        <View>
            <Text style = {styles.signUpText} >SignUp</Text>
        </View>
    </TouchableOpacity>
    <Text style = {styles.end} >Now </Text>
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
    marginTop : "5%",
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
    width: '60%',
    height: '14%',
    backgroundColor: '#185d98',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: '20%',
    marginLeft : "20%"
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

export default SignInScreen;
