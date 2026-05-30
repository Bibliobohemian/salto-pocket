const svg =
  document.querySelector(
    ".map-overlay"
  );

const tooltip =
  document.querySelector(
    ".tooltip"
  );

const popup =
  document.querySelector(
    ".popup"
  );

const popupBackdrop =
  document.querySelector(
    ".popup-backdrop"
  );

const popupName =
  document.querySelector(
    ".popup-name"
  );

const popupLocation =
  document.querySelector(
    ".popup-location"
  );

const popupType =
  document.querySelector(
    ".popup-type"
  );

const popupClose =
  document.querySelector(
    ".popup-close"
  );

const searchInput =
  document.querySelector(
    ".map-search-input"
  );

const searchClear =
  document.querySelector(
    ".search-clear"
  );

const legendItems =
  document.querySelectorAll(
    ".legend-item"
  );

const mapImage =
  document.querySelector(
    ".map-image"
  );

const popupActions =
  document.querySelector(
    ".popup-actions"
  );

const popupFavoriteBtn =
  document.querySelector(
    ".popup-favorite-btn"
  );

const popupVisitedBtn =
  document.querySelector(
    ".popup-visited-btn"
  );

const AREA_INDEX = [];

let activeFilter =
  null;

let activeArea =
  null;

let activeAreaData =
  null;

let favorites =
  JSON.parse(
    localStorage.getItem(
      "favorites"
    )
  ) || [];

let visited =
  JSON.parse(
    localStorage.getItem(
      "visited"
    )
  ) || [];

const TYPE_COLORS = {

  stand: "#d97706",

  room: "#2563eb",

  food: "#dc2626",

  wc: "#16a34a",

  smoking: "#6b7280",

  kids: "#ec4899",

  info: "#06b6d4",

  entrance: "#facc15",

  water: "#0ea5e9",

  landmark: "#f97316",

  unknown: "#ffffff"

};

const TYPE_LABELS = {

  stand: "Stand",

  room: "Sala",

  food: "Food",

  wc: "Bagno",

  smoking:
    "Area fumatori",

  kids:
    "Area bambini",

  info:
    "Infopoint",

  entrance:
    "Ingresso",

  water:
    "Fontanella",

  landmark:
    "Punto interesse"

};

function closePopup() {

  popup.classList.add(
    "hidden"
  );

  popupBackdrop.classList.add(
    "hidden"
  );

}

popupClose.addEventListener(
  "click",
  resetSearch
);

popupBackdrop.addEventListener(
  "click",
  resetSearch
);

function clearAreaStates() {

  document
    .querySelectorAll(
      ".map-area"
    )
    .forEach(el => {

      el.classList.remove(
        "active"
      );

      el.classList.remove(
        "dimmed"
      );

    });

}

function setActiveArea(
  areaElement
) {

  activeArea =
    areaElement;

  clearAreaStates();

  if (!areaElement)
    return;

  const visibleAreas =
    [
      ...document.querySelectorAll(
        '.map-area:not([style*="display: none"])'
      )
    ];

  visibleAreas.forEach(el => {

    if (el !== areaElement) {

      el.classList.add(
        "dimmed"
      );

    }

  });

  areaElement.classList.add(
    "active"
  );

  svg.appendChild(
    areaElement
  );

}

function resetMapVisibility() {

  document
    .querySelectorAll(
      ".map-area"
    )
    .forEach(el => {

      el.style.display =
        "";

    });

  mapImage.classList.remove(
    "dimmed"
  );

  clearAreaStates();

}

function applyFilter(
  type
) {

  activeFilter =
    type;

  mapImage.classList.add(
    "dimmed"
  );

  document
    .querySelectorAll(
      ".map-area"
    )
    .forEach(el => {

      const isMatch =
        el.dataset.type === type;

      el.style.display =
        isMatch
          ? ""
          : "none";

      el.classList.remove(
        "active"
      );

      el.classList.remove(
        "dimmed"
      );

      if (isMatch) {

        el.classList.add(
          "active"
        );

      }

    });

  legendItems.forEach(el => {

    el.classList.toggle(
      "inactive",
      el.dataset.type !== type
    );

  });

}

function clearFilter() {

  activeFilter =
    null;

  document
    .querySelectorAll(
      ".map-area"
    )
    .forEach(el => {

      el.style.display =
        "";

      el.classList.remove(
        "active"
      );

      el.classList.remove(
        "dimmed"
      );

    });

  mapImage.classList.remove(
    "dimmed"
  );

  legendItems.forEach(el => {

    el.classList.remove(
      "inactive"
    );

  });
}

function resetSearch() {

  searchInput.value =
    "";

  closePopup();

  clearFilter();

  activeArea =
    null;

  resetMapVisibility();

activeAreaData =
  null;

searchClear.classList.add(
  "hidden"
);

}

function openArea(
  area,
  element
) {

  tooltip.classList.add(
    "hidden"
  );

  if (!activeFilter) {

    resetMapVisibility();

  }

  setActiveArea(
    element
  );

  activeAreaData =
  area;

  popupName.textContent =
    area.exhibitor ||
    area.name;

  popupLocation.textContent =
    area.name;

  popupType.textContent =
    TYPE_LABELS[
      area.type
    ] || area.type;

  if (
  area.type === "stand"
) {

  popupActions.classList.remove(
    "hidden"
  );

  updateActionButtons(
    area
  );

} else {

  popupActions.classList.add(
    "hidden"
  );

}

  popup.classList.remove(
    "hidden"
  );

  popupBackdrop.classList.remove(
    "hidden"
  );

}

