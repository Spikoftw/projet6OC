const token = localStorage.getItem("token");
const isLogged = Boolean(token);
const apiPath = `http://localhost:5678/api/`

// Fonction qui supprime le token et qui renvoie vers la page de login
const logout = () => {
  localStorage.removeItem("token");
  window.location = "/login.html";
}

// Fonction qui récupére les Works depuis l'API
const fetchWorks = async () => {
  const response = await fetch(`${apiPath}works`);
  return response.json();
}

// Fonction qui récupére les Catégories depuis l'API
const fetchCategories = async () => {
  const response = await fetch(`${apiPath}categories`);
  return response.json();
}

// Fonction qui ajoute un work
const addWork = async body => {
  // Si on n'est pas loggé, lance la fonction logout.
  if (!isLogged) {
    logout()
  }

  const res = await fetch(`${apiPath}works`, {
    method: "POST",
    body,
    headers: {
      "Authorization": `Bearer ${token}`, // Inclure le token dans l'en-tête d'autorisation
    },
  });
  // Si il y'a un token mais qu'il est pas valide et fait une erreur, lance la fonction logout.
  if (res.status === 401) {
    logout();
  }
}

// Fonction qui supprime un work
const deleteWork = async idWork => {
  if (!isLogged) {
    logout()
  }

  const res = await fetch(`${apiPath}works/${idWork}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`, // Inclure le token dans l'en-tête d'autorisation
    },
  });

  if (res.status === 401) {
    logout();
  }
}

// Recupération des items dans l'API
const apiWorks = await fetchWorks()

// Récupération des categories dans l'API
const apiCategories = await fetchCategories();

const modalWorks = document.querySelector(".modal-works");

// Fonction qui met à jour l'affichage de la gallerie et de la modal.
function updateWork(container, isModal, apiWork) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const title = document.createElement("figcaption");
  // Si c'est une modal, on ajoute les composants qui concerne la modal
  if (isModal) {
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("trashicon", "fa-solid", "fa-trash-can");
    figure.appendChild(trashIcon)

    trashIcon.addEventListener("click", async () => {
      try {
        // Envoyer la requête DELETE à l'API pour supprimer l'image
        await deleteWork(apiWork.id)

        console.log("Image supprimée avec succès !");
        await buildGalleryAndModal()

      } catch (error) {
        // Erreur : gestion des erreurs éventuelles
        console.error("Une erreur s'est produite :", error);
      }
    })
  }

  img.src = apiWork.imageUrl;
  img.alt = apiWork.title;

  figure.appendChild(img);

  title.innerText = isModal ? "éditer" : apiWork.title;

  figure.appendChild(title);
  container.appendChild(figure)
}

