import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TextInput,
    Modal,
    Button,
    TouchableOpacity,
    Alert,
    SafeAreaView,
} from 'react-native';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';

const Home = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');

    const handleLogout = () => {
        auth().signOut();
        navigation.navigate('Authorization'); // Quay về màn hình đăng nhập  
    };

    const handleUpdate = (documentId, item) => {
        navigation.navigate('Update', {
            documentId,
            name: item.name,
            age: item.age,
            phone: item.phone,
        });
    };

    const getData = async () => {
        setLoading(true);

        try {
            const snapshot = await firestore().collection('User').get();
            const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(fetchedData);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu: ", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có muốn xóa dữ liệu này không?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Hủy xóa"),
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            await firestore().collection('User').doc(id).delete();
                            setData(prevData => prevData.filter(item => item.id !== id));
                            Alert.alert("Thành công", "Xóa thành công.");
                        } catch (error) {
                            console.error("Lỗi khi xóa dữ liệu: ", error);
                            Alert.alert("Lỗi", "Không thể xóa dữ liệu.");
                        }
                    }
                }
            ]
        );
    };

    const addItem = async () => {
        const newItem = { name, age, phone, createdAt: new Date() };
        try {
            await firestore().collection('User').add(newItem);
            Alert.alert("Thành công", "Dữ liệu đã được thêm.");
            clearForm();
            getData();
        } catch (error) {
            console.error("Lỗi khi thêm dữ liệu: ", error);
            Alert.alert("Lỗi", "Không thể thêm dữ liệu.");
        }
    };

    const clearForm = () => {
        setName('');
        setAge('');
        setPhone('');
        setModalVisible(false);
    };

    useEffect(() => {
        getData();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
                <Text style={styles.itemText}>Họ và tên : {item.name}</Text>
                <Text>Tuổi : {item.age}</Text>
                <Text>Số điện thoại: {item.phone}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnEdit} onPress={() => handleUpdate(item.id, item)}>
                <Text style={{ color: '#ffffff' }}>Sửa</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.flatList}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Icon name="add" size={30} color="#ffffff" />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={clearForm}
            >
                <View style={styles.modalView}>
                    <TextInput
                        placeholder="Tên"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Tuổi"
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Số điện thoại"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                    <View style={styles.buttonGroup}>
                        <Button title="Thêm" onPress={addItem} />
                        <Button title="Hủy" onPress={clearForm} color="#FF0000" />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 10,
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    btnEdit: {
        padding: 10,
        backgroundColor: '#ff5722',
        borderRadius: 20,
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 18,
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff5722',
        elevation: 5,
    },
    flatList: {
        flex: 1,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: '#ff5722',
        paddingVertical: 5, // giảm padding trên và dưới  
        paddingHorizontal: 10, // giảm padding bên trái và bên phải  
        borderRadius: 5, // bo góc  
        alignSelf: 'flex-end', // căn nút về bên phải nếu cần  
    },
});