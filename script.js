const spreadsheetId = '2PACX-1vSDYEI6je2t4FCRXiK3GSuUQdx1VU1BT3L--Bmdh2nWyBZEqguuNJ1DXEbKbVL8SqrRXdfybfCTXZ-6';
const range = 'Sheet1!A:I';

function fetchData() {
    fetch(`https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?output=csv`)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.split(','));
            displayIssues(rows);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayIssues(rows) {
    const issuesDiv = document.getElementById('issues');
    const uniqueIssues = [...new Set(rows.slice(1).map(row => row[0]))];
    uniqueIssues.forEach(issue => {
        const issueButton = document.createElement('button');
        issueButton.classList.add('collapsible');
        issueButton.textContent = issue;
        issueButton.onclick = () => displaySubIssues(issue, rows);
        issuesDiv.appendChild(issueButton);
    });
}

function displaySubIssues(issue, rows) {
    const subIssuesDiv = document.getElementById('sub-issues');
    subIssuesDiv.innerHTML = '';
    const filteredRows = rows.filter(row => row[0] === issue);
    const uniqueSubIssues = [...new Set(filteredRows.map(row => row[1]))];
    uniqueSubIssues.forEach(subIssue => {
        const subIssueButton = document.createElement('button');
        subIssueButton.classList.add('collapsible');
        subIssueButton.textContent = subIssue;
        subIssueButton.onclick = () => displayObjections(subIssue, filteredRows);
        subIssuesDiv.appendChild(subIssueButton);
    });
}

function displayObjections(subIssue, rows) {
    const objectionsDiv = document.getElementById('objections');
    objectionsDiv.innerHTML = '';
    const filteredRows = rows.filter(row => row[1] === subIssue);
    filteredRows.forEach(row => {
        const objectionButton = document.createElement('button');
        objectionButton.classList.add('collapsible');
        objectionButton.textContent = row[2];
        objectionButton.onclick = () => displayQuestion(row);
        objectionsDiv.appendChild(objectionButton);
    });
}

function displayQuestion(row) {
    const questionsDiv = document.getElementById('questions');
    questionsDiv.innerHTML = '';
    const questionButton = document.createElement('button');
    questionButton.classList.add('collapsible');
    questionButton.textContent = row[3];
    questionButton.onclick = () => displayResponse(row);
    questionsDiv.appendChild(questionButton);
}

function displayResponse(row) {
    const responsesDiv = document.getElementById('responses');
    responsesDiv.innerHTML = '';
    const responseTopline = document.createElement('div');
    responseTopline.classList.add('content');
    responseTopline.textContent = `Topline: ${row[4]}`;
    const responseValues = document.createElement('div');
    responseValues.classList.add('content');
    responseValues.textContent = `Values: ${row[5]}`;
    const responseActions = document.createElement('div');
    responseActions.classList.add('content');
    responseActions.textContent = `Actions: ${row[6]}`;
    const responseContrast = document.createElement('div');
    responseContrast.classList.add('content');
    responseContrast.textContent = `Contrast: ${row[7]}`;
    const responseAttack = document.createElement('div');
    responseAttack.classList.add('content');
    responseAttack.textContent = `Attack: ${row[8]}`;
    responsesDiv.appendChild(responseTopline);
    responsesDiv.appendChild(responseValues);
    responsesDiv.appendChild(responseActions);
    responsesDiv.appendChild(responseContrast);
    responsesDiv.appendChild(responseAttack);
}

function goHome() {
    document.getElementById('issues').innerHTML = '';
    document.getElementById('sub-issues').innerHTML = '';
    document.getElementById('objections').innerHTML = '';
    document.getElementById('questions').innerHTML = '';
    document.getElementById('responses').innerHTML = '';
    fetchData();
}

document.addEventListener('DOMContentLoaded', fetchData);
