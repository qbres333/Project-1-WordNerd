// Variables //
const modalButtonWrapper = document.getElementById('modal-button-wrapper');
const modalDisplayElement = document.getElementById('related-words-display');
const relatedWordsModalButton = document.getElementById(
  "related-words-modal-button"
);
const modalElement = document.getElementById("relatedWordsModal");
const modalBackground = document.querySelector(".modal-background");
const modalDeleteButton = document.querySelector("button.delete");
const modalBackButton = document.querySelector("a.button");

// Execution //

// Create listeners for modal opening and closing
relatedWordsModalButton.addEventListener("click", openModal);
modalBackground.addEventListener("click", closeModal);
modalDeleteButton.addEventListener("click", closeModal);
modalBackButton.addEventListener("click", closeModal);

// Source: https://bulma.io/documentation/components/modal/#javascript-implementation-example
document.addEventListener("keydown", (event) => { // Add a keydown event listener for the entire document
  if (event.key === "Escape") { // check if the pressed key is the escape key
    closeModal(); // if so, run the closeModal() function
  }
});

// Functions //
function openModal() {
  // Add the bulma 'is-active' class to the passed element
  modalElement.classList.add("is-active");
}

function closeModal() {
  // Remove the bulma 'is-active' class to the passed element
  modalElement.classList.remove("is-active");
}

function resetModal() {
  // Hide modal button and reset content
  modalButtonWrapper.setAttribute('hidden', 'true');
  modalDisplayElement.innerText = null;
}