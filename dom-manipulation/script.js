// Initial quotes array
const quotes = [
  { text: "The day ended doesn't mean it's the end", category: "Motivation" },
  { text: "To be or not to be.", category: "Philosophy" },
  { text: "Think different, Work smart", category: "Inspiration" }
];

// Show a random quote from filtered array
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategoryFilter", selectedCategory);

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if(filteredQuotes.length > 0){
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    document.getElementById("quote-text").innerHTML = randomQuote.text;
    document.getElementById("quote-category").innerHTML = randomQuote.category;
  } else {
    document.getElementById("quote-text").innerHTML = "No quotes in this category";
    document.getElementById("quote-category").innerHTML = "";
  }
}

// Populate unique categories in dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const lastFilter = localStorage.getItem("lastCategoryFilter") || "all";
  categoryFilter.value = lastFilter;
}

// Add new quote
function addQuote() {
  const textValue = document.getElementById("AddNewQuote").value.trim();
  const categoryValue = document.getElementById("AddNewQuoteCategory").value.trim();
  if(textValue && categoryValue){
    quotes.push({ text: textValue, category: categoryValue });
    populateCategories();  // Refresh categories
    filterQuotes();       // Apply filter immediately
  }
}

// Create the Add Quote Form dynamically
function createAddQuoteForm() {
  const formContainer = document.querySelector(".dynamicFormContainer");

  const heading = document.createElement("h2");
  heading.textContent = "Add New Quote";
  formContainer.appendChild(heading);

  const quoteInput = document.createElement("input");
  quoteInput.id = "AddNewQuote";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter new quote";
  formContainer.appendChild(quoteInput);

  const categoryInput = document.createElement("input");
  categoryInput.id = "AddNewQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  formContainer.appendChild(categoryInput);

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);
  formContainer.appendChild(addButton);
}

// Initialize
populateCategories();
filterQuotes();
createAddQuoteForm();
