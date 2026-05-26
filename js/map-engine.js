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

const legendItems =
  document.querySelectorAll(
    ".legend-item"
  );

const AREA_INDEX = [];

let activeFilter =
  null;

const TYPE_COLORS = {

  stand: "#d97706",

  room: "#2563eb",

  food: "#dc2626",

  wc: "#16a34a",

  smoking: "#6b7280",

  kids: "#ec4899",

  info: "#06b6d4",

  entrance: "#facc15",

  service: "#7c3aed",

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

  service:
    "Servizio",

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
  closePopup
);

popupBackdrop.addEventListener(
  "click",
  closePopup
);

function setActiveArea(
  areaElement
) {

  const allAreas =
    document.querySelectorAll(
      ".map-area"
    );

  allAreas.forEach(el => {

    el.classList.remove(
      "active"
    );

    el.classList.remove(
      "dimmed"
    );

  });

  if (!areaElement)
    return;

  allAreas.forEach(el => {

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

      el.classList.remove(
        "dimmed"
      );

    });

}

function openArea(
  area,
  element
) {

  tooltip.classList.add(
    "hidden"
  );

  resetMapVisibility();

  setActiveArea(
    element
  );

  popupName.textContent =
    area.exhibitor ||
    area.name;

  popupLocation.textContent =
    area.name;

  popupType.textContent =
    TYPE_LABELS[
      area.type
    ] || area.type;

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

      setActiveArea(
        null
      );

      closePopup();

      resetMapVisibility();

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
        .toLowerCase();

    if (!query)
      return;

    const match =
      AREA_INDEX.find(
        ({ area }) => {

          const name =
            (
              area.name || ""
            ).toLowerCase();

          const id =
            (
              area.id || ""
            ).toLowerCase();

          return (
            name.includes(query) ||
            id.includes(query)
          );

        }
      );

    if (!match)
      return;

    openArea(
      match.area,
      match.element
    );

    document
      .querySelector(
        ".map-wrapper"
      )
      .scrollIntoView({

        behavior:
          "smooth",

        block:
          "center"

      });

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

          });

        document
          .querySelector(
            ".map-image"
          )
          .classList.remove(
            "dimmed"
          );

        legendItems.forEach(
          el =>
            el.classList.remove(
              "inactive"
            )
        );

        return;

      }

      activeFilter =
        type;

      document
        .querySelector(
          ".map-image"
        )
        .classList.add(
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

          el.classList.toggle(
            "active",
            isMatch
          );

        });

      legendItems.forEach(el => {

        el.classList.toggle(
          "inactive",
          el.dataset.type !== type
        );

      });

    }
  );

});

loadMap();
