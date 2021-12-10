import React, {useState} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Magic} from '@magic-sdk/react-native';
const magic = new Magic('api_key');

const Stack = createNativeStackNavigator();

import {WebView} from 'react-native-webview';

function HomeScreen({route, navigation}) {
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 22, marginVertical: 20}}>Home Screen</Text>
      <Text style={{fontSize: 22, marginVertical: 20}}>
        Welcome Back {route.params.webViewResponse}
      </Text>
      <TouchableOpacity
        style={{
          padding: 15,
          borderRadius: 20,
          backgroundColor: '#6751FF',
          alignItems: 'center',
          width: 300,
          marginVertical: 20,
        }}
        onPress={() => navigation.navigate('LogOutScreen')}>
        <Text style={{color: 'white', fontSize: 22}}>Navigate to Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function LogOutScreen({navigation}) {
  function onMessage(data) {
    alert(data.nativeEvent.data);
    navigation.navigate('LoginScreen');
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        useWebKit={false}
        scalesPageToFit={false}
        mixedContentMode="compatibility"
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        originWhitelist={['*']}
        onMessage={onMessage}
        source={{
          html: ` 
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
            "
          >
            <button
              onclick="handleLogout()"
              style="
                padding: 20;
                width: 200;
                font-size: 20;
                color: white;
                background-color: #6751ff;
              "
            >
              Log Out
            </button>
            <script src="https://auth.magic.link/sdk"></script>
        
            <script>
              const magicClient = new Magic('api_key');
        
              const handleLogout = async () => {
                await magicClient.user.logout();
                window.ReactNativeWebView.postMessage('Logged Off');
              };
            </script>
          </body>
        </html>
         
        
    `,
        }}
      />
    </SafeAreaView>
  );
}

function MagicScreen({navigation, route}) {
  function onMessage(data) {
    navigation.navigate('HomeScreen', {webViewResponse: data.nativeEvent.data});
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        useWebKit={false}
        scalesPageToFit={false}
        mixedContentMode="compatibility"
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        originWhitelist={['*']}
        onMessage={onMessage}
        source={{
          html: ` 
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
            "
          >
            <div id="app"></div>
            <script src="https://auth.magic.link/sdk"></script>
        
            <script>
              const magicClient = new Magic('api_key');
        
              const checkMetaUser = async () => {
                const isLoggedIn = await magicClient.user.isLoggedIn();
                if (isLoggedIn) {
                  const userMetadata = await magicClient.user.getMetadata();
                  window.ReactNativeWebView.postMessage(userMetadata);
                  return;
                } else {
                  getSMS();
                }
              };
        
              const getSMS = async () => {
                const response = await magicClient.auth.loginWithSMS({
                  phoneNumber: '+${route.params.number}',
                });
                sendDataToReactNativeApp(response);
              };
        
              const sendDataToReactNativeApp = async response => {
                const userMetaData = await magicClient.user.getMetadata();
                window.ReactNativeWebView.postMessage(userMetaData.phoneNumber);
              };
              window.onload = function () {
                checkMetaUser();
              };
            </script>
          </body>
        </html>
        
    `,
        }}
      />
      <magic.Relayer />
    </SafeAreaView>
  );
}

function LoginScreen({navigation}) {
  const [number, setNumber] = useState('');

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View>
        <View style={{alignItems: 'center', marginBottom: 30}}>
          <Text style={{fontSize: 22}}>Get SMS OTP with Magic SDK</Text>
        </View>
        <TextInput
          style={{
            borderWidth: 1,
            margin: 10,
            padding: 10,
            borderRadius: 10,
            width: 300,
            height: 70,
            marginBottom: 50,
            fontSize: 22,
          }}
          value={number}
          onChangeText={e => setNumber(e)}
        />
        <TouchableOpacity
          style={{
            padding: 15,
            borderRadius: 20,
            backgroundColor: '#6751FF',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('MagicScreen', {number: number})}>
          <Text style={{color: 'white', fontSize: 22}}>Get OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen
          name="MagicScreen"
          component={MagicScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LogOutScreen" component={LogOutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default App;
