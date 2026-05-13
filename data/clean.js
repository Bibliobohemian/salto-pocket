const fs = require("fs");

// ======================
// LEGGI FILE
// ======================

const raw = fs.readFileSync(
  "data/espositori.json",
  "utf8"
);

const data = JSON.parse(raw);

// ======================
// FUNZIONI
// ======================

function normalizeText(str = "") {
  return str
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*/g, "/")
    .trim();
}

function normalizeHall(hall = "") {

  hall = normalizeText(hall);

  hall = hall
    .replace(/^PAD(\d)/i, "PAD $1")
    .replace(/^PADIGLIONE\s*/i, "PAD ")
    .replace(/^PAD OVAL$/i, "OVAL");

  return hall;
}

function normalizeStand(stand = "") {
  return normalizeText(stand)
    .toUpperCase();
}

function cleanCategory(category) {

  if (
    !category ||
    category !== "AUTORE SELF"
  ) {
    return null;
  }

  return "AUTORE SELF";
}

// ======================
// CREA RECORD PULITO
// ======================

function buildRecord({
  name,
  hall,
  stand,
  category
}) {

  const record = {
    name: normalizeText(name),
    hall: normalizeHall(hall),
    stand: normalizeStand(stand)
  };

  const cleanCat =
    cleanCategory(category);

  if (cleanCat) {
    record.category = cleanCat;
  }

  return record;
}

// ======================
// ESPANSIONE STAND
// ======================

function expandEntry(entry) {

  const halls =
    normalizeHall(entry.hall).split("/");

  const stands =
    normalizeStand(entry.stand).split("/");

  // Caso:
  // OVAL/PAD 2
  // G65/U154-V153

  if (
    halls.length > 1 &&
    halls.length === stands.length
  ) {

    return halls.map((hall, i) =>
      buildRecord({
        name: entry.name,
        hall,
        stand: stands[i],
        category: entry.category
      })
    );
  }

  // Caso normale

  return [
    buildRecord(entry)
  ];
}

// ======================
// PROCESSING
// ======================

let cleaned = [];

for (const entry of data) {

  // skip record rotti
  if (!entry.name) continue;

  const expanded =
    expandEntry(entry);

  cleaned.push(...expanded);
}

// ======================
// RIMUOVI RECORD VUOTI
// ======================

cleaned = cleaned.filter(item =>
  item.name &&
  item.hall &&
  item.stand
);

// ======================
// DEDUPLICA
// ======================

const uniqueMap = new Map();

for (const item of cleaned) {

  const key = [
    item.name.toLowerCase(),
    item.hall.toLowerCase(),
    item.stand.toLowerCase()
  ].join("|");

  if (!uniqueMap.has(key)) {
    uniqueMap.set(key, item);
  }
}

cleaned = [...uniqueMap.values()];

// ======================
// ORDINA
// ======================

cleaned.sort((a, b) =>
  a.name.localeCompare(
    b.name,
    "it",
    { sensitivity: "base" }
  )
);

// ======================
// SALVA
// ======================

fs.writeFileSync(
  "data/espositori-clean.json",
  JSON.stringify(cleaned, null, 2),
  "utf8"
);

console.log(
  `Pulizia completata: ${cleaned.length} record`
);
