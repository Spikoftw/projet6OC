const reponse = await fetch("http://localhost:5678/api/works");
const apiWorks = await reponse.json();
console.log(apiWorks);
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const apiCategories = await reponseCategories.json();

const gallerie = document.querySelector(".gallery");

for (let i = 0; i < apiWorks.length; i++) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const title = document.createElement("figcaption");

  gallerie.appendChild(figure);

  img.src = apiWorks[i].imageUrl;
  img.alt = apiWorks[i].title;

  figure.appendChild(img);

  title.innerText = apiWorks[i].title;

  figure.appendChild(title);
}

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

boutonTous.addEventListener("click", () => {
  affichageGallerie(apiWorks);
});

const boutonObjets = document.querySelector(".id1");

boutonObjets.addEventListener("click", function () {
  const objets = apiWorks.filter(function (apiWorks) {
    return apiWorks.categoryId === 1;
  });
  affichageGallerie(objets);
});

const boutonAppartements = document.querySelector(".id2");

boutonAppartements.addEventListener("click", function () {
  const Appartements = apiWorks.filter(function (apiWorks) {
    return apiWorks.categoryId === 2;
  });
  affichageGallerie(Appartements);
});

const boutonHotelsRestaurants = document.querySelector(".id3");

boutonHotelsRestaurants.addEventListener("click", function () {
  const hotelsRestos = apiWorks.filter(function (apiWorks) {
    return apiWorks.categoryId === 3;
  });
  affichageGallerie(hotelsRestos);
});
