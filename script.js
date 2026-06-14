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

const sortWrapper =
  document.getElementById("sortWrapper");

const sortSelect =
  document.getElementById("sortSelect");

const favoritesCount =
  document.getElementById("favoritesCount");

const visitedCount =
  document.getElementById("visitedCount");

/* =========================
   MISSIONI
========================= */

const missionForm =
  document.getElementById("missionForm");

const toggleMissionForm =
  document.getElementById("toggleMissionForm");

const saveMissionBtn =
  document.getElementById("saveMissionBtn");

const missionsList =
  document.getElementById("missionsList");

const missionTitle =
  document.getElementById(
    "missionTitle"
  );

const missionPublisher =
  document.getElementById("missionPublisher");

const missionNotes =
  document.getElementById(
    "missionNotes"
  );

const todoFilterBtn =
  document.getElementById(
    "todoFilterBtn"
  );

const doneFilterBtn =
  document.getElementById(
    "doneFilterBtn"
  );

const allMissionFilterBtn =
  document.getElementById(
    "allMissionFilterBtn"
  );

function updateMissionForm(){

  missionBookBtn.classList.remove(
    "active"
  );

  missionStandBtn.classList.remove(
    "active"
  );

  if(
    selectedMissionType ===
    "book"
  ){

    missionBookBtn.classList.add(
      "active"
    );

    missionTitle.placeholder =
      "Libro da cercare";

  } else {

    missionStandBtn.classList.add(
      "active"
    );

    missionTitle.placeholder =
      "Cosa devo fare a questo stand?";

  }

}

function updatePriorityButtons(){

  priorityHighBtn.classList.remove(
    "active"
  );

  priorityMediumBtn.classList.remove(
    "active"
  );

  priorityLowBtn.classList.remove(
    "active"
  );

  if(
    selectedPriority ===
    "high"
  ){

    priorityHighBtn.classList.add(
      "active"
    );

  }

  if(
    selectedPriority ===
    "medium"
  ){

    priorityMediumBtn.classList.add(
      "active"
    );

  }

  if(
    selectedPriority ===
    "low"
  ){

    priorityLowBtn.classList.add(
      "active"
    );

  }

}

const publisherList =
  document.getElementById("publisherList");

const toggleMissionsBtn =
  document.getElementById(
    "toggleMissionsBtn"
  );

const missionsSection =
  document.getElementById(
    "missionsSection"
  );

const missionBookBtn =
  document.getElementById(
    "missionBookBtn"
  );

const missionStandBtn =
  document.getElementById(
    "missionStandBtn"
  );

const priorityHighBtn =
  document.getElementById(
    "priorityHighBtn"
  );

const priorityMediumBtn =
  document.getElementById(
    "priorityMediumBtn"
  );

const priorityLowBtn =
  document.getElementById(
    "priorityLowBtn"
  );

let missions =
  JSON.parse(
    localStorage.getItem("missions")
  ) || [];

let selectedMissionType =
  "book";

let selectedPriority =
  "medium";

let missionFilter =
  "todo";

todoFilterBtn.addEventListener(
  "click",
  () => {

    missionFilter =
      "todo";

    updateMissionFilter();

    renderMissions();

  }
);

doneFilterBtn.addEventListener(
  "click",
  () => {

    missionFilter =
      "done";

    updateMissionFilter();

    renderMissions();

  }
);

allMissionFilterBtn.addEventListener(
  "click",
  () => {

    missionFilter =
      "all";

    updateMissionFilter();

    renderMissions();

  }
);

missionBookBtn.addEventListener(
  "click",
  () => {

    selectedMissionType =
      "book";

    updateMissionForm();

  }
);

missionStandBtn.addEventListener(
  "click",
  () => {

    selectedMissionType =
      "stand";

    updateMissionForm();

  }
);

function updateMissionFilter(){

  todoFilterBtn.classList.remove(
    "active"
  );

  doneFilterBtn.classList.remove(
    "active"
  );

  allMissionFilterBtn.classList.remove(
    "active"
  );

  if(
    missionFilter === "todo"
  ){

    todoFilterBtn.classList.add(
      "active"
    );

  }

  if(
    missionFilter === "done"
  ){

    doneFilterBtn.classList.add(
      "active"
    );

  }

  if(
    missionFilter === "all"
  ){

    allMissionFilterBtn.classList.add(
      "active"
    );

  }

}

