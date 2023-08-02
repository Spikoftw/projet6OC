const token = localStorage.getItem("token");
const apiPath = `http://localhost:5678/api/`

const fetchWorks = async () => {
  const response = await fetch(`${apiPath}works`);
  return response.json();
}

const addWork = body => fetch(`${apiPath}works`, {
  method: "POST",
  body,
  headers: {
    "Authorization": `Bearer ${token}`, // Inclure le token dans l'en-tête d'autorisation
  },
})

const deleteWork = idWork => fetch(`${apiPath}works/${idWork}`, {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${token}`,
  },
})

// Recupération des items dans l'API
const apiWorks = await fetchWorks()

// Récupération des categories dans l'API
const reponseCategories = await fetch(`${apiPath}categories`);
const apiCategories = await reponseCategories.json();

const gallerie = document.querySelector(".gallery");
const modalWorks = document.querySelector(".modal-works");

async function updateGalleryAndModal() {
  try {
    // Récupere la liste des items dans l'API
    const apiWorks = await fetchWorks()

    // Met a jour la gallerie
    affichageGallerie(apiWorks);

    // Met a jour la modal avec les nouvelles données
    const modalWorks = document.querySelector(".modal-works");
    modalWorks.innerHTML = ""; // Efface le contenu de la modal

    for (let i = 0; i < apiWorks.length; i++) {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const title = document.createElement("figcaption");
      const trashIcon = document.createElement("i");

      modalWorks.appendChild(figure);

      img.src = apiWorks[i].imageUrl;
      img.alt = apiWorks[i].title;

      figure.appendChild(img);

      title.innerText = "éditer";

      figure.appendChild(title);
      figure.appendChild(trashIcon);

      trashIcon.classList.add("trashicon", "fa-solid", "fa-trash-can");
      // Ajout du gestionnaire d'événement au clic sur l'icône "trash"
    }

    modalWorks.querySelectorAll('.trashicon').forEach((trash, i) => {
      trash.addEventListener("click", async (e) => {
        e.preventDefault()
        if (!token) {
          console.error("Token manquant. Veuillez vous connecter.");
          return;
        }

        const imageId = apiWorks[i].id; // Récupération de l'identifiant de l'image à supprimer

        try {
          // Envoyer la requête DELETE à l'API pour supprimer l'image
          await deleteWork(imageId)

          console.log("Image supprimée avec succès !");
          await updateGalleryAndModal()

        } catch (error) {
          // Erreur : gestion des erreurs éventuelles
          console.error("Une erreur s'est produite :", error);
        }
      });
    })
  } catch (error) {
    console.error("Error updating gallery and modal:", error);
  }
}


// Génération des items par défaut de la gallerie
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
// Generation des items pour la modal
for (let i = 0; i < apiWorks.length; i++) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const title = document.createElement("figcaption");
  const trashIcon = document.createElement("i"); // Ajout de l'icône "trash"
  trashIcon.classList.add("trashicon", "fa-solid", "fa-trash-can"); // Ajout des classes pour l'icône trash
  modalWorks.appendChild(figure);

  img.src = apiWorks[i].imageUrl;
  img.alt = apiWorks[i].title;

  figure.appendChild(img);

  title.innerText = "éditer";

  figure.appendChild(title);
  figure.appendChild(trashIcon); // Ajout de l'icône "trash" à la figure
};

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

const affichageModalWorks = (itemsModal) => {
  const modalWorks = document.querySelector(".modal-works");
  while (modalWorks.firstChild) {
    modalWorks.firstChild.remove();
  }

  for (let i = 0; i < itemsModal.length; i++) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const title = document.createElement("figcaption");
    const trashIcon = document.createElement("i"); // Ajout de l'icône "trash"
    trashIcon.classList.add("trashicon", "fa-solid", "fa-trash-can"); // Ajout des classes pour l'icône trash
    modalWorks.appendChild(figure);

    img.src = itemsModal[i].imageUrl;
    img.alt = itemsModal[i].title;

    figure.appendChild(img);

    title.innerText = "éditer";

    figure.appendChild(title);
    figure.appendChild(trashIcon); // Ajout de l'icône "trash" à la figure
  }
}

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

// Clique sur bouton logout
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  location.reload();
});

// Clique sur bouton "modifier"
document.querySelector(".btn-show-modal").addEventListener("click", async (e) => {
  e.preventDefault
  document.querySelector(".modal").classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  await updateGalleryAndModal();
});

// Clique de fermeture de la modal
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

// Changements de la modal au click sur le bouton "Ajouter une photo"
const btnAjoutPhoto = document.querySelector(".btn-primary");

// Gestion de la preview pour l'image
const imagePreview = document.getElementById("imagePreview");
const labelImgAdd = document.querySelector(".file");
const inputImage = document.getElementById("file");
const ctaAjoutBouton = document.getElementById("ctaAjoutBouton");
const descAjoutPhoto = document.querySelector(".descAjoutPhoto");

document.querySelector(".btn-primary").addEventListener("click", () => {
  const photoAdd = document.querySelector('.photo-add')
  photoAdd.classList.remove("hidden");
  modalWorks.classList.add("hidden");
  btnAjoutPhoto.classList.add("hidden");
  document.querySelector(".modal-title").innerText = "Ajout photo";
  document.querySelector(".btn-delete-gallery").style.display = "none";

  document.querySelector('.btn-back').classList.remove("hidden");

  // Formulaire d'ajouts de photos
  // Ajout du choix des catégorie avec l'API
  const categories = [];
  for (let i = 0; i < apiCategories.length; i++) {
    categories[i] = document.createElement("option");
    categories[i].value = apiCategories[i].name;
    categories[i].innerText = apiCategories[i].name;
  }

  // Créer une chaîne de caractères pour contenir les options
  let categoriesHTML = '<option value="" disabled selected></option>';

  // Concaténer les représentations HTML des options
  for (let i = 0; i < categories.length; i++) {
    categoriesHTML += `<option value="${apiCategories[i].id}">${apiCategories[i].name}</option>`;
  }

  document.getElementById('choix').innerHTML = categoriesHTML;

  btnAjoutPhoto.classList.add("hidden");

  imagePreview.classList.add("hidden")

  inputImage.addEventListener("change", (e) => {
    const file = e.target.files[0]; // Le fichier sélectionné par l'utilisateur

    if (file) {
      // Créer un objet URL pour obtenir l'URL de l'image en tant que base64
      const imageUrl = URL.createObjectURL(file);
      imagePreview.classList.remove("hidden")
      svgImg.classList.add("hidden")
      labelImgAdd.classList.add("hidden")
      ctaAjoutBouton.style.display = "none";
      descAjoutPhoto.classList.add("hidden")
      // modalWorkAjoutPhoto.style.padding = "0"

      // Mettre à jour la source de l'image de la preview
      imagePreview.src = imageUrl;
    } else {
      // Réinitialiser l'image de la preview si aucun fichier n'est sélectionné
      imagePreview.src = "";

    }
  });

  // Retour a la page précédente de la modal au clique sur la fleche
  document.querySelector('.btn-back').addEventListener("click", () => {
    document.getElementById("title").value = ""
    document.getElementById("file").value = ""

    imagePreview.classList.add("hidden")
    svgImg.classList.remove("hidden")
    labelImgAdd.classList.remove("hidden")
    ctaAjoutBouton.style.display = "flex";
    descAjoutPhoto.classList.remove("hidden")
    // On retire le formulaire
    const formulairePhoto = document.querySelector(".photo-add")
    formulairePhoto.classList.add("hidden")
    // Bouton valider cacher et remplacer par "Ajouter une photo"
    btnAjoutPhoto.classList.remove("hidden");
    modalWorks.classList.remove("hidden")
    modalWorks.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";
    document.querySelector('.btn-back').classList.add('hidden');
    document.querySelector(".btn-delete-gallery").style.display = "inherit";
  });

  // Vérification du remplissage du formulaire
  function isFormValid() {
    const titre = document.getElementById("title").value;
    const categorie = document.getElementById("choix").value;
    const imageInput = document.getElementById("file");
    const selectedFile = imageInput.files[0];

    return titre.trim() !== "" && categorie !== "" && selectedFile;
  }

  function toggleValiderButton() {
    const btnValider = document.querySelector(".btn-valider");
    btnValider.disabled = !isFormValid();
    btnValider.style.backgroundColor = isFormValid() ? "#1d6154" : ""; // Utilisez la couleur grise quand le bouton est désactivé
  }

  // Désactiver le bouton Valider par defaut
  toggleValiderButton();

  // Gestionnaire d'événement pour l'entrée de l'image
  inputImage.addEventListener("change", () => {
    toggleValiderButton();
  });

  document.getElementById("title").addEventListener("input", toggleValiderButton);
  document.getElementById("choix").addEventListener("change", toggleValiderButton);

  document.getElementById('formAjoutPhoto').addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche la soumission réelle du formulaire
    // Vérifier si le token est présent dans le localStorage

    if (!token) {
      console.error("Token manquant. Veuillez vous connecter.");
      return false; // Arrêter le traitement si le token est manquant
    }

    // Récupérer les valeurs saisies par l'utilisateur
    const titre = document.getElementById("title");
    const categorie = document.getElementById("choix");
    const image = document.getElementById("file"); // Le fichier sélectionné par l'utilisateur

    // Créer un objet avec les données du formulaire
    const formData = new FormData();
    formData.append("image", image.files[0]);
    formData.append("title", titre.value);
    formData.append("category", categorie.value);
    // Envoyer les données du formulaire à l'API en utilisant la méthode POST
    try {
      await addWork(formData)

      console.log("Données envoyées avec succès !");

      await updateGalleryAndModal();

      document.querySelector('.btn-back').click();
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }

    return false;
  });


});

