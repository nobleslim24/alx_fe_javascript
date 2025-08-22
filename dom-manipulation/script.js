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
  document.getElementById("quote-text").innerText = randomQuote.text;
  document.getElementById("quote-category").innerText = randomQuote.category;

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Load last viewed
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quote-text").innerText = quote.text;
    document.getElementById("quote-category").innerText = quote.category;
  }
}

// ✅ Fetch quotes from server (mock)
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const serverData = await response.json();
  return serverData.map(item => ({
    text: item.title,
    category: "Server"
  }));
}

// ✅ Post quote to server (mock)
async function postQuoteToServer(quote) {
  await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote)
  });
}

// ✅ Sync quotes (with conflict resolution)
async function syncQuotes() {
  const statusEl = document.getElementById("syncStatus");
  statusEl.textContent = "🔄 Syncing with server...";

  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Conflict resolution: server data overrides
    const localTextSet = new Set(quotes.map(q => q.text));
    const merged = [...quotes];

    serverQuotes.forEach(sq => {
      if (!localTextSet.has(sq.text)) {
        merged.push(sq);
      }
    });

    quotes = merged;
    saveQuotes();
    populateCategories();

    statusEl.textContent = "✅ Sync complete. Server data merged.";
  } catch (error) {
    statusEl.textContent = "❌ Sync failed. Check connection.";
    console.error(error);
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

  addQuoteButton.addEventListener("click", async function () {
    let textValue = addNewQuoteTextInput.value.trim();
    let categoryValue = addNewQuoteCategoryInput.value.trim();

    if (textValue && categoryValue) {
      const newQuote = { text: textValue, category: categoryValue };
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      alert("Quote added successfully!");

      // Also send to server
      await postQuoteToServer(newQuote);

      addNewQuoteTextInput.value = "";
      addNewQuoteCategoryInput.value = "";
    }
  });
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
    document.getElementById("quote-text").innerText = randomQuote.text;
    document.getElementById("quote-category").innerText = randomQuote.category;
  } else {
    document.getElementById("quote-text").innerText = "No quotes found in this category.";
    document.getElementById("quote-category").innerText = "";
  }
}

// ✅ Initialize app
createAddQuoteForm();
loadLastViewedQuote();
populateCategories();

// Auto sync every 30s
setInterval(syncQuotes, 30000);
