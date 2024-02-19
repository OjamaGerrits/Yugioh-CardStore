// Define the value of each rarity type
const rarityValues = {
    common: 1,
    rare: 5,
    superRare: 10,
    ultraRare: 20,
    secretRare: 50
};

// Function to calculate currency based on card rarity and quantity
function calculateCurrency(rarity, quantity) {
    return rarityValues[rarity] * quantity;
}

// Function to update the displayed total currency
function updateCurrencyDisplay() {
    // Retrieve the current total from local storage, parse it to an integer
    var currentTotal = parseInt(localStorage.getItem('totalCurrency') || '0', 10);
    // Update the display with the new total
    document.getElementById('currencyTotal').textContent = 'Total Currency: ' + currentTotal;
}

// Event listener for the form submission
document.getElementById('cardForm').addEventListener('submit', function(event){
    event.preventDefault();

    var cardRarity = document.getElementById('cardRarity').value;
    var cardQuantityInput = document.getElementById('cardQuantity');
    var cardQuantity = parseInt(cardQuantityInput.value, 10);

    // Check if the input is blank or less than 0
    if (cardQuantityInput.value.trim() === '' || isNaN(cardQuantity) || cardQuantity < 0) {
        alert("Please enter a valid quantity to burn. The value must be 0 or more.");
        cardQuantityInput.value = ''; // Clear the input
        return; // Exit the function
    }

    var currencyValue = calculateCurrency(cardRarity, cardQuantity);
    
    document.getElementById('currencyValue').value = currencyValue;
    addCurrency(currencyValue); // Add the calculated currency to the total
});

// Function to add currency when a card is burned
function addCurrency(amount) {
    // Retrieve the current total from local storage, parse it to an integer
    let currentCurrency = parseInt(localStorage.getItem('totalCurrency') || '0', 10);

    // Add the amount
    currentCurrency += amount;

    // Update local storage with the new total
    localStorage.setItem('totalCurrency', currentCurrency.toString());
    updateCurrencyDisplay(); // Update the currency display
}

// Function to add or subtract currency
function modifyCurrency(isAdding) {
    const amountInput = document.getElementById('currencyAmount');
    const amount = parseInt(amountInput.value, 10); // Ensure this is a number

    // Check if the input is a number
    if (isNaN(amount)) {
        alert("Please enter a valid number for the currency amount.");
        amountInput.value = ''; // Clear the input
        return; // Exit the function
    }

    // Retrieve the current total from local storage, parse it to an integer
    let currentCurrency = parseInt(localStorage.getItem('totalCurrency') || '0', 10);

    // Add or subtract the amount based on the isAdding flag
    if (isAdding) {
        currentCurrency += amount;
    } else {
        // Prevent currency from going negative
        currentCurrency = Math.max(0, currentCurrency - amount);
    }

    // Update local storage with the new total
    localStorage.setItem('totalCurrency', currentCurrency.toString());
    updateCurrencyDisplay(); // Update the currency display

    amountInput.value = ''; // Clear the input after updating
}

// Initialize currency display from localStorage or to 0 if not set
window.onload = function() {
    updateCurrencyDisplay();
};

function resetCurrency() {
    // Reset the total currency to zero in local storage
    localStorage.setItem('totalCurrency', '0');
    // Update the currency display
    updateCurrencyDisplay();
}

// Assuming you already have rarityValues and your localStorage setup

// Cards available for purchase
const cardsForSale = [
    { name: 'Blue-Eyes White Dragon', cost: 50, imageUrl: 'blue-eyes.jpg' },
    { name: 'Dark Magician', cost: 50, imageUrl: 'dark-magician.jpg' },
    { name: 'Remove Trap', cost: 10, imageUrl: 'removetrap.jpg'},
    { name: 'Armed Ninja', cost: 10, imageUrl: 'armed-ninja.jpg'},
    { name: '7 Tools', cost: 100, imageUrl: '7-tools.jpg'},
    { name: 'Change Of Heart', cost: 150, imageUrl: 'change-of-heart.jpg'},
    { name: 'Dark Hole', cost: 100, imageUrl: 'dark-hole.jpg'},
    { name: 'Fissure', cost: 75, imageUrl: 'fissure.jpg'},
    { name: 'Hane-Hane', cost: 35, imageUrl: 'hane-hane.jpg'},
    { name: 'Horn of Heaven', cost: 75, imageUrl: 'horn-of-heaven.jpg'},
    { name: 'Man Eater Bug', cost: 100, imageUrl: 'man-eater-bug.jpg'},
    { name: 'Mirrorforce', cost: 125, imageUrl: 'mirrorforce.jpg'},
    { name: 'Monster Reborn', cost: 200, imageUrl: 'monster-reborn.jpg'},
    { name: 'Raigeki', cost: 200, imageUrl: 'raigeki.jpg'},
    { name: 'Reaper Of Cards', cost: 10, imageUrl: 'reaper-of-cards.jpg'},
    { name: 'Swords of Revealing Light', cost: 100, imageUrl: 'swords-of-revealing-light.jpg'},
    { name: 'Trap Hole', cost: 100, imageUrl: 'trap-hole.jpg'},
    // ... more cards
];

// User's collection
let userCollection = JSON.parse(localStorage.getItem('userCollection')) || {};

// Function to display cards for sale
function displayCardsForSale() {
    const cardsContainer = document.getElementById('cardsForSale');
    cardsContainer.innerHTML = ''; // Clear the container

    cardsForSale.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card'; // Add a class name to each card container
        cardElement.innerHTML = `
            <img src="images/${card.imageUrl}" alt="${card.name}">
            <p>${card.name}</p>
            <p>Cost: ${card.cost}</p>
            <button onclick="purchaseCard('${card.name}', ${card.cost})">Buy</button>
        `;
        cardsContainer.appendChild(cardElement);
    });
}

// Function to purchase a card
function purchaseCard(cardName, cardCost) {
    const currentCurrency = parseInt(localStorage.getItem('totalCurrency'), 10);

    // Check if the user has enough currency
    if (currentCurrency >= cardCost) {
        // Subtract the cost from the current currency
        localStorage.setItem('totalCurrency', currentCurrency - cardCost);
        updateCurrencyDisplay();

        // Add the card to the user's collection
        if (userCollection[cardName]) {
            userCollection[cardName] += 1; // Increment quantity if already owned
        } else {
            userCollection[cardName] = 1; // Add new card with quantity 1
        }

        // Update the collection in local storage
        localStorage.setItem('userCollection', JSON.stringify(userCollection));
        
        // Update the collection display
        displayUserCollection();
    } else {
        alert('Not enough currency to purchase this card.');
    }
}

// Function to display the user's collection
function displayUserCollection() {
    const collectionContainer = document.getElementById('cardCollection');
    collectionContainer.innerHTML = '<h2>Your Collection</h2>'; // Clear the container and add the header

    Object.keys(userCollection).forEach(cardName => {
        const cardElement = document.createElement('div');
        cardElement.innerHTML = `
            <p>${cardName}</p>
            <p>Quantity: ${userCollection[cardName]}</p>
        `;
        collectionContainer.appendChild(cardElement);
    });
}

// Call these functions to set up the page initially
displayCardsForSale();
displayUserCollection();

function resetCollection() {
    // Clear the userCollection object
    userCollection = {};
    // Update the collection in local storage
    localStorage.setItem('userCollection', JSON.stringify(userCollection));
    // Update the collection display
    displayUserCollection();
}

// Get the modal
var modal = document.getElementById("tutorialModal");

// Get the button that opens the modal
var btn = document.getElementById("tutorialButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
