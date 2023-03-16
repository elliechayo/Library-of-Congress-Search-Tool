const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const format__select = document.getElementById("format");
const resultTitle = document.getElementById("resultTitle");
const resultCards = document.getElementById("resultCards");

async function getResults(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
}

function createResultCard({ title, date, desc, subject, url, originalFormat }) {
  let div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `<small>Format: ${originalFormat}</small>
    <h3>${title}</h3>
    <p>Date: ${date}</p>
    <p>Subject: ${subject}</p>
    <p>Description: ${desc}</p>
    <a href=${url} target="_blank">Read More</a>`;
  return div;
}

async function fetchAndUpdateUI(query, format) {
  resultTitle.innerText = query;
  searchInput.value = query;
  format__select.value = format;

  // create url and make API request
  let apiUrl = null;
  if (format.trim()) {
    apiUrl = `https://www.loc.gov/${format}/?q=${query}&fo=json`;
  } else {
    apiUrl = `https://www.loc.gov/search/?q=${query}&fo=json`;
  }
  resultCards.innerHTML = "Loading...";
  const { results } = await getResults(apiUrl);
  resultCards.innerHTML = "";
  if (!results) {
    alert("Something went wrong");
    return;
  }
  for (let i = 0; i < results.length; i++) {
    let {
      title,
      date,
      description,
      subject,
      url,
      original_format: originalFormat,
    } = results[i];
    if (subject) subject = subject.join(", ");
    else subject = "-";
    if (originalFormat) originalFormat = originalFormat.join(" | ");
    else originalFormat = "-";
    let card = createResultCard({
      title,
      date,
      desc: description,
      subject,
      url,
      originalFormat,
    });
    resultCards.append(card);
  }
}

async function main() {
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");
  const format = searchParams.get("format");
  await fetchAndUpdateUI(query, format);
}

async function handleFormSubmit(event) {
  event.preventDefault();
  //   const url = `./search-results.html?q=${searchInput.value}&format=${format__select.value}`;
  //   location.replace(url);
  await fetchAndUpdateUI(searchInput.value, format__select.value);
}

searchForm.addEventListener("submit", handleFormSubmit);
window.addEventListener("DOMContentLoaded", main);
