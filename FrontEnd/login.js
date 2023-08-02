// Formulaire d'authentification

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  const data = {
    email: email,
    password: password,
  };

  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    const responseData = await response.json();

    const userId = responseData.userId;
    const token = responseData.token;

    // Stockez l'ID de l'utilisateur et le token dans le localStorage
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);

    // Authentification réussie
    window.location.href = "./index.html";
  } else {
    // Authentification échouée
    console.log("Erreur d'authentification");
    errorMessage.innerText =
      "La combinaison email et mot de passe est incorrecte.";
  }
});

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

emailInput.addEventListener("input", clearErrorMessage);
passwordInput.addEventListener("input", clearErrorMessage);
loginForm.addEventListener("submit", clearErrorMessage);

function clearErrorMessage() {
  errorMessage.innerText = "";
}
