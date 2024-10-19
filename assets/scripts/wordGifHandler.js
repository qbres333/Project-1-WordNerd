// Variables
const localStorageKeyName = "project-1-giphy-api-key";
const giphyBaseURL = "https://api.giphy.com/v1/gifs/search?";
const embedSlot = document.getElementById("gif-embed-slot");

// Functions
function fetchWordGif(word) {
  // Create callout string
  const queryString =
    giphyBaseURL +
    new URLSearchParams({
      api_key: getGiphyApiKey(),
      q: word,
      limit: 50,
      rating: "pg-13",
      lang: "en",
    }).toString();

  // Make callout
  fetch(queryString)
    .then((response) => {
      // Format infoStream to Json
      return response.json();
    })
    .then(function (data) {
      // Create list for returned gif links
      const availableGifEmbedLinks = [];

      // Populate list with embed urls from returned data
      for (const gif of data.data) {
        availableGifEmbedLinks.push(gif.embed_url);
      }

      // Get random index from available links
      const randomIndex = getRandomInteger(availableGifEmbedLinks.length);

      // Render selected gif embed link
      renderGif(availableGifEmbedLinks[randomIndex]);
    });
}

function renderGif(gifEmbedLink) {
  // Clear default text of embedSlot (provided by index.js)
  embedSlot.innerText = "";
  
  // Create new element
  let gifElement;

  if(gifEmbedLink == null){
    gifElement = document.createElement("p");
    gifElement.innerHTML = `Sorry, we couldn't find any gifs for that word`
  }
  else {
  
    // Create new embed element and populate with link
    gifElement = document.createElement("embed");
    gifElement.src = gifEmbedLink;
    gifElement.height = "100%";
    gifElement.width = "100%";
  
    // Append to render
  }

  embedSlot.appendChild(gifElement);
}

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInteger(items) {
  return Math.floor(Math.random() * items);
}

// Utility methods for storing and retrieving giphy api key
function storeGiphyApiKey(apiKey) {
  localStorage.setItem(localStorageKeyName, apiKey);
}

function getGiphyApiKey() {
  return localStorage.getItem(localStorageKeyName);
}

function resetGif() {
  // Reset gif
  embedSlot.innerHTML = null;
}
