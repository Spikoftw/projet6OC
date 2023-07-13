const reponse = await fetch("http://localhost:5678/api/works")
const apiWorks = await reponse.json()
console.log(apiWorks)





const gallerie = document.querySelector(".gallery")

for (let i = 0; i < apiWorks.length; i++) {
const figure = document.createElement("figure")
gallerie.appendChild(figure)
const img = document.createElement("img")
img.src = apiWorks[i].imageUrl
figure.appendChild(img)
const title = document.createElement("figcaption")
title.innerText = apiWorks[i].title
figure.appendChild(title)
}

/* <figure>
<img src="assets/images/abajour-tahina.png" alt="Abajour Tahina" />
<figcaption>Abajour Tahina</figcaption>
</figure> */