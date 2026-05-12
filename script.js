const searchInput =
  document.getElementById("searchInput");

const clearSearchBtn =
  document.getElementById("clearSearchBtn");

const results =
  document.getElementById("results");

const allBtn =
  document.getElementById("allBtn");

const favoritesBtn =
  document.getElementById("favoritesBtn");

const visitedBtn =
  document.getElementById("visitedBtn");

const sortSelect =
  document.getElementById("sortSelect");

const favoritesCount =
  document.getElementById("favoritesCount");

const visitedCount =
  document.getElementById("visitedCount");

let exhibitors = [];

let currentView = "all";

let quickFilter = "";

let favorites =
  JSON.parse(
    localStorage.getItem("favorites")
  ) || [];

let visited =
  JSON.parse(
    localStorage.getItem("visited")
  ) || [];

/* =========================
   LOAD
========================= */

async function loadExhibitors(){

  const response =
    await fetch("data/exhibitors.json");

  exhibitors =
    await response.json();

  exhibitors =
    exhibitors.filter(item =>
      item.name &&
      item.hall &&
      item.stand
    );

  updateCounters();

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
   COUNTERS
========================= */

function updateCounters(){

  favoritesCount.innerText =
    favorites.length;

  visitedCount.innerText =
    visited.length;

}

/* =========================
   FAVORITES
========================= */

function toggleFavorite(name){

  if(favorites.includes(name)){

    favorites =
      favorites.filter(
        fav => fav !== name
      );

  } else {

    favorites.push(name);

  }

  saveFavorites();

  updateCounters();

  updateView();

}

/* =========================
   VISITED
========================= */

function toggleVisited(name){

  if(visited.includes(name)){

    visited =
      visited.filter(
        item => item !== name
      );

  } else {

    visited.push(name);

  }

  saveVisited();

  updateCounters();

  updateView();

}

/* =========================
   QUICK SEARCH
========================= */

function quickSearch(value, button){

  quickFilter = value;

  searchInput.value = "";

  currentView = "all";

  setActiveButton(allBtn);

  document
    .querySelectorAll(".quick-btn")
    .forEach(btn =>
      btn.classList.remove("active")
    );

  button.classList.add("active");

  updateView();

}

/* =========================
   CLEAR SEARCH
========================= */

function clearSearch(){

  searchInput.value = "";

  quickFilter = "";

  currentView = "all";

  setActiveButton(allBtn);

  document
    .querySelectorAll(".quick-btn")
    .forEach(btn =>
      btn.classList.remove("active")
    );

  updateView();

}

/* =========================
   SEARCH HIGHLIGHT
========================= */

function highlight(text, value){

  if(!text) return "";

  if(!value) return text;

  const regex =
    new RegExp(`(${value})`, "gi");

  return text.replace(
    regex,
    "<mark>$1</mark>"
  );

}

/* =========================
   FILTER + SORT
========================= */

function updateView(){

  let items = [...exhibitors];

  const value =
    searchInput.value
    .toLowerCase()
    .trim();

  /* FILTER VIEW */

  if(currentView === "favorites"){

    items =
      items.filter(item =>
        favorites.includes(item.name)
      );

  }

  if(currentView === "visited"){

    items =
      items.filter(item =>
        visited.includes(item.name)
      );

  }

  /* QUICK FILTER */

  if(
    quickFilter &&
    !value
  ){

    items =
      items.filter(item =>

        item.hall
          ?.toLowerCase()
          .includes(
            quickFilter.toLowerCase()
          )

      );

  }

  /* EMPTY STATE */

  if(
    !value &&
    !quickFilter &&
    currentView === "all"
  ){

    results.innerHTML = `

      <div class="card">

        <h2>
          Cerca un espositore
        </h2>

        <p>
          Cerca per:
          editore,
          stand,
          padiglione
          o categoria.
        </p>

      </div>

    `;

    return;

  }

  /* SEARCH */

  if(value){

    items =
      items.filter(item =>

        item.name
          ?.toLowerCase()
          .includes(value)

        ||

        item.stand
          ?.toLowerCase()
          .includes(value)

        ||

        item.hall
          ?.toLowerCase()
          .includes(value)

        ||

        item.category
          ?.toLowerCase()
          .includes(value)

      );

  }

  /* SORT */

  const sortBy =
    sortSelect.value;

  items.sort((a,b) => {

    if(sortBy === "stand"){

      return (a.stand || "")
        .localeCompare(
          b.stand || "",
          undefined,
          {
            numeric:true,
            sensitivity:"base"
          }
        );

    }

    return (
      a[sortBy] || ""
    ).localeCompare(
      b[sortBy] || ""
    );

  });

  /* LIMIT RESULTS */

  items = items.slice(0, 80);

  renderResults(items, value);

}

/* =========================
   RENDER
========================= */

function renderResults(items, value){

  results.innerHTML = "";

  if(items.length === 0){

    results.innerHTML = `

      <div class="card">

        <h2>
          Nessun risultato
        </h2>

      </div>

    `;

    return;

  }

  items.forEach(item => {

    const isFavorite =
      favorites.includes(item.name);

    const isVisited =
      visited.includes(item.name);

    results.innerHTML += `

      <div class="card">

        <div class="card-top">

          <div>

            <h2>
              ${highlight(
                item.name,
                value
              )}
            </h2>

            <p>

              <strong>

                ${highlight(
                  item.hall,
                  value
                )}

              </strong>

            </p>

            <p>

              Stand

              ${highlight(
                item.stand,
                value
              )}

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
                isVisited
                ? "active"
                : ""
              }"
              onclick="
                toggleVisited(
                  '${item.name}'
                )
              "
            >
              ${
                isVisited
                ? "✅"
                : "☑️"
              }
            </button>

            <button
              class="favorite-btn ${
                isFavorite
                ? "active"
                : ""
              }"
              onclick="
                toggleFavorite(
                  '${item.name}'
                )
              "
            >
              ${
                isFavorite
                ? "❤️"
                : "🤍"
              }
            </button>

          </div>

        </div>

      </div>

    `;

  });

}

/* =========================
   FILTER BUTTONS
========================= */

allBtn.addEventListener(
  "click",
  () => {

    currentView = "all";

    setActiveButton(allBtn);

    updateView();

  }
);

favoritesBtn.addEventListener(
  "click",
  () => {

    currentView = "favorites";

    setActiveButton(
      favoritesBtn
    );

    updateView();

  }
);

visitedBtn.addEventListener(
  "click",
  () => {

    currentView = "visited";

    setActiveButton(
      visitedBtn
    );

    updateView();

  }
);

function setActiveButton(button){

  [
    allBtn,
    favoritesBtn,
    visitedBtn
  ].forEach(btn =>
    btn.classList.remove("active")
  );

  button.classList.add("active");

}

/* =========================
   SEARCH DEBOUNCE
========================= */

let debounce;

searchInput.addEventListener(
  "input",
  () => {

    clearTimeout(debounce);

    debounce =
      setTimeout(() => {

        updateView();

      }, 120);

  }
);

/* =========================
   CLEAR SEARCH BTN
========================= */

clearSearchBtn.addEventListener(
  "click",
  clearSearch
);

/* =========================
   SORT
========================= */

sortSelect.addEventListener(
  "change",
  updateView
);

/* =========================
   GLOBAL FUNCTIONS
========================= */

window.quickSearch =
  quickSearch;

window.toggleFavorite =
  toggleFavorite;

window.toggleVisited =
  toggleVisited;

/* =========================
   INIT
========================= */

loadExhibitors();
