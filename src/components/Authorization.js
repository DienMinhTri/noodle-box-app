import React, { useState } from 'react';  
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';  
import auth from '@react-native-firebase/auth';  

const Authorization = ({ navigation }) => {  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  

  const register = async () => {  
    try {  
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);  
      await userCredential.user.sendEmailVerification();  
      Alert.alert('Thành công!', 'Email xác thực đã được gửi.');  
      navigation.navigate('EmailVerification');  
    } catch (error) {  
      Alert.alert('Lỗi', error.message);  
    }  
  };  

  const login = async () => {  
    try {  
      const userCredential = await auth().signInWithEmailAndPassword(email, password);  
      const user = userCredential.user;  
      if (user.emailVerified) {  
        navigation.navigate('Home');  
      } else {  
        Alert.alert('Xác thực email', 'Vui lòng xác thực email của bạn!');  
        auth().signOut();  
      }  
    } catch (error) {  
      Alert.alert('Lỗi', error.message);  
    }  
  };  

  return (  
    <View style={styles.container}>  
      <Text style={styles.header}>Đăng Nhập / Đăng Ký</Text>  
      <TextInput  
        style={styles.input}  
        placeholder="Email"  
        value={email}  
        onChangeText={setEmail}  
        keyboardType="email-address"  
        autoCapitalize="none"  
      />  
      <TextInput  
        style={styles.input}  
        placeholder="Mật khẩu"  
        value={password}  
        onChangeText={setPassword}  
        secureTextEntry  
      />  
      <TouchableOpacity style={styles.button} onPress={register}>  
        <Text style={styles.buttonText}>Đăng ký</Text>  
      </TouchableOpacity>  
      <TouchableOpacity style={styles.button} onPress={login}>  
        <Text style={styles.buttonText}>Đăng nhập</Text>  
      </TouchableOpacity>  
    </View>  
  );  
};  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',  
    padding: 20,  
    backgroundColor: '#F5F5F5',  
  },  
  header: {  
    fontSize: 24,  
    fontWeight: 'bold',  
    marginBottom: 20,  
  },  
  input: {  
    width: '100%',  
    height: 50,  
    borderColor: '#ccc',  
    borderWidth: 1,  
    borderRadius: 5,  
    paddingHorizontal: 10,  
    marginBottom: 15,  
    backgroundColor: '#ffffff',  
  },  
  button: {  
    width: '100%',  
    height: 50,  
    backgroundColor: '#007BFF',  
    borderRadius: 5,  
    justifyContent: 'center',  
    alignItems: 'center',  
    marginBottom: 10,  
  },  
  buttonText: {  
    color: '#ffffff',  
    fontSize: 16,  
    fontWeight: 'bold',  
  },  
});  

export default Authorization;