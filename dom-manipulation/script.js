// Load quotes from localStorage or default array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" }
];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  // Optional: store last displayed quote in sessionStorage
  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));

  document.getElementById("quoteDisplay").innerText =
    `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  displayRandomQuote();

  textInput.value = "";
  categoryInput.value = "";
}

// JSON Export function
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

// JSON Import function
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error();
      importedQuotes.forEach(q => {
        if (q.text && q.category) quotes.push(q);
      });
      saveQuotes();
      displayRandomQuote();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);

// Display last quote on load if available, else random quote
const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
if (lastQuote) {
  document.getElementById("quoteDisplay").innerText =
    `"${lastQuote.text}" — ${lastQuote.category}`;
} else {
  displayRandomQuote();
}
