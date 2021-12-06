import React, {useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import {WebView} from 'react-native-webview';

const App = () => {
  const [number, setNumber] = useState('');

  function onMessage(data) {
    alert(data.nativeEvent.data);
    console.log(data.nativeEvent.data, '222', data, data.nativeEvent);
    setNumber(data.nativeEvent.data);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {number === '' && (
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="display:flex; justify-content:center;flex-direction:column;align-items:center">

          <button
          onclick="getSMS()"
          style="background-color: "white"; padding: 30; margin:10;height:300;width:500;"
        >
          Get Sms
        </button>

        <div id="app"></div>
        <script src="https://auth.magic.link/sdk"></script>
  
        <script>
  
        const magicClient = new Magic("pk_live_FB1DF44D0551F926");
       
        const getSMS = async () => {
          alert('lol');

          const response = await magicClient.auth.loginWithSMS({
            phoneNumber: '+916380117244',
          });

          sendDataToReactNativeApp(response)
        };
        const handleLogout = async () => {
          await magicClient.user.logout();
        };
        const checkMetaUser = async() =>{
          const isLoggedIn = await magicClient.user.isLoggedIn();
          if (isLoggedIn) {
            const userMetadata = await magicClient.user.getMetadata();
            window.ReactNativeWebView.postMessage(userMetaData)
            return;
          }
          alert(isLoggedIn)
        }

        const sendDataToReactNativeApp = async (response) => {
          const isLoggedIn = await magicClient.user.isLoggedIn();
      
          if (isLoggedIn) {
            const userMetadata = await magicClient.user.getMetadata();
            alert(userMetadata.phoneNumber);
            window.ReactNativeWebView.postMessage(userMetaData.phoneNumber)
            return;
          }
          else{
            window.ReactNativeWebView.postMessage(response)
          }
        };
        window.onload = function() {
          checkMetaUser() 
        };
    
     </script>
        </body>
          </html>
      `,
          }}
        />
      )}
      <View>
        <Text>{number}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
