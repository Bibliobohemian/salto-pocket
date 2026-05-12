const exhibitors = [

  {
    name: "BAO Publishing",
    stand: "B66",
    hall: "Padiglione 1"
  },

  {
    name: "Becco Giallo",
    stand: "C40",
    hall: "Padiglione 1"
  },

  {
    name: "Coconino Press",
    stand: "B24",
    hall: "Padiglione 1"
  },

  {
    name: "NN Editore",
    stand: "Q40",
    hall: "Padiglione 3"
  },

  {
    name: "Iperborea",
    stand: "R32",
    hall: "Padiglione 3"
  },

  {
    name: "minimum fax",
    stand: "N39",
    hall: "Padiglione 3"
  }

];

const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

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

    results.innerHTML += `
      <div class="card">
        <h2>${item.name}</h2>
        <p><strong>${item.hall}</strong></p>
        <p>Stand ${item.stand}</p>
      </div>
    `;
  });

}

renderResults(exhibitors);

searchInput.addEventListener("input", (e) => {

  const value = e.target.value.toLowerCase();

  const filtered = exhibitors.filter((item) =>
    item.name.toLowerCase().includes(value)
  );

  renderResults(filtered);

});