async function loadMap() {

  const response =
    await fetch(
      "./maps/2026/pad1/areas.json"
    );

  const areas =
    await response.json();

  areas.forEach(
    renderArea
  );

}

function renderArea(area) {

  let element;

  if (
    area.shape === "rect"
  ) {

    element =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

    element.setAttribute(
      "x",
      area.coords.x
    );

    element.setAttribute(
      "y",
      area.coords.y
    );

    element.setAttribute(
      "width",
      area.coords.width
    );

    element.setAttribute(
      "height",
      area.coords.height
    );

  }

  if (
    area.shape === "circle"
  ) {

    element =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

    element.setAttribute(
      "cx",
      area.coords.cx
    );

    element.setAttribute(
      "cy",
      area.coords.cy
    );

    element.setAttribute(
      "r",
      area.coords.radius
    );

  }

  if (!element)
    return;

  element.classList.add(
    "map-area"
  );

  element.style.fill =
    TYPE_COLORS[
      area.type
    ] || "#ffffff";

  element.style.stroke =
    TYPE_COLORS[
      area.type
    ] || "#ffffff";

  element.dataset.id =
    area.id;

  element.dataset.type =
    area.type;

  element.addEventListener(
    "mousemove",
    (event) => {

      if (
        window.innerWidth <= 768
      ) {
        return;
      }

      tooltip.textContent =
        area.name;

      tooltip.style.left =
        event.clientX +
        12 +
        "px";

      tooltip.style.top =
        event.clientY +
        12 +
        "px";

      tooltip.classList.remove(
        "hidden"
      );

    }
  );

  element.addEventListener(
    "mouseleave",
    () => {

      tooltip.classList.add(
        "hidden"
      );

    }
  );

  element.addEventListener(
    "click",
    () => {

      openArea(
        area,
        element
      );

    }
  );

  AREA_INDEX.push({

    area,

    element

  });

  svg.appendChild(
    element
  );

}

svg.addEventListener(
  "click",
  (event) => {

    if (
      event.target === svg
    ) {

      activeArea =
        null;

      resetSearch();

      if (!activeFilter) {

        resetMapVisibility();

        searchClear.classList.add(
  "hidden"
);

      }

    }

  }
);

searchInput.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key !== "Enter"
    ) {
      return;
    }

    const query =
  searchInput.value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

    if (!query)
      return;

    const match =
      AREA_INDEX.find(
        ({ area }) => {

          const name =
  (
    area.name || ""
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

const id =
  (
    area.id || ""
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

const exhibitor =
  (
    area.exhibitor || ""
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

          return (

            name.includes(query) ||

            id.includes(query) ||

            exhibitor.includes(query)

          );

        }
      );

if (!match)
  return;

searchInput.blur();
    
    if (
      activeFilter &&
      match.area.type !== activeFilter
    ) {

      clearFilter();

    }

    openArea(
      match.area,
      match.element
    );

  }
);

legendItems.forEach(item => {

  item.addEventListener(
    "click",
    () => {

      const type =
        item.dataset.type;

      if (
        activeFilter === type
      ) {

        clearFilter();

        return;

      }

      applyFilter(
        type
      );

    }
  );

});

searchInput.addEventListener(
  "input",
  () => {

    searchClear.classList.toggle(
      "hidden",
      !searchInput.value.trim()
    );

  }
);

searchClear.addEventListener(
  "click",
  resetSearch
);

function updateActionButtons(
  area
) {

  const id =
    area.id;

  const isFavorite =
    favorites.includes(
      id
    );

  const isVisited =
    visited.includes(
      id
    );

  popupFavoriteBtn.textContent =
    isFavorite
      ? "❤️ Nei preferiti"
      : "🤍 Preferito";

  popupVisitedBtn.textContent =
    isVisited
      ? "☑️ Visitato"
      : "✅ Visitato";

}

popupFavoriteBtn.addEventListener(
  "click",
  () => {

    if (
      !activeAreaData
    ) {
      return;
    }

    const id =
      activeAreaData.id;

    if (
      favorites.includes(
        id
      )
    ) {

      favorites =
        favorites.filter(
          item =>
            item !== id
        );

    } else {

      favorites.push(
        id
      );

    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(
        favorites
      )
    );

    updateActionButtons(
      activeAreaData
    );

  }
);

popupVisitedBtn.addEventListener(
  "click",
  () => {

    if (
      !activeAreaData
    ) {
      return;
    }

    const id =
      activeAreaData.id;

    if (
      visited.includes(
        id
      )
    ) {

      visited =
        visited.filter(
          item =>
            item !== id
        );

    } else {

      visited.push(
        id
      );

    }

    localStorage.setItem(
      "visited",
      JSON.stringify(
        visited
      )
    );

    updateActionButtons(
      activeAreaData
    );

  }
);
  
loadMap();
