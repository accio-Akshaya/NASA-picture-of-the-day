const API_KEY = 'LCc8yC3V8qH2zpKDNlqx2G9jEKIw2kwPOhuNCX2a';
const currentImageContainer = document.getElementById('current-image-container');
const searchHistory = document.getElementById('search-history');

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const date = document.getElementById('search-input').value;
    getImageOfTheDay(date);
});

document.addEventListener('DOMContentLoaded', () => {
    getCurrentImageOfTheDay();
    loadSearchHistory();
});

async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split('T')[0];
    getImageOfTheDay(currentDate);
}

function getImageOfTheDay(date) {
    fetchImage(date)
        .then(() => saveSearch(date))
        .catch(error => console.error('Error fetching image:', error));
}

async function fetchImage(date) {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`);
        const data = await response.json();

        if (data.code) {
            currentImageContainer.innerHTML = `<p>Error: ${data.msg}</p>`;
            return;
        }
        displayImage(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        currentImageContainer.innerHTML = '<p>Failed to load image. Please try again.</p>';
    }
}

function displayImage(data) {
    currentImageContainer.innerHTML = `
        <h2>${data.title}</h2>
        <img src="${data.url}" alt="${data.title}" style="max-width:100%; height:auto;"/>
        <p>${data.explanation}</p>
    `;
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
    loadSearchHistory();
}

function loadSearchHistory() {
    searchHistory.innerHTML = '';
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(date => addSearchToHistory(date));
}

function addSearchToHistory(date) {
    const listItem = document.createElement('li');
    listItem.textContent = date;
    listItem.addEventListener('click', () => getImageOfTheDay(date));
    searchHistory.appendChild(listItem);
}
