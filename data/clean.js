const fs = require("fs");

// ======================
// LEGGI FILE
// ======================

const raw = fs.readFileSync(
  "data/exhibitors.json",
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

  if (!category) {
    return null;
  }

  const normalized =
    category
      .toUpperCase()
      .trim();

  if (
    normalized.includes("SELF")
  ) {
    return "AUTORE SELF";
  }

  return null;
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

  const hall =
    normalizeHall(entry.hall);

  const stand =
    normalizeStand(entry.stand);

  const halls = hall.split("/");

  // Se c'è un solo padiglione
  // NON splittare MAI

  if (halls.length === 1) {
    return [
      buildRecord(entry)
    ];
  }

  // Se ci sono più padiglioni,
  // assumiamo che gli stand
  // siano separati da /

  const stands = stand.split("/");

  // split valido solo se quantità coincide

  if (halls.length === stands.length) {

    return halls.map((hall, i) =>
      buildRecord({
        name: entry.name,
        hall,
        stand: stands[i],
        category: entry.category
      })
    );
  }

  // fallback sicurezza

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
// RIMUOVI SOLO RECORD SENZA NOME
// ======================

cleaned = cleaned.filter(
  item =>
    item.name &&
    item.name.length > 1 &&
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
  "data/exhibitors-clean.json",
  JSON.stringify(cleaned, null, 2),
  "utf8"
);

console.log(
  `Pulizia completata: ${cleaned.length} record`
);
