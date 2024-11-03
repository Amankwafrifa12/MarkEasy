function startMarking() {
    // Get input values
    const inputText = document.getElementById('questions').value;
    const repetitions = parseInt(document.getElementById('repetitions').value, 10);
    const delay = 2000; // Set delay to 2 seconds between each mention
    const repetitionDelay = 5000; // Set delay to 5 seconds between repetitions

    // Check for valid input
    if (!inputText) {
        alert("Please enter questions and answers.");
        return;
    }
    if (repetitions < 1) {
        alert("Please set a valid number of repetitions.");
        return;
    }

    // Parse the input text to get question-answer pairs
    const questionPairs = inputText.split(',').map(item => item.trim());

    // Loop through repetitions and speak each question-answer pair with delay
    for (let i = 0; i < repetitions; i++) {
        questionPairs.forEach((pair, index) => {
            setTimeout(() => {
                // Format the text to mention question numbers as is in the input
                const formattedText = `Number ${pair}`; // Use the original input format
                speak(formattedText); // Speak the formatted text
            }, index * delay + i * questionPairs.length * delay + i * repetitionDelay); // Calculate total delay for each repetition
        });
    }
}

// Function to use Web Speech API for speaking text
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}
