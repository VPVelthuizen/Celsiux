// Defining some global variables. recents is the list of recent searches, city
// is the most recent one, searchButton and userInput are refering to html elements
let recents = JSON.parse(localStorage.getItem('recents')) || [];
const APIKey = "e7253f980b4694637e055d53daf00e63";
let city = recents[0] || "";
const userInput = document.getElementById('userInput');
const searchButton = document.getElementById('search-button');

// Function to render the recent searches
function renderRecent() {
    tracker.textContent = "";
    recents.forEach(search => {
        console.log(search);
        let Bearch = search.charAt(0).toUpperCase() + search.slice(1);
        console.log(Bearch);
        const searchElement = document.createElement('li');
        searchElement.textContent = Bearch;
        searchElement.classList.add('recent');
        tracker.appendChild(searchElement)
    });
};

// Function to retrieve data for weather report
function retrieve(city) {
    const queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;
    fetch(queryURL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const lat = data[0].lat;
            const lon = data[0].lon;
            const newURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=e7253f980b4694637e055d53daf00e63`;
            fetch(newURL)
                .then(response => response.json())
                .then(data => {
                    function dayReport(number) {
                        const day = number * 8;
                        document.getElementById(`temp${number}`).textContent = `Temp: ${(data.list[day].main.temp - 273.15).toFixed(2)}°C`;
                        document.getElementById(`wind${number}`).textContent = `Wind: ${data.list[day].wind.speed}mph`;
                        document.getElementById(`hum${number}`).textContent = `Humidity: ${data.list[day].main.humidity}%`;
                    };
                    for (let i = 0; i < 5; i++) {
                        dayReport(i);
                    };
                    document.getElementById(`temp5`).textContent = `${(data.list[39].main.temp - 273.15).toFixed(2)}°C`;
                    document.getElementById(`wind5`).textContent = `${data.list[39].wind.speed}mph`;
                    document.getElementById(`hum5`).textContent = `${data.list[39].main.humidity}%`;

                })
                .catch(error => console.error('Error fetching data:', error));
        })
        .catch(error => console.error('Error fetching data:', error));
    console.log(1);
}

// Load up recent searches upon page load
document.addEventListener('DOMContentLoaded', function () {
    renderRecent();
    document.getElementById("city").textContent = city;
    retrieve(city);
});

// Event listener for the search button being clicked
document.getElementById('search-button').addEventListener('click', function () {
    const current = userInput.value;
    recents.unshift(current);
    recents.splice(10);
    localStorage.setItem('recents', JSON.stringify(recents));
    let Bearch = current.charAt(0).toUpperCase() + current.slice(1);
    city = recents[0];
    document.getElementById("city").textContent = Bearch;
    console.log("something");
    renderRecent();
    retrieve(current)
    userInput.value = "";
    ;
})

// Event listener for the recent searches getting clicked
document.addEventListener('click', function (event) {
    console.log(event.target);
    // Check if the clicked element has the right class
    if (event.target.classList.contains('recent')) {
        console.log("here");
        const clickedText = event.target.textContent;
        document.getElementById('userInput').value = clickedText;
        // This part clicks on the search button after search bar value is updated
        searchButton.click();
    }
});