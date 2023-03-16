const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const format__select = document.getElementById("format");

function handleFormSubmit(event) {
  event.preventDefault();
  const url = `./search-results.html?q=${searchInput.value}&format=${format__select.value}`;
  location.replace(url);
}

searchForm.addEventListener("submit", handleFormSubmit);
