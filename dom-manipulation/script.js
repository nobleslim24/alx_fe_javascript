// ✅ Load quotes from localStorage or defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The day ended doesn't mean it's the end", category: "Motivation" },
  { text: "To be or not to be.", category: "Philosophy" },
  { text: "Think different, Work smart", category: "Inspiration" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById("quote-text").innerHTML = randomQuote.text;
  document.getElementById("quote-category").innerHTML = randomQuote.category;

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Load last viewed
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quote-text").innerHTML = quote.text;
    document.getElementById("quote-category").innerHTML = quote.category;
  }
}

// Create Add Quote Form
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

  addQuoteButton.addEventListener("click", function () {
    let textValue = addNewQuoteTextInput.value.trim();
    let categoryValue = addNewQuoteCategoryInput.value.trim();

    if (textValue && categoryValue) {
      quotes.push({ text: textValue, category: categoryValue });
      saveQuotes();
      populateCategories();
      alert("Quote added successfully!");
      addNewQuoteTextInput.value = "";
      addNewQuoteCategoryInput.value = "";
    }
  });
}

// Export quotes
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

// Import quotes
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Populate Categories
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  let categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected
  const lastFilter = localStorage.getItem("selectedCategory");
  if (lastFilter) {
    categoryFilter.value = lastFilter;
    filterQuotes();
  }
}

// ✅ Filter Quotes
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    document.getElementById("quote-text").innerHTML = randomQuote.text;
    document.getElementById("quote-category").innerHTML = randomQuote.category;
  } else {
    document.getElementById("quote-text").innerHTML = "No quotes found in this category.";
    document.getElementById("quote-category").innerHTML = "";
  }
}

// ✅ Sync with server (mock via JSONPlaceholder)
async function syncWithServer() {
  const statusEl = document.getElementById("syncStatus");
  statusEl.textContent = "🔄 Syncing with server...";
  statusEl.className = "loading";

  try {
    // Simulate fetch from server
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await response.json();

    // Convert server data into quotes
    const serverQuotes = serverData.map(item => ({
      text: item.title,
      category: "Server"
    }));

    // Conflict resolution: server data overrides
    quotes = [...quotes, ...serverQuotes];
    saveQuotes();
    populateCategories();

    statusEl.textContent = "✅ Sync complete. Server data merged.";
    statusEl.className = "success";
  } catch (error) {
    statusEl.textContent = "❌ Sync failed. Check connection.";
    statusEl.className = "error";
    console.error(error);
  }
}

// Initialize app
createAddQuoteForm();
loadLastViewedQuote();
populateCategories();

// Optional: auto sync every 30 seconds
setInterval(syncWithServer, 30000);
