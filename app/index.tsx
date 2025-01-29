import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import CustomDropdown from '../components/CustomDropdown';

const NGROK_BASE_URL = 'https://3358-2405-201-c011-e155-493f-9e3c-4455-5965.ngrok-free.app';


const Index = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${NGROK_BASE_URL}/get_users`);
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubjects = useCallback(async (user: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${NGROK_BASE_URL}/get_subjects?user=${user}`);
      setSubjects(response.data.subjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to fetch subjects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTopics = useCallback(async (user: string, subject: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${NGROK_BASE_URL}/get_topics?user=${user}&subject=${subject}`);
      setTopics(response.data.topics);
      setError(null);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Failed to fetch topics. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (selectedUser) {
      fetchSubjects(selectedUser);
    }
  }, [selectedUser, fetchSubjects]);

  useEffect(() => {
    if (selectedUser && selectedSubject) {
      fetchTopics(selectedUser, selectedSubject);
    }
  }, [selectedUser, selectedSubject, fetchTopics]);


  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>User:     </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <CustomDropdown
            data={users.map((user) => ({ label: user, value: user }))}
            placeholder="Select a user"
            value={selectedUser}
            onChange={(item) => setSelectedUser(item.value)}
            width={200}
            maxHeight={40}
            fontBold={true}
            dropdownStyle={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />
        )}
      </View>

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Subject:</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <CustomDropdown
            data={subjects.map((subject) => ({ label: subject, value: subject }))}
            placeholder="Select a subject"
            value={selectedSubject}
            onChange={(item) => setSelectedSubject(item.value)}
            width={200}
            maxHeight={40}
            fontBold={true}
            dropdownStyle={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />
        )}
      </View>

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Topic:    </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <CustomDropdown
            data={topics.map((topic) => ({ label: topic, value: topic }))}
            placeholder="Select a topic"
            value={selectedTopic}
            onChange={(item) => setSelectedTopic(item.value)}
            width={200}
            maxHeight={40}
            fontBold={true}
            dropdownStyle={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />
        )}
      </View>
    </View>
  );
};

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
    width: 'auto',
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