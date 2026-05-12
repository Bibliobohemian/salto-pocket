const stands = document.querySelectorAll(".stand");

const popup = document.getElementById("popup");
const popupName = document.getElementById("popupName");
const popupStand = document.getElementById("popupStand");

const searchInput = document.getElementById("searchInput");

stands.forEach((stand) => {

  stand.addEventListener("click", () => {

    clearActive();

    stand.classList.add("active");

    const name = stand.dataset.name;
    const code = stand.dataset.stand;

    popupName.textContent = name;
    popupStand.textContent = `Stand ${code}`;

    popup.classList.remove("hidden");

  });

});

function clearActive(){
  stands.forEach((s) => s.classList.remove("active"));
}

searchInput.addEventListener("input", (e) => {

  const value = e.target.value.toLowerCase();

  clearActive();

  let found = false;

  stands.forEach((stand) => {

    const name = stand.dataset.name.toLowerCase();

    if(name.includes(value) && value !== ""){

      stand.classList.add("active");

      popupName.textContent = stand.dataset.name;
      popupStand.textContent = `Stand ${stand.dataset.stand}`;

      popup.classList.remove("hidden");

      found = true;

    }

  });

  if(!found && value === ""){
    popup.classList.add("hidden");
  }

});
