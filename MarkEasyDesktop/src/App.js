import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
    const [questions, setQuestions] = useState([]);
    const [questionInput, setQuestionInput] = useState('');
    const [repeatCount, setRepeatCount] = useState(1);
    const [isRunning, setIsRunning] = useState(false);

    const addQuestions = () => {
        const entries = questionInput.split(',').map((entry) => entry.trim());
        const newQuestions = entries.map((entry) => {
            const [number, answer] = entry.split('.');
            if (number && answer) {
                return { id: Date.now() + Math.random(), number: number.trim(), answer: answer.trim() };
            } else {
                alert('Invalid format. Use "1.A, 2.B, ..."');
                return null;
            }
        }).filter(entry => entry !== null);

        setQuestions([...questions, ...newQuestions]);
        setQuestionInput('');
    };

    const startReading = async () => {
        if (questions.length > 0) {
            setIsRunning(true);

            for (let i = 0; i < repeatCount; i++) {
                for (const { number, answer } of questions) {
                    const message = new SpeechSynthesisUtterance(`Number ${number}, ${answer}`);
                    window.speechSynthesis.speak(message);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }

            setIsRunning(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>MarkEasy Desktop</h1>

            <textarea
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Enter questions (e.g., 1.A, 2.B)"
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <button onClick={addQuestions}>Add Questions</button>

            <div style={{ marginTop: '20px' }}>
                {questions.map((q, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                        Q{q.number}: {q.answer}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px' }}>
                <button onClick={() => setRepeatCount((prev) => prev + 1)}>+</button>
                <span style={{ margin: '0 10px' }}>{repeatCount}</span>
                <button onClick={() => setRepeatCount((prev) => (prev > 1 ? prev - 1 : 1))}>-</button>
            </div>

            <button onClick={startReading} disabled={isRunning}>
                {isRunning ? 'Reading...' : 'Start Reading'}
            </button>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
