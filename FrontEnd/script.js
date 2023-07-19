// Recupération des items de l'API
const reponse = await fetch("http://localhost:5678/api/works");
const apiWorks = await reponse.json();
console.log(apiWorks);
// Récupération des categories de l'API
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const apiCategories = await reponseCategories.json();

const gallerie = document.querySelector(".gallery");
const modalWorks = document.querySelector(".modal-works");

// Génération des items par défaut de la gallerie
for (let i = 0; i < apiWorks.length; i++) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const title = document.createElement("figcaption");

  gallerie.appendChild(figure);
  // modalWorks.appendChild(figure);

  img.src = apiWorks[i].imageUrl;
  img.alt = apiWorks[i].title;

  figure.appendChild(img);

  title.innerText = apiWorks[i].title;

  figure.appendChild(title);
}
// Generation des items pour la modal
for (let i = 0; i < apiWorks.length; i++) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const title = document.createElement("figcaption");
  const trashIcon = document.createElement("i");
  figure.innerHTML = `<i class="trashicon fa-solid fa-trash-can"></i>`;
  console.log(trashIcon);
  modalWorks.appendChild(figure);

  img.src = apiWorks[i].imageUrl;
  img.alt = apiWorks[i].title;

  figure.appendChild(img);

  title.innerText = "éditer";

  figure.appendChild(title);

  img.appendChild(trashIcon);
}

// Fonction de mise à jour de l'affichage de la gallerie
const affichageGallerie = (itemsCategorie) => {
  const gallerie = document.querySelector(".gallery");
  while (gallerie.firstChild) {
    gallerie.firstChild.remove();
  }

  for (let i = 0; i < itemsCategorie.length; i++) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const title = document.createElement("figcaption");

    gallerie.appendChild(figure);

    img.src = itemsCategorie[i].imageUrl;
    img.alt = itemsCategorie[i].title;

    figure.appendChild(img);

    title.innerText = itemsCategorie[i].title;

    figure.appendChild(title);
  }
};

// Creation des boutons de filtres par catégories
const divCategories = document.querySelector(".categories-buttons");
const boutons = {};

for (let index = 0; index < apiCategories.length; index++) {
  const categoriesBtn = document.createElement("button");
  categoriesBtn.classList.add("filter-btn", "id" + apiCategories[index].id);
  categoriesBtn.innerText = apiCategories[index].name;
  divCategories.appendChild(categoriesBtn);
  boutons[apiCategories[index].name] = document.querySelector(
    ".id" + apiCategories[index].id
  );
  console.log(boutons[apiCategories[index].name]);
}

const boutonTous = document.querySelector(".id0");

// AddEventListener des boutons de filtres par catégorie
boutonTous.addEventListener("click", () => {
  const ancienBoutonActif = document.querySelector(".button-active");
  if (ancienBoutonActif) {
    ancienBoutonActif.classList.remove("button-active");
  }
  affichageGallerie(apiWorks);

  boutonTous.classList.add("button-active");
});

const boutonObjets = document.querySelector(".id1");

boutonObjets.addEventListener("click", function () {
  const ancienBoutonActif = document.querySelector(".button-active");
  if (ancienBoutonActif) {
    ancienBoutonActif.classList.remove("button-active");
  }

  const objets = apiWorks.filter(function (apiWorks) {
    return apiWorks.categoryId === 1;
  });
  affichageGallerie(objets);
  boutonObjets.classList.add("button-active");
});

const boutonAppartements = document.querySelector(".id2");

boutonAppartements.addEventListener("click", function () {
  const ancienBoutonActif = document.querySelector(".button-active");
  if (ancienBoutonActif) {
    ancienBoutonActif.classList.remove("button-active");
  }
  const Appartements = apiWorks.filter(function (apiWorks) {
    return apiWorks.categoryId === 2;
  });
  affichageGallerie(Appartements);
  boutonAppartements.classList.add("button-active");
});

const boutonHotelsRestaurants = document.querySelector(".id3");

boutonHotelsRestaurants.addEventListener("click", function () {
  const ancienBoutonActif = document.querySelector(".button-active");
  if (ancienBoutonActif) {
    ancienBoutonActif.classList.remove("button-active");
  }
  const hotelsRestos = apiWorks.filter(function (apiWorks) {
    return apiWorks.categoryId === 3;
  });
  affichageGallerie(hotelsRestos);
  boutonHotelsRestaurants.classList.add("button-active");
});

const isLogged = Boolean(localStorage.getItem("token"));
if (isLogged) {
  document.querySelector(".login-btn").classList.add("hidden");
  document.querySelector(".categories-buttons").classList.add("hidden");
  document.querySelector(".gallery").classList.add("margintop");
} else {
  document.querySelector(".logout-btn").classList.add("hidden");
  document.querySelector(".admin").classList.add("hidden");
  document.querySelector(".portfolio-modifier").classList.add("hidden");
  document.querySelector(".categories-buttons").classList.remove("hidden");
  document.querySelector(".gallery").classList.remove("margintop");
}

document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  location.reload();
});

document.querySelector(".btn-show-modal").addEventListener("click", () => {
  document.querySelector(".modal").classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
});

document.querySelector(".btn-close-modal").addEventListener("click", () => {
  document.querySelector(".modal").classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

document.querySelector(".modal").addEventListener("click", () => {
  document.querySelector(".modal").classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

document.querySelector(".modal-wrapper").addEventListener("click", (e) => {
  e.stopPropagation();
});
