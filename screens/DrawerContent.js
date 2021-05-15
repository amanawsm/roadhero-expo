import React , {useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Drawer
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';


import{ AuthContext } from '../components/context';

import AboutScreen from './About';

const AboutStack = createStackNavigator();


export function DrawerContent(props) {
    const [data, setData] = React.useState({
        name : '',
        email :'Test Mail ',
        userToken : '',
    });
    const AboutStackScreen = ({navigation}) =>(
        <AboutStack.Navigator screenOptions={{
          headerStyle:{
            backgroundColor: '#a8c4c7'
          },
          headerTintColor: '#fff',
          headerTitleStyle:{
            fontWeight: 'bold'
          }
        }}>
          <AboutStack.Screen name="About" component={AboutScreen}  options={{
            headerLeft: () =>(
              <Icon.Button name="menu" size={25}
              backgroundColor="#a8c4c7" onPress= {
                () => navigation. openDrawer()
              }></Icon.Button>
            )
          }} />
        </AboutStack.Navigator>
      );

    useEffect(() => {
        async function changeName() {
        console.log("Request in change name ");
        try {
            userName = await AsyncStorage.getItem('userName');
            userEmail = await AsyncStorage.getItem('userEmail');
            console.log(`User Name : ${userName}`);
            console.log(`User Email : ${userEmail}`);

          } catch(e) {
            console.log(e);
          }
        setData({
            ...data,
            name : userName,
            email : userEmail
        });
        }
        async function updateImage(){
            try{

            }catch(message){
            }
        }
        changeName();
    }, []);

    const { signOut } = React.useContext(AuthContext);
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                        <Avatar.Image
                        source={require('../images/user.jpg')}
                        size={50}
                      />
                            <View style={{marginLeft:10, flexDirection:'column'}}>
                                <Title style={styles.title}>{data.name}</Title>
                                <Caption style={styles.caption}>{data.email}</Caption>
                            </View>
                        </View>

                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({color, size}) => (
                                <FontAwesome5 name="car-alt" color={color} size={26} />
                            )}
                            label="Services"
                            onPress={() => {props.navigation.navigate('OfferedServices')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                name="account-group"
                                color={color}
                                size={size}
                                />
                            )}
                            label="About"
                            onPress={ () => { props.navigation.navigate('About')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                name="help-circle"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Help"
                            onPress={() => {props.navigation.navigate('Help')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Feather
                                name="settings"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Setting"
                            onPress={() => {props.navigation.navigate('Setting')}}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    //   backgroundColor : "#185d98"
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });