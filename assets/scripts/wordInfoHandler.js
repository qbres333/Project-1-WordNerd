// Variables

const searchInputEl = document.getElementById("searched-word");
const searchBtn = document.getElementById("search");
const wordInfoElement = document.getElementById("word-info");
const wordTitleEl = document.querySelector(".card-header-title");
const wordInfoLocalStorageKey = "project-1-word-info";

/* --------------------- Functions -------------------*/
// get word data from API
function fetchWordInfo(word) {
  //set the URL for the fetch function
  const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${getWordInfoApiKey()}`;

  // send HTTP request
  fetch(url)
    .then(function (response) {
      // if the request fails, show the JSON error. Otherwise, return the successful promise
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (wordData) {
      // empty array to store the different word elements we will retrieve
      const wordArray = [];

      for (const wordInfo of wordData) {

        if (typeof wordInfo === "object") {
          // conditions for successful search:
          // if searched word has homonyms OR searched word matches the API meta id
          if (
            wordInfo["meta"]["stems"][0] == word ||
            wordInfo["meta"]["id"] == word
          ) {
            // create word object to store word keys
            const wordObj = {};
            //hw = API identifier for the searched word
            wordObj["headword"] = wordInfo.hwi.hw.replace(/\*/gi, "");
            // retrieve word type (part of speech)
            wordObj["wordType"] = wordInfo.fl;
            // prs = API identifier for pronunciation

            wordObj["wordAudio"] = [];
            wordObj["pronunciation"] = []; // mw = Merriam-Webster format
            if ("prs" in wordInfo.hwi) {
              for (const prsValue of wordInfo.hwi.prs) {
                // mw = written pronunciation format
                if ("mw" in prsValue) {
                  wordObj["pronunciation"].push(prsValue.mw); // mw = Merriam-Webster format
                }
                // audio = verbal pronunciation, using audio link format
                if ("sound" in prsValue) {
                  wordObj["wordAudio"].push(
                    `https://media.merriam-webster.com/audio/prons/en/us/mp3/${word.charAt(
                      0
                    )}/${prsValue.sound.audio}.mp3`
                  );
                }
              }
            }
            // et = API identifier for etymology
            if ("et" in wordInfo) {
              wordObj["etymology"] = wordInfo.et[0][1].replace(
                /\{it\}|\{\/it\}|\{ma\}.*?\{\/ma\}|\{et_link\||\:.*?\}|\{dx_ety\}|\{dxt\||\{\/dx_ety\}|\{dx\}|\|\|\}|\{\/dx\}/g,
                ""
              );
            } else {
              wordObj["etymology"] = "see first entry";
            }
            // call function to retrieve all definitions and add the
            // entire word object to the array
            getDefinitions(wordInfo, wordObj);
            wordArray.push(wordObj);
          }
        }
      }

      //this checks that whether there are entries in the API for the input
      if (wordArray.length == 0) {
        const errorNotice = document.createElement("h3");
        errorNotice.innerText =
          "No results found. Please check spelling and try again.";
        wordInfoElement.appendChild(errorNotice);
      } else {
        // if word has an entry in the API, render the word info and clear the input field
        writeWordInfo(wordArray);
        const wordHeader = "Word Info for";
        wordTitleEl.textContent = `${wordHeader} ${word}`
      }
    });
}

// reset the section under "Word Info" title to blank
function resetWordInfo() {
  wordInfoElement.innerHTML = null;
}

// retrieve all definitions for the searched word
function getDefinitions(wordInfo, wordObj) {
  wordObj.definition = [];

  for (const definitionWrapper of wordInfo.def) {
    // wordInfo.def returns an array of objects
    if ("sseq" in definitionWrapper) {
      // If sseq is a key in the current object, loop
      // through returned array values
      for (const sseqArrayValue of definitionWrapper.sseq) {
        // for each array value, check if that value has an array
        // of its own. Then loop through that array
        // (which has a mixed array value)
        for (const mixedValueArray of sseqArrayValue) {
          // mixedValueArray has both strings and objects.
          // We want the objects only
          if (mixedValueArray[0] == "sense") {
            // dt returns an array of strings.
            // The first string is a signifier, the second
            // is the actual definition.
            const dt = mixedValueArray[1]["dt"];

            for (const dtArrayValue of dt) {
              // If first value in dtArray is string "text",
              // get value in second index
              if (dtArrayValue[0] == "text") {
                // regular expression created to remove excess notations for easier reading
                wordObj.definition.push(
                  dtArrayValue[1].replace(
                    /\{bc\}|\{dx_ety\}.*?\{\/dx_ety\}|\{dx_def\}.*?\{\/dx_def\}|\{.*?\||\|\|\}|\|.*?\}|\|\|.*?\}|\}|\{dxt\||\{dx\}|\{\/dx\}|\{it\}|\{\/it\}/g, "")
                );
              }
            }
          }
        }
      }
    }
  }
}
// render word details to the webpage
function writeWordInfo(wordArray) {
  const wordInfoDisplay = document.getElementById("word-info");
  // for every word found in the API, render a word card
  for (const wordInfo of wordArray) {
    const wordCard = createWordCard(wordInfo);
    wordInfoDisplay.appendChild(wordCard);
  }
}

// render word data to the webpage
function createWordCard(word) {
  const wordCard = document.createElement("div");
  wordCard.setAttribute("class", "card word-card");

  // Construct word type (POS = part of speech)
  const wordPOS = document.createElement("div");
  wordPOS.classList.add("word-type");
  wordPOS.innerHTML = `<span class='boldify'>Word Type</span>: ${word.wordType}`;
  wordCard.appendChild(wordPOS);

  // Construct pronunciation, written and audio

  if(word.pronunciation.length > 0){
    const wordPronunciation = document.createElement("div");
    wordPronunciation.classList.add("word-pronunciation");
    wordPronunciation.innerHTML = `<div class='boldify'>Pronunciation</div>`;
    // create list to store different pronunciations
    const pronunciationList = document.createElement('ul');
    
    // construct pronunciation list item(s)
    for (let i = 0; i < word.pronunciation.length; i++) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `${word.pronunciation[i]} (<a href="${word.wordAudio[i]}" target="_blank">Click to listen</a>)`;
      pronunciationList.appendChild(listItem)
    }
    
    // add pronunciation list items to word card
    wordPronunciation.appendChild(pronunciationList);
    wordCard.appendChild(wordPronunciation);
  }

  // Construct etymology
  const wordEtymology = document.createElement("div");
  wordEtymology.classList.add("word-etymology");
  wordEtymology.innerHTML = `<span class='boldify'>Etymology</span>: ${word.etymology}`;
  wordCard.appendChild(wordEtymology);

  // Construct definitions
  const definitionsWrapper = document.createElement("div");
  definitionsWrapper.innerHTML = "<span class='boldify'>Definition(s)</span>";
  const definitionUnorderedList = document.createElement("ul");

  // add each definition on the webpage as a list item
  for (const definition of word.definition) {
    const definitionListItem = document.createElement("li");
    definitionListItem.innerHTML = definition;
    definitionUnorderedList.appendChild(definitionListItem);
  }

  // append definition list to word card
  definitionsWrapper.appendChild(definitionUnorderedList);
  wordCard.appendChild(definitionsWrapper);

  return wordCard;
}

// function to enter the API key into the console
function storeWordInfoAPIKey(apiKey) {
  localStorage.setItem(wordInfoLocalStorageKey, apiKey);
}

// retrieve stored key, to be inserted into API url
function getWordInfoApiKey() {
  return localStorage.getItem(wordInfoLocalStorageKey);
}