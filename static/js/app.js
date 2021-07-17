// from data.js
var tableData = data;

// Table body reference
var tbody = d3.select('tbody');

// Table with new rows of data appended to the website/HTML for each UFO sighting

// Adding table to the HTML
tableData.forEach(function(UFOSighting){
    
    var row = tbody.append('tr');

    Object.entries(UFOSighting).forEach(function([key, value]){
        var cell = row.append('td');
        cell.text(value);
    });
});

var button = d3.select('#filter-btn');

// Select the form 
var form = d3.select('.form-group');

// Create event handlers
button.on('click', runEnter);
form.on('submit', runEnter);

// Create an event listener
function runEnter() {
    // Clear existing table
    tbody.html("");
    
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the user input location
    var inputElement = d3.select('#datetime');

    // Get the value from the input
    var inputValue = inputElement.property('value');

    // Filter the user input
    var filteredInput = tableData.filter(data => data.datetime === inputValue);
    
    filteredInput.forEach(function(dateSelection){
    
        var row = tbody.append('tr');

        Object.entries(dateSelection).forEach(function([key, value]){
            var cell = row.append('td');
            cell.text(value);
        });
    });

};
