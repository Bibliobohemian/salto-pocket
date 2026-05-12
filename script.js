const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

const allBtn = document.getElementById("allBtn");
const favoritesBtn = document.getElementById("favoritesBtn");

let exhibitors = [];

let currentView = "all";

let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];

let visited =
  JSON.parse(localStorage.getItem("visited")) || [];

/* =========================
   FILTRI CATEGORIE
========================= */

const categoryFilters = {
  romance: false,
  fumetti: false,
  indipendenti: false,
  big: false
};

/* =========================
   LOAD DATA
========================= */

async function loadExhibitors(){

  const response = await fetch("data/exhibitors.json");

  exhibitors = await response.json();

  updateView();

}

/* =========================
   STORAGE
========================= */

function saveFavorites(){

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

}

function saveVisited(){

  localStorage.setItem(
    "visited",
    JSON.stringify(visited)
  );

}

/* =========================
   FAVORITES
========================= */

function toggleFavorite(name){

  if(favorites.includes(name)){

    favorites = favorites.filter(
      (fav) => fav !== name
    );

  } else {

    favorites.push(name);

  }

  saveFavorites();

  updateView();

}

/* =========================
   VISITED
========================= */

function toggleVisited(name){

  if(visited.includes(name)){

    visited = visited.filter(
      (item) => item !== name
    );

  } else {

    visited.push(name);

  }

  saveVisited();

  updateView();

}

/* =========================
   CATEGORY FILTERS
========================= */

function toggleCategory(category){

  categoryFilters[category] =
    !categoryFilters[category];

  const button =
    document.querySelector(
      `[data-category="${category}"]`
    );

  button.classList.toggle("active");

  updateView();

}

/* =========================
   FILTER LOGIC
========================= */

function applyFilters(items){

  const value =
    searchInput.value.toLowerCase();

  let filtered = items.filter((item) =>

    item.name.toLowerCase().includes(value) ||
    item.stand.toLowerCase().includes(value) ||
    item.hall.toLowerCase().includes(value)

  );

  if(categoryFilters.romance){

    filtered = filtered.filter(
      (item) => item.categories?.includes("romance")
    );

  }

  if(categoryFilters.fumetti){

    filtered = filtered.filter(
      (item) => item.categories?.includes("fumetti")
    );

  }

  if(categoryFilters.indipendenti){

    filtered = filtered.filter(
      (item) => item.categories?.includes("indipendenti")
    );

  }

  if(categoryFilters.big){

    filtered = filtered.filter(
      (item) => item.categories?.includes("big")
    );

  }

  return filtered;

}

/* =========================
   VIEW LOGIC
========================= */

function updateView(){

  let items = exhibitors;

  if(currentView === "favorites"){

    items = exhibitors.filter(
      (item) => favorites.includes(item.name)
    );

  }

  items = applyFilters(items);

  renderResults(items);

}

/* =========================
   RENDER
========================= */

function renderResults(items){

  results.innerHTML = "";

  if(items.length === 0){

    results.innerHTML = `
      <div class="card">
        <h2>Nessun risultato</h2>
      </div>
    `;

    return;

  }

  items.forEach((item) => {

    const isFavorite =
      favorites.includes(item.name);

    const isVisited =
      visited.includes(item.name);

    results.innerHTML += `

      <div class="card">

        <div class="card-top">

          <div>

            <h2>
              ${item.name}
            </h2>

            <p>
              <strong>${item.hall}</strong>
            </p>

            <p>
              Stand ${item.stand}
            </p>

            ${
              item.categories
              ? `
                <div class="tags">
                  ${item.categories.map(
                    (cat) =>
                      `<span class="tag">${cat}</span>`
                  ).join("")}
                </div>
              `
              : ""
            }

          </div>

          <div class="actions">

            <button
              class="visited-btn ${
                isVisited ? "active" : ""
              }"
              onclick="toggleVisited('${item.name}')"
            >
              ${isVisited ? "✅" : "☑️"}
            </button>

            <button
              class="favorite-btn ${
                isFavorite ? "active" : ""
              }"
              onclick="toggleFavorite('${item.name}')"
            >
              ${isFavorite ? "❤️" : "🤍"}
            </button>

          </div>

        </div>

      </div>

    `;

  });

}

/* =========================
   TOP FILTERS
========================= */

allBtn.addEventListener("click", () => {

  currentView = "all";

  allBtn.classList.add("active");
  favoritesBtn.classList.remove("active");

  updateView();

});

favoritesBtn.addEventListener("click", () => {

  currentView = "favorites";

  favoritesBtn.classList.add("active");
  allBtn.classList.remove("active");

  updateView();

});

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", () => {

  updateView();

});

/* =========================
   INIT
========================= */

loadExhibitors();
