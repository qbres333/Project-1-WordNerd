// Variables
const searchInput = document.getElementById("searched-word");
const searchButton = document.getElementById("search");
const invalidWordNotice = document.getElementById('invalid-word-notice');
const searchedWordsLocalStorageKey = 'searched-words';
const searchHistoryDropdownWrapper = document.getElementById('dropdown-wrapper');
const searchHistoryDropdownMenu = document.getElementById('dropdown-menu');
const searchHistoryDropdownContent = document.getElementById('search-history-dropdown-content');

// Execution
searchButton.addEventListener("click", handleSearch);
searchInput.addEventListener('mouseover', showDropDown);
searchInput.addEventListener('mouseout', hideDropDown);
searchInput.addEventListener('keydown', handleKeyDownInInput);
searchHistoryDropdownMenu.addEventListener('mouseover', showDropDown);
searchHistoryDropdownMenu.addEventListener('mouseout', hideDropDown);

document.addEventListener('DOMContentLoaded', updateSearchHistoryDropdownContent(retrieveSearchedWords()))

// Functions
function handleSearch(event) {
  const searchedWord = searchInput.value.toLowerCase().trim();

  if(isValidWord(searchedWord)){
    storeSearchedWord(searchedWord);
    hideInvalidWordNotice();
    resetPage();
    fetchWordInfo(searchedWord);
    fetchRelatedWords(searchedWord);
    fetchWordGif(searchedWord);
  }
  else {
    displayInvalidWordNotice();
  }
}

// Allow search on keydown of "enter" key, otherwise show dropdown content
function handleKeyDownInInput(event){
  const key = event.code
  if(key == 'Enter'){
    hideDropDown();
    handleSearch();
  }
  if(key == 'Escape'){
    hideDropDown();
  }
  else {
    showDropDown();
  }
}

// Sets the dropdown component to have is-active class, rendering the dropdown content
function showDropDown(){
  searchHistoryDropdownWrapper.classList.add('is-active');
}

// Removes the is-active class from the dropdown component, hiding the dropdown content
function hideDropDown(){
  searchHistoryDropdownWrapper.classList.remove('is-active');
}

// Reset page elements between new word searches
function resetPage() {
  resetModal();
  resetGif();
  resetWordInfo();
}

// Validates that typed word uses only letters, hyphens, and apostraphes
function isValidWord(word){
  if(word.length > 0){
    // Regex pattern derived from modification of pattern
    // provided here: https://regex101.com/r/caXjPb/1
    const pattern = /^(?:[a-z-']{2,}|-?)$/;
  
    return pattern.test(word);
  }
  else {
    return false;
  }
}

// Removes 'hidden' attribute from invalid word notice element
function displayInvalidWordNotice(){
  invalidWordNotice.removeAttribute('hidden');
}

// Adds 'hidden' attribute from invalid word notice element
function hideInvalidWordNotice(){
  invalidWordNotice.setAttribute('hidden', 'true');
}

// Stores searched word in word-history in localStorage
function storeSearchedWord(word){

  const searchHistory = retrieveSearchedWords();
  // Add searched word to storage list
  searchHistory.unshift(word);

  // Remove any repeated searches
  let indexToRemove;

  for (let i = 1; i < searchHistory.length; i++) {
    const pastWord = searchHistory[i];

    if(word == pastWord){
      indexToRemove = i;
    }
  }

  if(indexToRemove != undefined){
    searchHistory.splice(indexToRemove, 1);
  }

  // Render dropdown content
  updateSearchHistoryDropdownContent(searchHistory);

  // Set local storage to updated list
  localStorage.setItem(searchedWordsLocalStorageKey, JSON.stringify(searchHistory));
}

// Sets dropdown's content (list items) via passed word list
function updateSearchHistoryDropdownContent(searchHistory){
  // Clear content
  searchHistoryDropdownContent.innerHTML = null;

  const newSearchHistory = [];

  // Loop through word list, creating anchor element for each
  for(const word of searchHistory){
    const anchor = document.createElement('a');
    anchor.setAttribute('href', '#');
    anchor.setAttribute('class', 'dropdown-item');
    anchor.innerText = word;
    newSearchHistory.push(anchor);
  }

  // If words present, append elements and add event listeners
  if(newSearchHistory.length > 0){
    for(const anchorElement of newSearchHistory){
      anchorElement.addEventListener('click', handleWordClick);
      searchHistoryDropdownContent.appendChild(anchorElement);
    }
  }
  // If list empty, create message for user
  else {
    const noSearchHistoryElement = document.createElement('div');
    noSearchHistoryElement.setAttribute('class', 'dropdown-item');
    noSearchHistoryElement.innerText = 'No search history found'
    searchHistoryDropdownContent.appendChild(noSearchHistoryElement);
  }
}

// Triggers search function on click of word
function handleWordClick(event){
  event.stopPropagation();
  const word = event.target.innerText;
  searchInput.value = word;
  hideDropDown();
  handleSearch(null);
}

// Return local
function retrieveSearchedWords(){
    // Retrieve local storage
    const localStorageWords = localStorage.getItem(searchedWordsLocalStorageKey);
    // Verify local storage is valid and array
    const localStorageWordsValid = (localStorageWords != null && localStorageWords.includes('[')); 
    // Return json parsed local storage if valid, otherwise empty array
    return localStorageWordsValid ? JSON.parse(localStorageWords) : [];
}
