const searchInput =
  document.getElementById("searchInput");

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

let exhibitors = [];

let currentView = "all";

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

    favorites =
      favorites.filter(
        fav => fav !== name
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

    visited =
      visited.filter(
        item => item !== name
      );

  } else {

    visited.push(name);

  }

  saveVisited();

  updateView();

}

/* =========================
   SEARCH HIGHLIGHT
========================= */

function highlight(text, value){

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

  /* NO SEARCH = NO RESULTS */

  if(
    !value &&
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
   DEBOUNCE SEARCH
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
   SORT
========================= */

sortSelect.addEventListener(
  "change",
  updateView
);

/* =========================
   INIT
========================= */

loadExhibitors();
