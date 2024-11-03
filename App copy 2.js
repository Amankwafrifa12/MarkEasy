import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState('');
  const [repeatCount, setRepeatCount] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Parse and add multiple questions to the list
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

  // Delete a specific question
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  // Clear all questions
  const clearAllQuestions = () => {
    setQuestions([]);
  };

  // Function to start reading the questions and answers
  const startReading = async () => {
    if (questions.length > 0) {
      setIsRunning(true);

      for (let i = 0; i < repeatCount; i++) {
        for (const { number, answer } of questions) {
          Speech.speak(`Number ${number}, ${answer}`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
        }
      }

      setIsRunning(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TextInput
          placeholder="Enter questions (e.g., 1.A, 2.B, 3.C)"
          value={questionInput}
          onChangeText={setQuestionInput}
          onSubmitEditing={addQuestions}
          style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        />
        <Button title="Add Questions" onPress={addQuestions} />

        <TextInput
          placeholder="Repeat count"
          keyboardType="numeric"
          value={String(repeatCount)}
          onChangeText={(text) => setRepeatCount(parseInt(text) || '')}
          style={{ borderWidth: 1, marginTop: 10, padding: 10 }}
        />

        <Button
          title="Start Reading"
          onPress={startReading}
          disabled={isRunning || questions.length === 0}
        />

        <Button
          title="Clear All Questions"
          onPress={clearAllQuestions}
          color="red"
          disabled={questions.length === 0}
        />

        {questions.map((item) => (
          <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <Text style={{ flex: 1 }}>{`Q${item.number}: ${item.answer}`}</Text>
            <TouchableOpacity onPress={() => deleteQuestion(item.id)} style={{ paddingHorizontal: 10 }}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
