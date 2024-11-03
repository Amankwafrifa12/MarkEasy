import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState('');
  const [repeatCount, setRepeatCount] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const addQuestions = () => {
    const entries = questionInput.split(',').map(entry => entry.trim());
    const newQuestions = entries.map(entry => {
      const [number, answer] = entry.split('.');
      if (number && answer) {
        return { id: Date.now() + Math.random(), number: number.trim(), answer: answer.trim() };
      } else {
        Alert.alert('Invalid format', 'Please enter questions in the format "1.A, 2.B, ..."');
        return null;
      }
    }).filter(entry => entry !== null);

    setQuestions([...questions, ...newQuestions]);
    setQuestionInput('');
  };

  const editQuestion = (id) => {
    const questionToEdit = questions.find((question) => question.id === id);
    setQuestionInput(`${questionToEdit.number}. ${questionToEdit.answer}`);
    setEditIndex(id);
  };

  const updateQuestion = () => {
    const updatedQuestions = questions.map((question) =>
      question.id === editIndex
        ? { ...question, number: questionInput.split('.')[0].trim(), answer: questionInput.split('.')[1].trim() }
        : question
    );

    setQuestions(updatedQuestions);
    setQuestionInput('');
    setEditIndex(null);
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const clearAllQuestions = () => {
    setQuestions([]);
  };

  const startReading = async () => {
    if (questions.length > 0) {
      setIsRunning(true);

      for (let i = 0; i < repeatCount; i++) {
        for (const { number, answer } of questions) {
          Speech.speak(`Number ${number}, ${answer}`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      setIsRunning(false);
    }
  };

  const incrementRepeatCount = () => setRepeatCount(prev => prev + 1);
  const decrementRepeatCount = () => setRepeatCount(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>MarkEasy</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {questions.map((item) => (
          <View key={item.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{`Q${item.number}: ${item.answer}`}</Text>
            <TouchableOpacity onPress={() => editQuestion(item.id)} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.bottomContainer}
      >
        <View style={styles.actionRow}>
          <TextInput
            placeholder="Enter question (e.g., 1.A, 2.B)"
            value={questionInput}
            onChangeText={setQuestionInput}
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={editIndex ? updateQuestion : addQuestions}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>{editIndex ? "Update" : "Add"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsRow}>
          <View style={styles.stepperContainer}>
            <TouchableOpacity onPress={decrementRepeatCount} style={styles.stepperButton}>
              <Text style={styles.stepperButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.repeatText}>{repeatCount}</Text>
            <TouchableOpacity onPress={incrementRepeatCount} style={styles.stepperButton}>
              <Text style={styles.stepperButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={startReading}
            style={[styles.startButton, isRunning && { backgroundColor: '#ddd' }]}
            disabled={isRunning || questions.length === 0}
          >
            <Text style={styles.startButtonText}>Start Reading</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clearAllQuestions}
            style={styles.clearButton}
            disabled={questions.length === 0}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    width: '100%',
    backgroundColor: 'purple',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  questionText: {
    flex: 1,
  },
  editButton: {
    paddingHorizontal: 10,
  },
  editButtonText: {
    color: 'blue',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'purple',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  stepperButton: {
    paddingHorizontal: 10,
  },
  stepperButtonText: {
    fontSize: 18,
    color: 'purple',
  },
  repeatText: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  startButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: 'green',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clearButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
