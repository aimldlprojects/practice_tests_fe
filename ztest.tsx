import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import CustomDropdown from '../components/CustomDropdown';
import { Subject, Topic } from '../types'; // Import types if using a separate file

const NGROK_BASE_URL = 'https://46ea-2405-201-c011-e155-493f-9e3c-4455-5965.ngrok-free.app';

const Index = () => {
    const [users, setUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState<boolean>(false);
    const [isLoadingTopics, setIsLoadingTopics] = useState<boolean>(false);

    const [errorUsers, setErrorUsers] = useState<string | null>(null);
    const [errorSubjects, setErrorSubjects] = useState<string | null>(null);
    const [errorTopics, setErrorTopics] = useState<string | null>(null);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(`${NGROK_BASE_URL}/get_users`);
            setUsers(response.data.users);
            setErrorUsers(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setErrorUsers('Failed to fetch users. Please try again later.');
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    // Fetch subjects
    const fetchSubjects = useCallback(async (user: string) => {
        setIsLoadingSubjects(true);
        try {
            const response = await axios.get(`${NGROK_BASE_URL}/get_subjects?user=${user}`);
            setSubjects(response.data.subjects);
            setErrorSubjects(null);
        } catch (err) {
            console.error('Error fetching subjects:', err);
            setErrorSubjects('Failed to fetch subjects. Please try again later.');
        } finally {
            setIsLoadingSubjects(false);
        }
    }, []);

    // Fetch topics
    const fetchTopics = useCallback(async (user: string, subject: string) => {
        setIsLoadingTopics(true);
        try {
            const response = await axios.get(`${NGROK_BASE_URL}/get_topics?user=${user}&subject=${subject}`);
            setTopics(response.data.topics);
            setErrorTopics(null);
        } catch (err) {
            console.error('Error fetching topics:', err);
            setErrorTopics('Failed to fetch topics. Please try again later.');
        } finally {
            setIsLoadingTopics(false);
        }
    }, []);

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Fetch subjects when a user is selected
    useEffect(() => {
        if (selectedUser) {
            fetchSubjects(selectedUser);
        }
    }, [selectedUser, fetchSubjects]);

    // Fetch topics when a subject is selected
    useEffect(() => {
        if (selectedUser && selectedSubject) {
            fetchTopics(selectedUser, selectedSubject);
        }
    }, [selectedUser, selectedSubject, fetchTopics]);

    return (
        <View style={styles.container}>
            {/* User Dropdown */}
            <DropdownSection
                label="User:"
                isLoading={isLoadingUsers}
                error={errorUsers}
                data={users.map((user) => ({ label: user, value: user }))}
                placeholder="Select a user"
                value={selectedUser}
                onChange={(item) => setSelectedUser(item.value)}
            />

            {/* Subject Dropdown */}
            <DropdownSection
                label="Subject:"
                isLoading={isLoadingSubjects}
                error={errorSubjects}
                data={subjects.map((subject) => ({ label: subject.name, value: subject.id }))}
                placeholder="Select a subject"
                value={selectedSubject}
                onChange={(item) => setSelectedSubject(item.value)}
            />

            {/* Topic Dropdown */}
            <DropdownSection
                label="Topic:"
                isLoading={isLoadingTopics}
                error={errorTopics}
                data={topics.map((topic) => ({ label: topic.name, value: topic.id }))}
                placeholder="Select a topic"
                value={selectedTopic}
                onChange={(item) => setSelectedTopic(item.value)}
            />
        </View>
    );
};

// Reusable Dropdown Section Component
const DropdownSection = ({ label, isLoading, error, data, placeholder, value, onChange }) => (
    <View style={styles.dropdownContainer}>
        <Text style={styles.label}>{label}</Text>
        {isLoading ? (
            <ActivityIndicator size="small" color="#007BFF" />
        ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
        ) : (
            <CustomDropdown
                data={data}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                width={200}
                maxHeight={500}
                fontBold={true}
                dropdownStyle={styles.dropdown}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
            />
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '90%',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 10,
    },
    dropdown: {
        flex: 1,
        backgroundColor: '#fff',
        borderColor: '#007BFF',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    placeholder: {
        color: '#007BFF',
    },
    selectedText: {
        color: '#007BFF',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default Index;