import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Update = ({ route, navigation }) => {
    const { documentId, name, age, phone } = route.params;  // Nhận các tham số từ route  
    const [newName, setNewName] = useState(name);
    const [newAge, setNewAge] = useState(age.toString());
    const [newPhone, setNewPhone] = useState(phone);

    const handleUpdate = async () => {
        const updatedItem = { name: newName, age: parseInt(newAge, 10), phone: newPhone };

        try {
            await firestore().collection('User').doc(documentId).update(updatedItem);
            Alert.alert("Thành công", "Dữ liệu đã được cập nhật.");
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.error("Lỗi khi cập nhật dữ liệu: ", error);
            Alert.alert("Lỗi", "Không thể cập nhật dữ liệu.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Tên"
                value={newName}
                onChangeText={setNewName}
                style={styles.input}
            />
            <TextInput
                placeholder="Tuổi"
                value={newAge}
                onChangeText={setNewAge}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Số điện thoại"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
                style={styles.input}
            />
            <Button title="Cập nhật" onPress={handleUpdate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});

export default Update;