// Fonction qui construit la modal et la gallerie en même temps et qui filtre par catégories.
async function buildGalleryAndModal(galleryId = null) {
  try {
    // Récupere la liste des items dans l'API
    const apiWorks = await fetchWorks()

    const gallerie = document.querySelector(".gallery");
    gallerie.innerHTML = "";

    // Met a jour la modal avec les nouvelles données
    modalWorks.innerHTML = ""; // Efface le contenu de la modal

    apiWorks.filter(work => {
      if (galleryId) {
        return work.category.id === galleryId
      }

      return true;
    }).forEach(work => {
      updateWork(gallerie, false, work)
      updateWork(modalWorks, true, work)
    });
  } catch (error) {
    console.error("Error updating gallery and modal:", error);
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

  categoriesBtn.addEventListener('click', () => {
    buildGalleryAndModal(apiCategories[index].id);
  })
}

const boutonTous = document.querySelector(".id0");

// AddEventListener des boutons de filtres par catégorie
boutonTous.addEventListener("click", () => {
  buildGalleryAndModal();
});


// Si l'utilisateur est loggé ou pas, on cache ou pas certains élements
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
document.querySelector(".btn-show-modal").addEventListener("click", () => {
  document.querySelector(".modal").classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
});

// Fonction pour reset les erreurs du formulaire
const resetForm = () => {
  document.getElementById("img-error").innerText = ""
  document.getElementById("title-error").innerText = ""
  document.getElementById("category-error").innerText = ""
  document.getElementById("title").value = ""
  document.getElementById("file").value = ""
  document.getElementById('choix').value = ""
}

// Clique de fermeture de la modal
document.querySelector(".btn-close-modal").addEventListener("click", () => {
  // on réinitialise les messages d'erreurs du formulaire de la modal
  resetForm()

  document.querySelector(".modal").classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});


// Si on clique à l'extérieur de la modal, on la ferme et on reset le formulaire.
document.querySelector(".modal").addEventListener("click", () => {
  // on réinitialise les messages d'erreurs du formulaire de la modal
  resetForm()

  document.querySelector(".modal").classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

document.querySelector(".modal-wrapper").addEventListener("click", (e) => {
  e.stopPropagation();
});


const btnAjoutPhoto = document.querySelector(".btn-primary");

// Gestion de la preview pour l'image
const imagePreview = document.getElementById("imagePreview");
const labelImgAdd = document.querySelector(".file");
const inputImage = document.getElementById("file");
const ctaAjoutBouton = document.getElementById("ctaAjoutBouton");
const descAjoutPhoto = document.querySelector(".descAjoutPhoto");

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

// A chaque changement de l'input file, affiche une preview de l'image uploader.
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

    // Mettre à jour la source de l'image de la preview
    imagePreview.src = imageUrl;
  } else {
    // Réinitialiser l'image de la preview si aucun fichier n'est sélectionné
    imagePreview.src = "";

  }
  toggleValiderButton();
});

const modalTitle = document.getElementById("modalTitle")

// Retour a la page précédente de la modal au clique sur la fleche
document.querySelector('.btn-back').addEventListener("click", () => {
  // on réinitialise les messages d'erreurs du formulaire de la modal
  resetForm()
  modalTitle.classList.remove("modal-title-form")
  modalTitle.classList.add("modal-title")
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
  modalTitle.innerText = "Gallerie photo";
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
  btnValider.style.backgroundColor = isFormValid() ? "#1d6154" : ""; // Utilisez la couleur grise quand le bouton est désactivé
}

document.getElementById('formAjoutPhoto').addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêche la soumission réelle du formulaire

  // Vérification de la validité du formulaire
  if (isFormValid()) {

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

      await buildGalleryAndModal();

      document.querySelector('.btn-back').click();
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }

    return false;
  }


  // Si le formulaire n'est pas valide
  else {
    const titre = document.getElementById("title").value;
    const categorie = document.getElementById("choix").value;
    const imageInput = document.getElementById("file");
    const selectedFile = imageInput.files[0];

    if (!selectedFile) {
      document.getElementById("img-error").innerText = "Veuillez ajouter une image."
    }
    else if (titre.trim() === "") {
      document.getElementById("title-error").innerText = "Veuillez ajouter un titre."
    }
    else if (categorie === "") {
      document.getElementById("category-error").innerText = "Veuillez sélectionner une catégorie."
    }
    return
  }
});

// Au clique sur le bouton Ajouter une photo dans la modal, on remplace ce qu'il y'a dans la modal par le formulaire
btnAjoutPhoto.addEventListener("click", () => {

  const photoAdd = document.querySelector('.photo-add')
  photoAdd.classList.remove("hidden");
  modalWorks.classList.add("hidden");
  btnAjoutPhoto.classList.add("hidden");
  modalTitle.innerText = "Ajout photo";
  modalTitle.classList.add("modal-title-form")
  modalTitle.classList.remove("modal-title")
  document.querySelector(".btn-delete-gallery").style.display = "none";

  document.querySelector('.btn-back').classList.remove("hidden");

  btnAjoutPhoto.classList.add("hidden");

  imagePreview.classList.add("hidden")

  // Désactiver le bouton Valider par defaut
  toggleValiderButton();

  document.getElementById("title").addEventListener("input", toggleValiderButton);
  document.getElementById("choix").addEventListener("change", toggleValiderButton);

});

buildGalleryAndModal();
