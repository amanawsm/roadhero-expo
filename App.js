import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { NavigationContainer , DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
//import { StyleSheet, Text, Button, View, ActivityIndicator , Alert } from 'react-native';
import { useEffect } from 'react';

import {Modal, ActivityIndicator, TouchableOpacity , ImageBackground, StyleSheet, Text, View , TextInput , Alert } from 'react-native';

import { AuthContext } from './components/context';
import AsyncStorage from '@react-native-community/async-storage';

import RootStackScreen from './screens/RootStackScreen';
import MainScreen from './screens/MainScreen';
import AboutScreen from './screens/About';
import HelpScreen from './screens/Help';
import { DrawerContent } from './screens/DrawerContent';
import Settings from './screens/EditProfileScreen';
import {config} from './constants';


const Drawer = createDrawerNavigator();

const App = ({navigation}) =>{


  const [getModal, setModal] = useState(false);


  const initialLoginState = {
    isLoading: true,
    mailID: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          emailID: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          mailID: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          mailID: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

   const authContext =  React.useMemo(() => ({
     signIn : async(foundUser) =>{
      try {
        setModal(true);
        const response = await fetch(`${config.Api_Url}/login/${foundUser.mailID}/${foundUser.password}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        setModal(false);
        const responseData = await response.json();
        const status = responseData.status;
        const user = responseData.data;
        if (status === 200) {
           if(user.verified){
            const  userEmail = user.email;
            const userPhone = user.phone;
            const userName = `${user.first_name} ${user.last_name}`;
            const token = user.token;
            const id = user.id;
           try {
               await AsyncStorage.setItem('userName', userName);
               await AsyncStorage.setItem('phone', userPhone);
               await AsyncStorage.setItem('userEmail', userEmail);
               await AsyncStorage.setItem('userToken', token);
               await AsyncStorage.setItem('id', id.toString());
             } catch(e) {
               console.log(e);
             }
            dispatch({ type: 'LOGIN', id: userEmail , token: token});
           }else{
              try {
                setModal(true);
              const link = `${config.Api_Url}/verifyPhone/${userPhone}`;
              const responseData = await fetch(link, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            });
            setModal(false);
            const responsePhone = await responseData.json();
            const status = await responseData.status;
            if(status == 200){
              Alert.alert(`A 4 digit verification code sent to ${data.phoneNumber} Enter To Verify `);
              navigator.navigate("OTPScreen");
            }else{
              Alert.alert(`Error Sending OTP. ${responsePhone.message} `);
            }
            } catch(e) {
              console.log(e);
            }

           }
         }else{
          Alert.alert(responseData.message);
         }
        }catch(err){
            console.log(err);
            console.log(` Error Occur :   ${err.message} `);
        }
     },
    signOut: async() => {
      try {
        await AsyncStorage.removeItem('userToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT'});
    },
    signUp: () => {
      //setUserToken('fgkj');
      //setIsLoading(false);
    },
  }), []);

  useEffect(() => {
    setTimeout(async() => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken} );
    }, 1000);
  }, []);

  if(loginState.isLoading){
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return(
    <AuthContext.Provider value={authContext}>
        <Modal
        animationType="none"
        transparent={true}
        visible={getModal}
        onRequestClose={() => {
        setModal(false);
        }}>
        <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
        <Text>Please Wait... Checking Your Credentials </Text>
            <ActivityIndicator size="small" color="#0000ff" />
        </View>
        </View>
        </Modal>
        <NavigationContainer >
          {
          loginState.userToken ? (
            <Drawer.Navigator initialRouteName="Screen" drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="Screen" component={MainScreen} />
            <Drawer.Screen name="About"  component={AboutScreen} />
            <Drawer.Screen name="Help"  component={HelpScreen} />
            <Drawer.Screen name="Setting"   component={Settings} />
          </Drawer.Navigator>
          )
          :
          <RootStackScreen />
          }
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
});
