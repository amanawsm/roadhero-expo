import 'react-native-gesture-handler';
import React , { useState, useEffect} from 'react';
import { StyleSheet, SafeAreaView , View , Text , Image , Modal , ActivityIndicator } from 'react-native';
import {Appbar} from 'react-native-paper';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import {config} from '../constants';
export default function AboutScreen({navigation}) {

    const [about , setAbout] = useState();
    const [contact , setContact] = useState();
    const [email , setEmail] = useState();
    const [getModal, setModal] = useState(false);

    useEffect(
        () => {
            async function UpdateUI(){
                console.log("About Page");
                setModal(true);
                const response = await fetch(`${config.Api_Url}/about`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                }
              });
              setModal(false);

              const responseData = await response.json();
              const status = await response.status;

              console.log(`Status Code : ${status}`);
              console.log(responseData);
              console.log(responseData.data.about_us);

              if(status == 200){
                  setAbout(responseData.data.about_us);
                  setContact(responseData.data.contact);
                  setEmail(responseData.data.email);
              }else{
                  Alert.alert("Problem Fetching Data.")
              }

            }
        UpdateUI();
        },[]
      );
    return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style = {styles.header} >
      <Appbar.BackAction onPress={()=> {navigation.goBack()}} />
      <Appbar.Content title="About Us"
      />
        </Appbar.Header>
    <View style ={styles.icon} >
        <Image
            source={require('../images/roadHero.png') }
            style={{  height: 90 , width : null ,  marginTop : "10%"  }}
             />
    </View>
    <View>
    <Modal
        animationType="none"
        transparent={true}
        visible={getModal}
        onRequestClose={() => {
        setModal(false);
        }}>
        <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
            <Text> Please Wait... Getting Data </Text>
            {/* {status == false ? (
            <Text>Please Wait... Sending Your Data </Text>
            ) : (
            <Text>Data Is Coming</Text>
            )} */}

            <ActivityIndicator size="small" color="#0000ff" />
        </View>
        </View>
        </Modal>
          <View style = {styles.aboutView}>
          <Text style = {styles.about} > {about} </Text>
          </View>
    </View>
    <View style = {styles.moreView}>
        <Text style = {styles.moreText} > MORE INFO </Text>
    </View>
    <View style = {styles.emailView}>
        <Fontisto
            name="email"
            color="black"
            size={25}
        />
        <Text style = {styles.email} > {email} </Text>
        </View>
        <View style = {styles.emailView}>
        <Feather
                name="phone"
                color="black"
                size={25}
            />
        <Text style = {styles.email} > {contact} </Text>
        </View>


       {/* <Text> About Screen </Text> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:25
  },
  title: {
    color: '#ff9a01',
    fontSize: 42,
    fontWeight: 'bold',
    marginTop : '20%',
     textAlign: 'center',
    // backgroundColor: '#000000a0',
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
  icon : {
      marginTop : 10
  },
  emailView : {
      flexDirection : 'row',
      marginTop : "3%",
      marginLeft : "8%"
  },
  email : {
      marginLeft : "3%",
      fontSize : 16,
      fontWeight : "bold"
  },
  aboutView : {
      marginTop : "5%",
       alignItems : 'center',
       justifyContent : 'center',
      width : "90%"
  },
  about : {
    marginLeft : "10%",
    textAlign: 'center'
  },
  header : {
      backgroundColor : "#185d98",
      height : "5%"
  },
  moreView : {
      marginTop : "5%",
      alignItems : 'center',
      justifyContent : 'center'
  },
  moreText : {
      color : 'grey',
  },
  back : {
    marginTop : "5%",
}
});