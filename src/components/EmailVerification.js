import React, { useEffect, useState } from 'react';  
import { View, Text, Alert } from 'react-native';  
import auth from '@react-native-firebase/auth';  

const EmailVerificationScreen = ({ navigation }) => {  
  const [isChecking, setIsChecking] = useState(true);   
  const [hasNavigated, setHasNavigated] = useState(false);

  const handleCheckVerification = async () => {  
    const user = auth().currentUser;  
    if (user) {  
      await user.reload(); 
      if (user.emailVerified && !hasNavigated) { 
        Alert.alert('Thành công!', 'Email của bạn đã được xác thực.', [  
          {  
            text: 'OK',  
            onPress: () => {  
              setHasNavigated(true); 
              navigation.navigate('Home'); 
            },  
          },  
        ]);  
      } else if (!user.emailVerified && !alertDisplayed) {  
        setAlertDisplayed(true);
        Alert.alert('Xác thực email', 'Bạn chưa xác thực email!');  
      }  
    }  
    setIsChecking(false);  
  };   

  useEffect(() => {  
    const intervalId = setInterval(handleCheckVerification, 3000);  

    return () => clearInterval(intervalId);
  }, []);  

  if (isChecking) {  
    return (  
      <View>  
        <Text>Đang kiểm tra xác thực email...</Text>  
      </View>  
    );  
  }  

  return (  
    <View>  
      <Text>Vui lòng kiểm tra email của bạn để xác thực.</Text>  
    </View>  
  );  
};  

export default EmailVerificationScreen;