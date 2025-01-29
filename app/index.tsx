import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity } from 'react-native';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [questionType, setQuestionType] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState('');
  const [score, setScore] = useState('');
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    // Fetch users
    fetch('http://127.0.0.1:8000/get_users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  interface UserSelectHandler {
    (user: string): void;
  }

  const handleUserSelect: UserSelectHandler = (user) => {
    setSelectedUser(user);
    fetchSubjects(user);
  };

  interface SubjectResponse {
    subject: Subject[];
  }

  const fetchSubjects = async (user: string): Promise<void> => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_subjects?user=${user}`);
      const data: SubjectResponse = await response.json();
      setSubjects(data.subject);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  interface User {
    id: string;
    name: string;
  }

  interface Subject {
    id: string;
    name: string;
  }

  interface Topic {
    id: string;
    name: string;
  }

  interface Question {
    question: string;
    options: string[];
    question_type: string;
    test_status: string;
    question_number: number;
    total_questions: number;
  }

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    fetchTopics(selectedUser, subject);
  };

  interface TopicResponse {
    topic: Topic[];
  }

  const fetchTopics = async (user: string, subject: string): Promise<void> => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_topics?user=${user}&subject=${subject}`);
      const data: TopicResponse = await response.json();
      setTopics(data.topic);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleTopicSelect = (topic: string): void => {
    setSelectedTopic(topic);
    fetchQuestion();
  };

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_questions?user=<span class="math-inline">\{selectedUser\}&subject\=</span>{selectedSubject}&topic=${selectedTopic}`);
      const data = await response.json();
      setQuestion(data.question);
      setOptions(data.options);
      setQuestionType(data.question_type);
      setTestStatus(data.test_status);
      setQuestionNumber(data.question_number);
      setTotalQuestions(data.total_questions);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  interface OptionSelectHandler {
    (option: string): void;
  }

  const handleOptionSelect: OptionSelectHandler = (option) => {
    if (questionType === 'mcq') {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter(o => o !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    } else {
      setUserAnswer(option);
    }
  };

  const handleSubmit = async () => {
    let answer;
    if (questionType === 'mcq') {
      answer = selectedOptions.join(',');
    } else {
      answer = userAnswer;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/check_answer?user=<span class="math-inline">\{selectedUser\}&subject\=</span>{selectedSubject}&topic=<span class="math-inline">\{selectedTopic\}&answer\=</span>{answer}`);
      const data = await response.json();
      setAnswerStatus(data.answer_status);
      setScore(data.score);

      if (testStatus === 'completed') {
        Alert.alert('Congratulations!', 'You have completed the test!');
      } else {
        // Delay before fetching next question
        setTimeout(() => {
          fetchQuestion();
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* User Selection */}
      <Text>Select User:</Text>
      <View style={styles.dropdown}>
        {users.map(user => (
          <TouchableOpacity key={user} onPress={() => handleUserSelect(user)}>
            <Text style={styles.dropdownItem}>{user}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Subject Selection */}
      <Text>Select Subject:</Text>
      <View style={styles.dropdown}>
        {subjects.map(subject => (
          <TouchableOpacity key={subject.id} onPress={() => handleSubjectSelect(subject.name)}>
            <Text style={styles.dropdownItem}>{subject.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Topic Selection */}
      <Text>Select Topic:</Text>
      <View style={styles.dropdown}>
        {topics.map(topic => (
          <TouchableOpacity key={topic.id} onPress={() => handleTopicSelect(topic.name)}>
            <Text style={styles.dropdownItem}>{topic.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Question Display */}
      <Text style={styles.question}>{question}</Text>

      {/* Options Display */}
      {questionType === 'mcq' && (
        <View>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => handleOptionSelect(option)}
              style={[styles.option, selectedOptions.includes(option) && styles.selectedOption]}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {questionType === 'fill_in_the_blank' && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter your answer"
            onChangeText={setUserAnswer}
            value={userAnswer}
          />
        </View>
      )}

      {questionType === 'true_or_false' && (
        <View>
          <TouchableOpacity onPress={() => handleOptionSelect('True')}>
            <Text>True</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionSelect('False')}>
            <Text>False</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Submit Button */}
      <Button title="Submit" onPress={handleSubmit} />

      {/* Results Display */}
      <Text>Answer Status: {answerStatus}</Text>
      <Text>Score: {score}</Text>
      <Text>Question: {questionNumber} of {totalQuestions}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  dropdown: {
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  question: {
    fontSize: 20,
    marginBottom: 15,
  },
  option: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#ccc',
  },
  input: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
});

export default App;