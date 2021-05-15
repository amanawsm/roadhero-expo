import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Image ,  TouchableOpacity , ImageBackground, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';


const image = '../images/road.jpg';

const App = ({navigation}) => (
  <View style={styles.container}>
    <ImageBackground source={require('../images/road.jpg')} style={styles.image}>
    <Animatable.Image 
    source={require('../images/roadHero.png') }
    style={{  height: 90 , width : null ,  marginTop : "40%"  }}
    animation="fadeInDownBig"
    duraton="1500"
    />
      <Animatable.Text
         animation="fadeInUpBig"
         duraton="2000"
      style={styles.caption}>Join a Winning Team</Animatable.Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUpScreen')} >
            <MaterialIcons
            name="car-repair"
            color="#fff"
            size={30}
        />
            <Text style={styles.textSign} >Become a Road Hero</Text>
            <View >
            </View>
    </TouchableOpacity>
    <Text style={styles.or}>OR</Text>
    <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('SignInScreen')} >
            <Fontisto
            name="user-secret"
            color="#fff"
            size={25}
        />
            <Text style={styles.textSign} >Already a Road Hero</Text>
            <View >
            </View>
    </TouchableOpacity>
   </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
     flex: 1,
    resizeMode: 'cover',
    // justifyContent: 'center',
  },
  button: {
    alignItems: 'flex-end',
    //marginTop: '5%',
    width: '80%',
    height: '8%',
    backgroundColor: '#185d98',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: '30%',
    marginLeft: 'auto',
    marginRight : "-8%",
},
signInButton  : {
    alignItems: 'flex-end',
    width: '80%',
    height: '9%',
    backgroundColor: '#185d98',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: '7%',
    marginLeft: 'auto',
    marginRight : "-8%",
},
signUp: {
    width: '60%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: '45%',
    marginRight : "-5%",
},
signIn: {
    width: '57%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginRight : "-5%",
},
textSign: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: '4%'
},
  title: {
    color: '#ff9a01',
    fontSize: 42,
    fontWeight: 'bold',
    marginTop : '30%',
     textAlign: 'center',
    // backgroundColor: '#000000a0',
  },
  caption:{
    color: 'black',
    fontSize: 24,
   // fontWeight: 'bold',
     marginTop : '10%',
     textAlign: 'center',
  },
  or:{
    color: 'white',
    fontSize: 22,
    marginTop : '5%',
    fontWeight: 'bold',
    marginBottom: '3%',
    marginLeft : "30%",
   // fontWeight: 'bold',
     textAlign: 'center',
  }
});

export default App;
