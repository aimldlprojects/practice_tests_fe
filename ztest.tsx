import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity } from 'react-native';

const App = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [questionType, setQuestionType] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [answerStatus, setAnswerStatus] = useState('');
    const [score, setScore] = useState('');
    const [questionNumber, setQuestionNumber] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    const fetchQuestion = async () => {
        try {
            // Replace with your actual API endpoint and question fetching logic
            const response = await fetch('http://127.0.0.1:8000/get_random_question');
            const data = await response.json();
            setQuestion(data.question);
            setOptions(data.options);
            setQuestionType(data.question_type);
            // Assuming question_number and total_questions are provided in the API response
            setQuestionNumber(data.question_number);
            setTotalQuestions(data.total_questions);
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const handleOptionSelect = (option) => {
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
            const response = await fetch('http://127.0.0.1:8000/check_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: question, answer: answer }),
            });
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

    useEffect(() => {
        fetchQuestion();
    }, []);

    return (
        <View style={styles.container}>
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

return (
    <View style={styles.container}>
        {/* ... your component JSX */}
    </View>
);
}
});

export default App;