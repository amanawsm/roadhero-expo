import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AboutScreen from './About';
import AppScreen from './AppScreen';
import SignUp from './SignUp';
import SignIn from './SignIn';
import OTPScreen from './OTPScreen'

const RootStack = createStackNavigator();

export default function RootStackScreen({navigation}) {
  return (
        <RootStack.Navigator initialRouteName="Home">
            <RootStack.Screen  options={{headerShown: false}} name="SplashScreen" component={AppScreen} />
            <RootStack.Screen name="AboutScreen" component={AboutScreen} />
            <RootStack.Screen name="SignInScreen" options={{title: "Already a Road Hero" ,
             headerTintColor : "white"
             ,headerStyle: {
              backgroundColor: "#185d98",
              elevation: null
          },
             }} component={SignIn} />
             <RootStack.Screen name="OTPScreen" options={{title: "Verify OTP" ,
             headerTintColor : "white"
             ,headerStyle: {
              backgroundColor: "#185d98",
              elevation: null
          },
             }} component={OTPScreen} />
            <RootStack.Screen options={{title: "Become a Road Hero" ,
             headerTintColor : "white"
             ,headerStyle: {
              backgroundColor: "#185d98",
              elevation: null
          },
             }} name="SignUpScreen" component={SignUp} />
        </RootStack.Navigator>
  );
}