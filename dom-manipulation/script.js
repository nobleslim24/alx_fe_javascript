const quotes = [
  { text: "The day ended doesn't mean it's the end", category: "Motivation" },
  { text: "To be or not to be.", category: "Philosophy" },
  { text: "Think different, Work smart", category: "Inspiration" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById("quote-text").innerHTML = randomQuote.text;
  document.getElementById("quote-category").innerHTML = randomQuote.category;
}

function createAddQuoteForm() {
  let quoteFormContainer = document.querySelector(".quoteFormContainer");

  const formheading = document.createElement("h2");
  formheading.textContent = "Add new Quote";
  quoteFormContainer.appendChild(formheading);

  const addNewQuoteTextInput = document.createElement("input");
  addNewQuoteTextInput.id = "AddNewQuote";
  addNewQuoteTextInput.type = "text";
  addNewQuoteTextInput.placeholder = "Add new Quote";
  quoteFormContainer.appendChild(addNewQuoteTextInput);

  const addNewQuoteCategoryInput = document.createElement("input");
  addNewQuoteCategoryInput.id = "AddNewQuoteCategory";
  addNewQuoteCategoryInput.type = "text";
  addNewQuoteCategoryInput.placeholder = "Add Category";
  quoteFormContainer.appendChild(addNewQuoteCategoryInput);

  const addQuoteButton = document.createElement("button");
  addQuoteButton.id = "QuoteButton";
  addQuoteButton.textContent = "Add Quote";
  quoteFormContainer.appendChild(addQuoteButton);

  addQuoteButton.addEventListener("click", function() {
    let textValue = addNewQuoteTextInput.value.trim();
    let categoryValue = addNewQuoteCategoryInput.value.trim();
    if (textValue && categoryValue) {
      quotes.push({ text: textValue, category: categoryValue });
      addNewQuoteTextInput.value = "";
      addNewQuoteCategoryInput.value = "";
    }
  });
}

createAddQuoteForm();
