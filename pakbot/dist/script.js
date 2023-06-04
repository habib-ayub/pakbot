// City recommendations for different cities in Pakistan
const cityRecommendations = {
  islamabad: ["Faisal Mosque", "Margalla Hills", "Rawal Lake"],
  lahore: ["Badshahi Mosque", "Lahore Fort", "Walled City of Lahore"],
  karachi: ["Clifton Beach", "Mohatta Palace", "Mazar-e-Quaid"],
  gilgit: ["Naltar Valley", "Fairy Meadows", "Hunza Valley"]
};

// Function to fetch city information from Wikipedia using the API
async function getCityInformation(city, attraction = null) {
  let url = `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`;
  if (attraction) {
    url = `https://en.wikipedia.org/api/rest_v1/page/summary/${attraction}`;
  }

  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    const extract = data.extract;
    if (extract) {
      return extract;
    }
  }
  return "Sorry, I couldn't find information about that city. Please try again.";
}

// Function to handle user queries
function handleQuery(userInput) {
  if (userInput.toLowerCase() === "help") {
    return `I can provide trip recommendations and tourist information about different cities in Pakistan. Just ask me!

You can interact with me by typing your queries or commands. Here are some examples of what you can ask:

- 'Can you recommend a place to visit in Islamabad?'
- 'Tell me more about Lahore.'
- 'What are the popular tourist attractions in Karachi?'
- 'What are the popular tourist attractions in Gilgit?'

You can also ask about specific tourist attractions within the cities. For example, 'Tell me about Faisal Mosque.'

You can type 'quit' to exit the tour guide.

How can I assist you today?`;
  } else if (userInput.toLowerCase() === "quit") {
    return "Goodbye! Enjoy your trip!";
  }

  for (const city in cityRecommendations) {
    if (new RegExp(`\\b${city}\\b`, "i").test(userInput)) {
      return getCityInformation(city);
    }

    const attractions = cityRecommendations[city];
    for (const attraction of attractions) {
      if (new RegExp(`\\b${attraction}\\b`, "i").test(userInput)) {
        return getCityInformation(city, attraction);
      }
    }
  }

  return "I'm sorry, I don't have an answer for that. Can you please try another query?";
}

// Get DOM elements
const userInputField = document.getElementById("user-input");
const submitButton = document.getElementById("submit-button");
const responseContainer = document.getElementById("chat-body");

// Function to add a message to the chat body
function addMessage(message, isBot) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `
    <div class="message-content">
      <p class="${isBot ? "bot-message" : "user-message"}">${message}</p>
    </div>
  `;
  responseContainer.appendChild(messageElement);

  // Scroll to the bottom of the chat body
  responseContainer.scrollTop = responseContainer.scrollHeight;
}

// Function to handle user input submission
async function handleSubmit() {
  const userInput = userInputField.value;

  // Add user message to the chat
  addMessage(userInput, false);

  // Clear the input field
  userInputField.value = "";

  // Handle the user query
  const response = await handleQuery(userInput);

  // Add bot message to the chat
  addMessage(response, true);
}

// Add event listener to the submit button
submitButton.addEventListener("click", handleSubmit);

// Add event listener to the input field for handling "Enter" key press
userInputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSubmit();
  }
});

// Initial bot messages
addMessage(
  "Welcome to the Pakistan Tour Guide! How can I assist you today?",
  true
);
addMessage(
  "I can provide information and recommendations about cities in Pakistan.",
  true
);
addMessage(
  "Here are the available cities: Islamabad, Karachi, Lahore, Gilgit.",
  true
);
addMessage("Type 'Help' for assistance or 'Quit' to exit.", true);