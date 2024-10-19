// Variables
const relatedWordsLocalStorageKey = "project-1-dictionary-api-key";
const thesaurusBaseUrl = "https://api.api-ninjas.com/v1/thesaurus?";

// Functions

function fetchRelatedWords(searchedWord) {
  const queryString =
    thesaurusBaseUrl +
    new URLSearchParams({
      word: searchedWord,
      "X-Api-Key": getThesaurusApiKey(),
    }).toString();

  fetch(queryString)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      populateModalContent(data);
    });
}

function populateModalContent(data) {
  modalDisplayElement.setAttribute("class", "columns card-content");
  modalDisplayElement.innerText = null;

  const synonyms = data.synonyms;
  const antonyms = data.antonyms;

  synonyms.sort();
  antonyms.sort();

  if (isValidList(synonyms) == false && isValidList(antonyms) === false) {
    modalDisplayElement.innerText = `Sorry, we couldn't find any synonyms or antonyms for ${data.word}`;
  }

  if (isValidList(synonyms)) {
    const synonymsColumn = createUnorderedList(synonyms, "Synonyms");
    modalDisplayElement.appendChild(synonymsColumn);
  }

  if (isValidList(antonyms)) {
    const antonymsColumn = createUnorderedList(antonyms, "Antonyms");
    modalDisplayElement.appendChild(antonymsColumn);
  }

  modalButtonWrapper.removeAttribute("hidden");
}

function isValidList(list) {
  const joinedListValues = list.join("");
  return joinedListValues != "" && list.length > 0;
}

function createUnorderedList(list, listTitle) {
  // Create wrapper div for list title and list
  const listWrapper = document.createElement("div");
  listWrapper.setAttribute("class", "column");

  // Create list title and append
  const listTitleDisplay = document.createElement("p");
  listTitleDisplay.setAttribute('class', 'related-words-title');
  listTitleDisplay.innerText = listTitle;
  listWrapper.appendChild(listTitleDisplay);

  // Create unordered list
  const unorderedList = document.createElement("ul");
  // Create list to collect already selected words
  const alreadySelectedWords = [];

  // Loop through list of words
  for (const stringValue of list) {
    // Check for repeat synonyms (can occur as quirk of api)
    if (alreadySelectedWords.includes(stringValue) == false && isValidWord(stringValue)) {
      // Create parent list element
      const anchor = document.createElement("a");
      anchor.classList.add('related-word-list-item')
      const listItem = document.createElement("li");
      // Create anchor tag to indicate click-ability
      // Set text as anchor's inner text and custom data-word attribute to word
      listItem.innerText = stringValue;
      anchor.setAttribute("data-word", stringValue);
      anchor.addEventListener('click', handleRelatedWordClicked);

      // append new elements to list
      anchor.appendChild(listItem);
      unorderedList.appendChild(anchor);

      // Add selected word to check list
      alreadySelectedWords.push(stringValue);
    }
  }

  // Add list o wrapper and return wrapper
  listWrapper.appendChild(unorderedList);

  return listWrapper;
}

function handleRelatedWordClicked(event){
  // From modalHandler.js
  closeModal();
  // From index.js
  handleWordClick(event);
}

// Utility methods for storing and retrieving giphy api key
function storeThesaurusAPIKey(apiKey) {
  localStorage.setItem(relatedWordsLocalStorageKey, apiKey);
}

function getThesaurusApiKey() {
  return localStorage.getItem(relatedWordsLocalStorageKey);
}
