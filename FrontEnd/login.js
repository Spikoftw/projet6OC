// Formulaire d'authentification

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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

  if (response.ok) {
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
  }
});