priorityHighBtn.addEventListener(
  "click",
  () => {

    selectedPriority =
      "high";

    updatePriorityButtons();

  }
);

priorityMediumBtn.addEventListener(
  "click",
  () => {

    selectedPriority =
      "medium";

    updatePriorityButtons();

  }
);

priorityLowBtn.addEventListener(
  "click",
  () => {

    selectedPriority =
      "low";

    updatePriorityButtons();

  }
);

/* =========================
   SCROLL TOP
========================= */

const scrollTopBtn =
  document.getElementById(
    "scrollTopBtn"
  );

/* =========================
   DARK MODE
========================= */

const themeToggle =
  document.getElementById("themeToggle");

const savedTheme =
  localStorage.getItem("theme");

if(savedTheme === "dark"){

  document.body.classList.add("dark");

  themeToggle.innerText = "☀️";

}

themeToggle.addEventListener(
  "click",
  () => {

    document.body.classList.toggle("dark");

    const isDark =
      document.body.classList.contains("dark");

    themeToggle.innerText =
      isDark
      ? "☀️"
      : "🌙";

    localStorage.setItem(
      "theme",
      isDark
      ? "dark"
      : "light"
    );

  }
);

/* =========================
   MAP MODAL
========================= */

const mapModal =
  document.getElementById("mapModal");

const mapImage =
  document.getElementById("mapImage");

const closeMapBtn =
  document.getElementById("closeMapBtn");

function openMap(src){

  mapImage.src = src;

  mapModal.classList.add("active");

  document.body.style.overflow =
    "hidden";

}

function closeMap(){

  mapModal.classList.remove("active");

  document.body.style.overflow =
    "";

}

closeMapBtn.addEventListener(
  "click",
  closeMap
);

/* =========================
   OFFLINE MODE
========================= */

if(
  "serviceWorker" in navigator
){

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker.register(
        "service-worker.js"
      );

    }
  );

}

/* =========================
   TOGGLE MISSIONS
========================= */

toggleMissionsBtn.addEventListener(
  "click",
  () => {

    missionsSection.classList.toggle(
      "hidden"
    );

  }
);

/* =========================
   APP
========================= */

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

  populatePublishers();

  updateCounters();

  updateView();

  renderMissions();

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

  if(
    currentView === "favorites"
    ||
    currentView === "visited"
  ){

    sortWrapper.style.display =
      "block";

  } else {

    sortWrapper.style.display =
      "none";

  }

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
      a.name || ""
    ).localeCompare(
      b.name || ""
    );

  });

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
   MISSIONI
========================= */

toggleMissionForm.addEventListener(
  "click",
  () => {

    missionForm.classList.toggle(
      "hidden"
    );

  }
);

function populatePublishers(){

  publisherList.innerHTML = "";

  exhibitors.forEach(item => {

    const option =
      document.createElement("option");

    option.value = item.name;

    publisherList.appendChild(option);

  });

}

function saveMission(){

 const type =
  selectedMissionType;

const title =
  missionTitle.value.trim();

  const publisher =
    missionPublisher.value.trim();

const priority =
  selectedPriority;

  const notes =
  missionNotes.value.trim();

  if(!title || !publisher){
  return;
}

  const exhibitor =
    exhibitors.find(item =>
      item.name
        .toLowerCase()
        ===
      publisher.toLowerCase()
    );

missions.push({

  id: Date.now(),

  type,

title,

  publisher,

  hall:
    exhibitor?.hall || "",

  stand:
    exhibitor?.stand || "",

  priority,

  notes,

  done: false

});

  localStorage.setItem(
    "missions",
    JSON.stringify(missions)
  );

  missionTitle.value = "";

  missionPublisher.value = "";

  missionNotes.value = "";

  selectedMissionType =
  "book";

selectedPriority =
  "medium";

updateMissionForm();

updatePriorityButtons();

  renderMissions();

  missionForm.classList.add(
  "hidden"
);

}



saveMissionBtn.addEventListener(
  "click",
  saveMission
);

function toggleMission(id){

  missions = missions.map(item => {

    if(item.id === id){

      return {
        ...item,
        done:!item.done
      };

    }

    return item;

  });

  localStorage.setItem(
    "missions",
    JSON.stringify(missions)
  );

  renderMissions();

}

