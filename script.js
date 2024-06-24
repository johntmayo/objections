const spreadsheetId = '2PACX-1vSDYEI6je2t4FCRXiK3GSuUQdx1VU1BT3L--Bmdh2nWyBZEqguuNJ1DXEbKbVL8SqrRXdfybfCTXZ-6';
let currentStep = 'issues';
let currentData = [];
let path = [];

function fetchData() {
    fetch(`https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?output=csv`)
        .then(response => response.text())
        .then(data => {
            currentData = parseCSV(data);
            displayNextStep('issues');
        })
        .catch(error => console.error('Error fetching data:', error));
}

function parseCSV(data) {
    const rows = data.split('\n').filter(row => row.trim() !== '');
    return rows.map(row => {
        const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/; // Split by comma not enclosed in quotes
        return row.split(regex).map(cell => cell.replace(/(^"|"$)/g, '')); // Remove surrounding quotes
    });
}

function displayNextStep(step, value = null) {
    currentStep = step;
    const contentDiv = document.getElementById('content');
    const homeButton = document.getElementById('home-button');
    const siteMapDiv = document.getElementById('site-map');
    contentDiv.innerHTML = ''; // Clear previous content

    let nextStepData = [];
    switch (step) {
        case 'issues':
            nextStepData = [...new Set(currentData.slice(1).map(row => row[0]))];
            homeButton.style.display = 'none'; // Hide home button on the first screen
            siteMapDiv.style.display = 'none'; // Hide site map on the first screen
            path = []; // Reset path on the first screen
            break;
        case 'sub-issues':
            nextStepData = [...new Set(currentData.filter(row => row[0] === value).map(row => row[1]))];
            homeButton.style.display = 'block'; // Show home button on subsequent screens
            siteMapDiv.style.display = 'block'; // Show site map on subsequent screens
            path.push(value);
            break;
        case 'objections':
            nextStepData = currentData.filter(row => row[1] === value).map(row => row[2]);
            path.push(value);
            break;
        case 'responses':
            const responseRow = currentData.find(row => row[2] === value);
            nextStepData = [
                { header: 'Topline Response', text: responseRow[4] },
                { header: 'Values Response', text: responseRow[5] },
                { header: 'Action Focused Response', text: responseRow[6] },
                { header: 'Contrast Response', text: responseRow[7] },
                { header: 'Attack Response', text: responseRow[8] }
            ];
            path.push(value);
            break;
    }

    if (step === 'objections') {
        const text = document.createElement('div');
        text.className = 'content';
        text.textContent = nextStepData[0];
        contentDiv.appendChild(text);

        const followUpText = document.createElement('div');
        followUpText.className = 'content';
        followUpText.innerHTML = '<strong>Ask follow-up questions to get more information before responding.</strong>';
        contentDiv.appendChild(followUpText);

        const button = document.createElement('button');
        button.textContent = 'Continue';
        button.onclick = () => displayNextStep('responses', nextStepData[0]);
        contentDiv.appendChild(button);
    } else if (step === 'responses') {
        nextStepData.forEach(item => {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'content';
            responseDiv.innerHTML = `<h4>${item.header}</h4><p>${item.text}</p>`;
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

    updateSiteMap();
}

function getNextStep(currentStep) {
    switch (currentStep) {
        case 'issues':
            return 'sub-issues';
        case 'sub-issues':
            return 'objections';
        case 'objections':
            return 'responses';
        default:
            return 'issues';
    }
}

function updateSiteMap() {
    const pathList = document.getElementById('path-list');
    pathList.innerHTML = '';
    path.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        pathList.appendChild(listItem);
    });
}

function goHome() {
    displayNextStep('issues');
}

document.addEventListener('DOMContentLoaded', fetchData);
