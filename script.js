const spreadsheetId = '2PACX-1vSDYEI6je2t4FCRXiK3GSuUQdx1VU1BT3L--Bmdh2nWyBZEqguuNJ1DXEbKbVL8SqrRXdfybfCTXZ-6';
const range = 'Sheet1!A:I';
let currentStep = 'issues';
let currentData = [];

function fetchData() {
    fetch(`https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?output=csv`)
        .then(response => response.text())
        .then(data => {
            currentData = data.split('\n').map(row => row.split(','));
            displayNextStep('issues');
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayNextStep(step, value = null) {
    currentStep = step;
    const contentDiv = document.getElementById('content');
    const homeButton = document.getElementById('home-button');
    contentDiv.innerHTML = ''; // Clear previous content

    let nextStepData = [];
    switch (step) {
        case 'issues':
            nextStepData = [...new Set(currentData.slice(1).map(row => row[0]))];
            homeButton.style.display = 'none'; // Hide home button on the first screen
            break;
        case 'sub-issues':
            nextStepData = [...new Set(currentData.filter(row => row[0] === value).map(row => row[1]))];
            homeButton.style.display = 'block'; // Show home button on subsequent screens
            break;
        case 'objections':
            nextStepData = currentData.filter(row => row[1] === value).map(row => row[2]);
            break;
        case 'questions':
            nextStepData = currentData.filter(row => row[2] === value).map(row => row[3]);
            break;
        case 'responses':
            const responseRow = currentData.find(row => row[3] === value);
            nextStepData = [
                `Topline: ${responseRow[4]}`,
                `Values: ${responseRow[5]}`,
                `Actions: ${responseRow[6]}`,
                `Contrast: ${responseRow[7]}`,
                `Attack: ${responseRow[8]}`
            ];
            break;
    }

    if (step === 'responses') {
        nextStepData.forEach(text => {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'content';
            responseDiv.textContent = text;
            contentDiv.appendChild(responseDiv);
        });
    } else {
        nextStepData.forEach(item => {
            const button = document.createElement('button');
            button.className = 'step-button';
            button.textContent = item;
            button.onclick = () => displayNextStep(getNextStep(step), item);
            contentDiv.appendChild(button);
        });
    }
}

function getNextStep(currentStep) {
    switch (currentStep) {
        case 'issues':
            return 'sub-issues';
        case 'sub-issues':
            return 'objections';
        case 'objections':
            return 'questions';
        case 'questions':
            return 'responses';
        default:
            return 'issues';
    }
}

function goHome() {
    displayNextStep('issues');
}

document.addEventListener('DOMContentLoaded', fetchData);
