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
   LOAD DATA
========================= */

async function loadExhibitors(){

  const response =
    await fetch("data/exhibitors.json");

  exhibitors =
    await response.json();

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
   FILTER LOGIC
========================= */

function applyFilters(items){

  const value =
    searchInput.value.toLowerCase();

  return items.filter((item) =>

    item.name.toLowerCase().includes(value) ||

    item.stand.toLowerCase().includes(value) ||

    item.hall.toLowerCase().includes(value) ||

    item.category.toLowerCase().includes(value)

  );

}

/* =========================
   VIEW LOGIC
========================= */

function updateView(){

  let items = exhibitors;

  if(currentView === "favorites"){

    items = exhibitors.filter(
      (item) =>
        favorites.includes(item.name)
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
              <strong>
                ${item.hall}
              </strong>
            </p>

            <p>
              Stand ${item.stand}
            </p>

            ${
              item.category
              ? `
                <div class="tags">

                  <span class="tag">
                    ${item.category}
                  </span>

                </div>
              `
              : ""
            }

            ${
              item.link
              ? `
                <p style="margin-top:10px;">

                  <a
                    href="${item.link}"
                    target="_blank"
                  >
                    Pagina espositore
                  </a>

                </p>
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

  favoritesBtn.classList.remove(
    "active"
  );

  updateView();

});

favoritesBtn.addEventListener(
  "click",
  () => {

    currentView = "favorites";

    favoritesBtn.classList.add(
      "active"
    );

    allBtn.classList.remove(
      "active"
    );

    updateView();

  }
);

/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
  "input",
  () => {

    updateView();

  }
);

/* =========================
   INIT
========================= */

loadExhibitors();
