const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

let exhibitors = [];

let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];

async function loadExhibitors(){

  const response = await fetch("data/exhibitors.json");

  exhibitors = await response.json();

  renderResults(exhibitors);

}

function saveFavorites(){

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

}

function toggleFavorite(name){

  if(favorites.includes(name)){

    favorites = favorites.filter(
      (fav) => fav !== name
    );

  } else {

    favorites.push(name);

  }

  saveFavorites();

  renderResults(exhibitors);

}

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

    results.innerHTML += `
      <div class="card">

        <div class="card-top">

          <div>
            <h2>${item.name}</h2>
            <p><strong>${item.hall}</strong></p>
            <p>Stand ${item.stand}</p>
          </div>

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
    `;
  });

}

searchInput.addEventListener("input", (e) => {

  const value = e.target.value.toLowerCase();

  const filtered = exhibitors.filter((item) =>

    item.name.toLowerCase().includes(value) ||
    item.stand.toLowerCase().includes(value) ||
    item.hall.toLowerCase().includes(value)

  );

  renderResults(filtered);

});

loadExhibitors();
