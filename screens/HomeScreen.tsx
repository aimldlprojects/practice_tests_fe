import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import CustomDropdown from '../components/CustomDropdown';

const NGROK_BASE_URL = 'https://46ea-2405-201-c011-e155-493f-9e3c-4455-5965.ngrok-free.app';

const Index = () => {
    const [users, setUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${NGROK_BASE_URL}/get_users`);
            setUsers(response.data.users); // Extract the "users" array from the response
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a User</Text>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <CustomDropdown
                    data={users.map((user) => ({ label: user, value: user }))}
                    placeholder="Select a user"
                    value={selectedUser}
                    onChange={(item) => setSelectedUser(item.value)}
                    width="80%"
                    fontBold={true}
                    dropdownStyle={styles.dropdown}
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.selectedText}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dropdown: {
        borderColor: '#007BFF',
    },
    placeholder: {
        color: '#007BFF',
    },
    selectedText: {
        color: '#007BFF',
    },
});

export default Index;