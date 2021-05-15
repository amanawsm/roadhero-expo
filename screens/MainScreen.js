import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { View , Text } from 'react-native';
import EditProfileScreen from './EditProfileScreen';


import HomeScreen from './Home';
import ProfileScreen from './Profile';
import HistoryScreen from './History';
import ServicesScreen from './Services';
import OfferedServicesScreen from './OfferedServices';


const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ScheduleStack = createStackNavigator();
const HistoryStack = createStackNavigator();
const OfferedServicesStack = createStackNavigator();
const ServicesRequestsStack = createStackNavigator();


const HomeStackScreen = ({navigation}) =>(
  <HomeStack.Navigator screenOptions={{
    headerStyle:{
      backgroundColor: '#185d98'
    },
    headerTintColor: '#fff',
    headerTitleStyle:{
      fontWeight: 'bold'
    }
  }}>
    <HomeStack.Screen name="Home" component={HomeScreen}  options={{
      headerLeft: () =>(
        <Icon.Button name="menu" size={35}
        backgroundColor="#185d98" onPress= {
          () => navigation. openDrawer()
        }></Icon.Button>
      )
    }} />
  </HomeStack.Navigator>
);

const ScheduleStackScreen = ({navigation}) =>(
  <ScheduleStack.Navigator screenOptions={{
    headerStyle:{
      backgroundColor: '#185d98'
    },
    headerTintColor: '#fff',
    headerTitleStyle:{
      fontWeight: 'bold'
    }
  }}>
    <ScheduleStack.Screen name="Schedule" component={ScheduleSelectionScreen} options={{
      headerLeft: () =>(
        <Icon.Button name="menu" size={35}
        backgroundColor="#185d98" onPress= {
          () => navigation. openDrawer()
        }></Icon.Button>
      ),
      headerRight: () => (
        <View style={{marginRight: 10}}>
          <MaterialCommunityIcons.Button
            name="account-edit"
            backgroundColor="transparent"
            size={25}
            onPress={() => navigation.navigate('SetSlot')}
          />
        </View>
      ),
    }} props = {navigation} />
    <ScheduleStack.Screen
        name="SetSlot"
        options={{
          title: '',
        }}
        component={DetailsScreen}
      />
  </ScheduleStack.Navigator>
);


const OfferedServicesStackScreen = ({navigation}) =>(
    <OfferedServicesStack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor: '#185d98'
      },
      headerTintColor: '#fff',
      headerTitleStyle:{
        fontWeight: 'bold'
      }
    }}>
      <OfferedServicesStack.Screen name="OfferedServices" component={OfferedServicesScreen}  options={{
        headerLeft: () =>(
          <Icon.Button name="menu" size={35}
          backgroundColor="#185d98" onPress= {
            () => navigation. openDrawer()
          }></Icon.Button>
        )
      }} />
    </OfferedServicesStack.Navigator>
  );


const ServicesRequestScreen = ({navigation}) =>(
    <ServicesRequestsStack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor: '#185d98'
      },
      headerTintColor: '#fff',
      headerTitleStyle:{
        fontWeight: 'bold'
      }
    }}>
      <ServicesRequestsStack.Screen name="Services Requests" component={ServicesScreen}  options={{
        headerLeft: () =>(
          <Icon.Button name="menu" size={35}
          backgroundColor="#185d98" onPress= {
            () => navigation. openDrawer()
          }></Icon.Button>
        )
        }} />
    </ServicesRequestsStack.Navigator>
  );

const HistoryStackScreen = ({navigation}) =>(
  <HistoryStack.Navigator screenOptions={{
    headerStyle:{
      backgroundColor: '#185d98'
    },
    headerTintColor: '#fff',
    headerTitleStyle:{
      fontWeight: 'bold'
    }
  }}>
    <HistoryStack.Screen name="History" component={HistoryScreen}  options={{
      headerLeft: () =>(
        <Icon.Button name="menu" size={35}
        backgroundColor="#185d98" onPress= {
          () => navigation. openDrawer()
        }></Icon.Button>
      )
    }} />
  </HistoryStack.Navigator>
);

const ProfileStackScreen = ({navigation}) =>(
  <ProfileStack.Navigator screenOptions={{
    headerStyle:{
      backgroundColor: '#185d98',
      elevation: 0
    },
    headerTintColor: '#fff',
    headerTitleStyle:{
      fontWeight: 'bold'
    }
  }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen}  options={{
      headerLeft: () =>(
        <Icon.Button name="menu" size={35}
        backgroundColor="#185d98" onPress= {
          () => navigation.openDrawer()
        }></Icon.Button>
      ),
      headerRight: () => (
        <View style={{marginRight: 10}}>
          <MaterialCommunityIcons.Button
            name="account-edit"
            backgroundColor="transparent"
            size={25}
            onPress={() => navigation.navigate('Setting')}
          />
        </View>
      ),
    }} />
    <ProfileStack.Screen
        name="EditProfile"
        options={{
          title: 'Edit Profile',
        }}
        component={EditProfileScreen}
      />
  </ProfileStack.Navigator>
);

const Tab = createMaterialBottomTabNavigator();

export default function MainTabScreen() {
    return (
        <Tab.Navigator
        initialRouteName="Home"
        activeColor="#fff"
        style={{ backgroundColor: 'tomato' }}
      >
        <Tab.Screen
          name="Home"
          component={
              HomeStackScreen
            }
          options={{
            tabBarLabel: 'Home',
            tabBarColor: '#185d98',
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="OfferedServices"
          component={OfferedServicesStackScreen}
          options={{
            tabBarLabel: 'Services',
            tabBarColor: '#185d98',
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="car-alt" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Services"
          component={ServicesRequestScreen}
          options={{
            tabBarLabel: 'Requests',
            tabBarColor: '#185d98',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="notifications" color={color} size={26}/>
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryStackScreen}
          options={{
            tabBarLabel: 'History',
            tabBarColor: '#185d98',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="history" color={color} size={26}/>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarColor: '#185d98',
            tabBarIcon: ({ color }) => (
              <Icon name="person" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
