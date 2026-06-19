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

const popupMissions =
  document.querySelector(
    ".popup-missions"
  );

const popupMissionsList =
  document.querySelector(
    ".popup-missions-list"
  );

const popupCompleteMissionsBtn =
  document.querySelector(
    ".popup-complete-missions-btn"
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

const mapViewport =
  document.querySelector(
    ".map-viewport"
  );

const mapWrapper =
  document.querySelector(
    ".map-wrapper"
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

const favoriteFilterBtn =
  document.querySelector(
    '[data-filter="favorites"]'
  );

const missionFilterBtn =
  document.querySelector(
    '[data-filter="missions"]'
  );

let exhibitors = [];
let exhibitorsByStand = {};

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

let missions =
  JSON.parse(
    localStorage.getItem(
      "missions"
    )
  ) || [];

let activeSpecialFilter =
  null;

const normalizeMissionValue = value =>
  (value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

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

function getPublisherNamesForArea(area) {

  return (exhibitorsByStand[area.name] || [])
    .map(p => p.name)
    .filter(name =>
      name &&
      !name.includes("&")
    );

}

function getMissionsForArea(area) {

  if (
    !area ||
    area.type !== "stand"
  ) {
    return [];
  }

  const publisherNames =
    getPublisherNamesForArea(area)
      .map(normalizeMissionValue);

  return missions.filter(mission =>
    publisherNames.includes(
      normalizeMissionValue(
        mission.publisher
      )
    )
  );

}

function saveMissions() {

  localStorage.setItem(
    "missions",
    JSON.stringify(missions)
  );

  window.dispatchEvent(
    new Event(
      "missions:updated"
    )
  );

}

function syncMissionsFromStorage() {

  missions =
    JSON.parse(
      localStorage.getItem(
        "missions"
      )
    ) || [];

}

function getMissionIndicatorPosition(area) {

  if (area.shape === "rect") {

    return {
      x:
        area.coords.x +
        area.coords.width -
        7,
      y:
        area.coords.y +
        7
    };

  }

  if (area.shape === "circle") {

    return {
      x:
        area.coords.cx +
        area.coords.radius * 0.65,
      y:
        area.coords.cy -
        area.coords.radius * 0.65
    };

  }

  return null;

}

function updateMissionIndicators() {

  AREA_INDEX.forEach(item => {

    const hasMissions =
      getMissionsForArea(
        item.area
      ).length > 0;

    item.element.classList.toggle(
      "has-missions",
      hasMissions
    );

    if (
      !hasMissions &&
      item.missionIndicator
    ) {

      item.missionIndicator.remove();
      item.missionIndicator =
        null;

      return;

    }

    if (
      !hasMissions ||
      item.missionIndicator
    ) {
      return;
    }

    const position =
      getMissionIndicatorPosition(
        item.area
      );

    if (!position) {
      return;
    }

    const indicator =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

    indicator.classList.add(
      "map-mission-indicator"
    );

    indicator.setAttribute(
      "cx",
      position.x
    );

    indicator.setAttribute(
      "cy",
      position.y
    );

    indicator.setAttribute(
      "r",
      6
    );

    svg.appendChild(
      indicator
    );

    item.missionIndicator =
      indicator;

  });

  syncMissionIndicatorVisibility();

}

function syncMissionIndicatorVisibility() {

  AREA_INDEX.forEach(item => {

    if (!item.missionIndicator) {
      return;
    }

    item.missionIndicator.style.display =
      item.element.style.display;

  });

}

function renderPopupMissions(area) {

  const areaMissions =
    getMissionsForArea(area);

  if (!areaMissions.length) {

    popupMissions.classList.add(
      "hidden"
    );

    popupMissionsList.innerHTML =
      "";

    return;

  }

  popupMissionsList.innerHTML =
    areaMissions
      .map(mission => `
        <div class="popup-mission-item">
          <span class="popup-mission-title">
            ${
              mission.done
                ? "✅"
                : mission.type === "stand"
                ? "🎯"
                : "📚"
            }
            ${mission.title}
          </span>
          <span class="popup-mission-status">
            ${
              mission.done
                ? "Completata"
                : "Da fare"
            }
          </span>
        </div>
      `)
      .join("");

  popupMissions.classList.remove(
    "hidden"
  );

}

function refreshMissionUI() {

  syncMissionsFromStorage();

  updateMissionIndicators();

  if (
    activeSpecialFilter === "missions"
  ) {

    applyMissionFilter();

  }

  if (
    activeAreaData &&
    !popup.classList.contains(
      "hidden"
    )
  ) {

    renderPopupMissions(
      activeAreaData
    );

  }

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

  const activeItem =
    AREA_INDEX.find(item =>
      item.element === areaElement
    );

  if (
    activeItem?.missionIndicator
  ) {

    svg.appendChild(
      activeItem.missionIndicator
    );

  }

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

  syncMissionIndicatorVisibility();

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

  syncMissionIndicatorVisibility();

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

  syncMissionIndicatorVisibility();
}

function resetSearch() {

  searchInput.value =
    "";

  closePopup();

  clearFilter();

  activeSpecialFilter = null;

favoriteFilterBtn.classList.remove(
  "active"
);

missionFilterBtn.classList.remove(
  "active"
);

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

  centerArea(
  area
);

  activeAreaData =
  area;

  if (area.type === "stand") {

console.log("AREA ID:", area.id);

const publishers =
  exhibitorsByStand[area.name] || [];

console.log("PUBLISHERS:", publishers);

  if (publishers.length) {

    popupName.textContent =
      publishers
        .map(p => p.name)
        .join(", ");

  } else {

    popupName.textContent =
      area.name;

  }

} else {

  popupName.textContent =
    area.name;

}

  popupLocation.textContent =
    area.name;

  popupType.textContent =
    TYPE_LABELS[
      area.type
    ] || area.type;

  renderPopupMissions(
    area
  );

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

function buildExhibitorIndex() {

  exhibitorsByStand = {};

  exhibitors.forEach(ex => {

    if (!ex.stand) return;

    const standGroups =
      ex.stand
        .split("/")
        .map(s => s.trim());

    standGroups.forEach(group => {

      if (!group) return;

      const addExhibitor = (key) => {

        if (!exhibitorsByStand[key]) {
          exhibitorsByStand[key] = [];
        }

        const alreadyExists =
          exhibitorsByStand[key]
            .some(item => item.name === ex.name);

        if (!alreadyExists) {
          exhibitorsByStand[key].push(ex);
        }

      };

      // Stand completo
      addExhibitor(group);

      const singleStands =
        group
          .split("-")
          .map(s => s.trim());

      // Singoli stand
      singleStands.forEach(single => {
        addExhibitor(single);
      });

      // Versione invertita dello stand doppio
      if (singleStands.length === 2) {

        const reversed =
          [...singleStands]
            .reverse()
            .join("-");

        addExhibitor(reversed);

      }

    });

  });

}


async function loadMap() {

  const areasResponse =
    await fetch(
      "./maps/2026/pad1/areas.json"
    );

  const exhibitorsResponse =
    await fetch(
      "./data/exhibitors.json"
    );

  const areas =
    await areasResponse.json();

  exhibitors =
    await exhibitorsResponse.json();

  buildExhibitorIndex();

  areas.forEach(
    renderArea
  );

  updateMissionIndicators();

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

        activeSpecialFilter = null;

favoriteFilterBtn.classList.remove(
  "active"
);

missionFilterBtn.classList.remove(
  "active"
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
    exhibitorsByStand[area.name] || []
  )
    .map(p => p.name)
    .join(" ")
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

favoriteFilterBtn.addEventListener(
  "click",
  () => {

    const isActive =
      activeSpecialFilter === "favorites";

    resetMapVisibility();

    favoriteFilterBtn.classList.remove(
      "active"
    );

    missionFilterBtn.classList.remove(
      "active"
    );

    if (isActive) {

      activeSpecialFilter =
        null;

      return;

    }

    activeSpecialFilter =
      "favorites";

    favoriteFilterBtn.classList.add(
      "active"
    );

    document
      .querySelectorAll(
        ".map-area"
      )
      .forEach(el => {

const areaId =
  el.dataset.id;

const areaData =
  AREA_INDEX.find(
    item =>
      item.area.id === areaId
  )?.area;

if (!areaData) {
  el.style.display = "none";
  return;
}

const publishers =
  exhibitorsByStand[
    areaData.name
  ] || [];

const publisherNames =
  publishers
    .map(p => p.name)
    .filter(name =>
      !name.includes("&")
    );

const isFavorite =
  publisherNames.some(name =>
    favorites.includes(name)
  );

el.style.display =
  isFavorite
    ? ""
    : "none";

el.classList.remove(
  "active"
);

if (isFavorite) {

  el.classList.add(
    "active"
  );

}

      });

    syncMissionIndicatorVisibility();

  }
);

function applyMissionFilter() {

  document
    .querySelectorAll(
      ".map-area"
    )
    .forEach(el => {

      const areaId =
        el.dataset.id;

      const areaData =
        AREA_INDEX.find(
          item =>
            item.area.id === areaId
        )?.area;

      const isMission =
        getMissionsForArea(
          areaData
        ).length > 0;

      el.style.display =
        isMission
          ? ""
          : "none";

      el.classList.remove(
        "active"
      );

      if (isMission) {

        el.classList.add(
          "active"
        );

      }

    });

  syncMissionIndicatorVisibility();

}

missionFilterBtn.addEventListener(
  "click",
  () => {

    const isActive =
      activeSpecialFilter === "missions";

    resetMapVisibility();

    favoriteFilterBtn.classList.remove(
      "active"
    );

    missionFilterBtn.classList.remove(
      "active"
    );

    if (isActive) {

      activeSpecialFilter =
        null;

      return;

    }

    activeSpecialFilter =
      "missions";

    missionFilterBtn.classList.add(
      "active"
    );

    applyMissionFilter();

  }
);

function updateActionButtons(
  area
) {

  const publishers =
    exhibitorsByStand[area.name] || [];

  const publisherNames =
    publishers
      .map(p => p.name)
      .filter(name =>
        !name.includes("&")
      );

  const isFavorite =
    publisherNames.some(name =>
      favorites.includes(name)
    );

  const isVisited =
    publisherNames.some(name =>
      visited.includes(name)
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

    if (!activeAreaData) {
      return;
    }

    const publishers =
      exhibitorsByStand[
        activeAreaData.name
      ] || [];

    const publisherNames =
      publishers
        .map(p => p.name)
        .filter(name =>
          !name.includes("&")
        );

    const allAlreadyFavorite =
      publisherNames.every(name =>
        favorites.includes(name)
      );

    if (allAlreadyFavorite) {

      favorites =
        favorites.filter(
          name =>
            !publisherNames.includes(name)
        );

    } else {

      publisherNames.forEach(name => {

        if (
          !favorites.includes(name)
        ) {
          favorites.push(name);
        }

      });

    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
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

popupCompleteMissionsBtn.addEventListener(
  "click",
  () => {

    if (!activeAreaData) {
      return;
    }

    const areaMissionIds =
      getMissionsForArea(
        activeAreaData
      )
        .map(mission =>
          mission.id
        );

    if (!areaMissionIds.length) {
      return;
    }

    missions =
      missions.map(mission =>
        areaMissionIds.includes(
          mission.id
        )
          ? {
              ...mission,
              done: true
            }
          : mission
      );

    saveMissions();

    refreshMissionUI();

  }
);

window.addEventListener(
  "storage",
  event => {

    if (
      event.key === "missions"
    ) {

      refreshMissionUI();

    }

  }
);

window.addEventListener(
  "missions:updated",
  refreshMissionUI
);
  
loadMap();

const panzoom = Panzoom(
  mapWrapper,
  {
    maxScale: 5,
    minScale: 1
  }
);

console.log(
  "PANZOOM",
  panzoom
);

function centerArea(area) {

  const viewportWidth =
    mapViewport.clientWidth;

  const viewportHeight =
    mapViewport.clientHeight;

  let centerX;
  let centerY;

  if (area.shape === "rect") {

    centerX =
      area.coords.x +
      area.coords.width / 2;

    centerY =
      area.coords.y +
      area.coords.height / 2;

  } else {

    centerX =
      area.coords.cx;

    centerY =
      area.coords.cy;

  }

  const targetScale = 2;

  const nativeWidth =
    mapImage.naturalWidth || 1846;

  const nativeHeight =
    mapImage.naturalHeight || 811;

  const renderedWidth =
    mapImage.clientWidth;

  const renderedHeight =
    mapImage.clientHeight;

  const renderedX =
    centerX *
    renderedWidth /
    nativeWidth;

  const renderedY =
    centerY *
    renderedHeight /
    nativeHeight;

  const originX =
    renderedWidth / 2;

  const originY =
    renderedHeight / 2;

  const panX =
    (
      viewportWidth / 2 -
      mapWrapper.offsetLeft -
      renderedX * targetScale -
      (1 - targetScale) * originX
    ) /
    targetScale;

  const panY =
    (
      viewportHeight / 2 -
      mapWrapper.offsetTop -
      renderedY * targetScale -
      (1 - targetScale) * originY
    ) /
    targetScale;

  panzoom.zoom(
    targetScale
  );

  panzoom.pan(
    panX,
    panY
  );

}

window.resetMapView = () => {

  panzoom.reset();

};

window.testPan = () => {

  panzoom.pan(
    300,
    0
  );

};

mapViewport.addEventListener(
  "wheel",
  panzoom.zoomWithWheel
);