function deleteMission(id){

  missions = missions.filter(item =>
    item.id !== id
  );

  localStorage.setItem(
    "missions",
    JSON.stringify(missions)
  );

  renderMissions();

}

function editMission(id){

  const mission =
    missions.find(item =>
      item.id === id
    );

  if(!mission) return;

  selectedMissionType =
  mission.type || "book";

missionTitle.value =
  mission.title || "";

missionPublisher.value =
  mission.publisher || "";

selectedPriority =
  mission.priority || "medium";

  updateMissionForm();

updatePriorityButtons();

  missionNotes.value =
  mission.notes || "";

  missionForm.classList.remove(
    "hidden"
  );

  deleteMission(id);

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}

function renderMissions(){

      missionsList.innerHTML = "";

  let filteredMissions =
  [...missions];

if(
  missionFilter === "todo"
){

  filteredMissions =
    filteredMissions.filter(
      item => !item.done
    );

}

if(
  missionFilter === "done"
){

  filteredMissions =
    filteredMissions.filter(
      item => item.done
    );

}

 if(
    filteredMissions.length === 0
  ){

    missionsList.innerHTML = `
      <div class="card">
        <p>
          Nessuna missione da mostrare.
        </p>
      </div>
    `;

    return;

  }


  const grouped = {};

  filteredMissions.forEach(
  item => {

    const hall =
      item.hall || "Altro";

    if(!grouped[hall]){

      grouped[hall] = [];

    }

    grouped[hall].push(item);

  });

  Object.keys(grouped).forEach(hall => {

    missionsList.innerHTML += `

      <div class="mission-group">

        <h3 class="mission-group-title">
          ${hall}
        </h3>

        <div id="group-${hall}">
        </div>

      </div>

    `;

    const container =
      document.getElementById(
        `group-${hall}`
      );

    grouped[hall].forEach(item => {

      container.innerHTML += `

        <div class="mission-card ${
          item.done
          ? "mission-done"
          : ""
        }">

          <div class="mission-card-top">

            <div>

             <h3>
  ${
    item.type === "stand"
      ? "🎯"
      : "📚"
  }
  ${item.title}
</h3>

<div class="mission-meta">

  <span>
    ${item.publisher}
  </span>

  ${
    item.stand
      ? `
        <span>
          • ${item.stand}
        </span>
      `
      : ""
  }

</div>

<span
  class="
    mission-badge
    mission-badge-${
      item.priority
    }
  "
>

  ${
    item.priority === "high"
      ? "ALTA"
      : item.priority === "low"
      ? "BASSA"
      : "MEDIA"
  }

</span>

${
  item.notes
  ? `
    <p class="mission-notes">
      📝 ${item.notes}
    </p>
  `
  : ""
}

            </div>

            <div class="mission-actions">

              <button
                onclick="toggleMission(${item.id})"
              >
                ${
                  item.done
                  ? "✅"
                  : "☑️"
                }
              </button>

              <button
                onclick="editMission(${item.id})"
              >
                ✏️
              </button>

              <button
                onclick="deleteMission(${item.id})"
              >
                🗑️
              </button>

            </div>

          </div>

        </div>

      `;

    });

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
   SEARCH
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
   CLOSE KEYBOARD IOS
========================= */

searchInput.addEventListener(
  "keydown",
  (event) => {

    if(event.key === "Enter"){

      searchInput.blur();

    }

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
   SCROLL TOP
========================= */

window.addEventListener(
  "scroll",
  () => {

    if(window.scrollY > 500){

      scrollTopBtn.classList.add(
        "show"
      );

    } else {

      scrollTopBtn.classList.remove(
        "show"
      );

    }

  }
);

scrollTopBtn.addEventListener(
  "click",
  () => {

    window.scrollTo({
      top:0,
      behavior:"smooth"
    });

  }
);

/* =========================
   GLOBAL
========================= */

window.quickSearch =
  quickSearch;

window.toggleFavorite =
  toggleFavorite;

window.toggleVisited =
  toggleVisited;

window.openMap =
  openMap;

window.toggleMission =
  toggleMission;

window.deleteMission =
  deleteMission;

window.editMission =
  editMission;

/* =========================
   INIT
========================= */

updateMissionForm();

updatePriorityButtons();

updateMissionFilter();

loadExhibitors();
