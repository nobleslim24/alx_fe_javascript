// ✅ Load quotes from localStorage if available, else use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The day ended doesn't mean it's the the end", category: "Motivation" },
  { text: "To be or not to be.", category: "Philosophy" },
  { text: "Think different, Work smart", category: "Inspiration" }
];

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  document.getElementById("quote-text").innerHTML = randomQuote.text;
  document.getElementById("quote-category").innerHTML = randomQuote.category;

  // ✅ Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// ✅ Load last viewed quote from sessionStorage
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quote-text").innerHTML = quote.text;
    document.getElementById("quote-category").innerHTML = quote.category;
  }
}

// Form to add quotes
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
  addQuoteButton.id = "QuoteButton"; // ✅ fixed Id -> id
  addQuoteButton.textContent = "Add Quote";
  quoteFormContainer.appendChild(addQuoteButton);

  addQuoteButton.addEventListener("click", function () {
    let textValue = addNewQuoteTextInput.value.trim();
    let categoryValue = addNewQuoteCategoryInput.value.trim();

    if (textValue && categoryValue) {
      quotes.push({ text: textValue, category: categoryValue });
      saveQuotes(); // ✅ save new quote
      alert("Quote added successfully!");
      addNewQuoteTextInput.value = "";
      addNewQuoteCategoryInput.value = "";
    }
  });
}

// ✅ Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize app
createAddQuoteForm();
loadLastViewedQuote(); // ✅ show last viewed on reload
