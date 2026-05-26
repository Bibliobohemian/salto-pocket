async function normalizeMap() {
  const response = await fetch(
    "./maps/2026/pad1/raw-map.json"
  );

  const raw = await response.json();

  const STAND_REGEX =
    /^[A-Z]\d+(-[A-Z]\d+)?$/;

  function detectType(name) {
    if (!name) return "unknown";

    if (STAND_REGEX.test(name))
      return "stand";

    if (name.includes("Sala"))
      return "room";

    if (name.includes("Bar"))
      return "food";

    if (name.includes("Ristorante"))
      return "food";

    if (name.includes("Bagno"))
      return "wc";

    if (name.includes("Ingresso"))
      return "entrance";

    if (name.includes("Infopoint"))
      return "info";

    if (name.includes("fumatori"))
      return "smoking";

    if (name.includes("bambini"))
      return "kids";

    return "service";
  }

  function createId(name, index) {
    return (
      "P1_" +
      name
        .toUpperCase()
        .replaceAll(" ", "_")
        .replaceAll("-", "_")
        .replace(/[^\w]/g, "") +
      "_" +
      index
    );
  }

  const normalized = raw.areas.map(
    (area, index) => ({
      id: createId(area.name, index),

      hall: "pad1",

      name: area.name,

      type: detectType(area.name),

      shape: area.shape,

      coords: area.coords
    })
  );

  console.log(normalized);

  downloadJSON(
    normalized,
    "areas.json"
  );
}

function downloadJSON(data, filename) {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    {
      type: "application/json"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = filename;

  a.click();

  URL.revokeObjectURL(url);
}

normalizeMap();
