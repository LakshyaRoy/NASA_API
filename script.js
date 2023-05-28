"use strict";

const resultNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count} `;

let favorites = {};

let resultsArray = [];

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "results") {
    resultNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }

  loader.classList.add("hidden");
}

function navItemsShow() {}

function createDomNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  // console.log("currentArray", page, currentArray);
  currentArray.forEach((result) => {
    //  card container
    const card = document.createElement("div");
    card.classList.add("card");
    // link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of the Day";
    image.loading = "lazy ";
    image.classList.add("card-img-top");
    // card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // save text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add To Favorites";
      saveText.setAttribute("onclick", `saveFavorites('${result.url}')`);
    } else {
      saveText.textContent = "Remove Favorites";
      saveText.setAttribute("onclick", `removeFavorites('${result.url}')`);
    }
    // text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = result.explanation;
    // Footer Container
    const Footer = document.createElement("small");
    Footer.classList.add("text-muted");
    // date
    const date = document.createElement("strong");
    date.textContent = result.date;
    // copyright
    const copyRightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyRight = document.createElement("span");
    copyRight.textContent = ` ${copyRightResult}`;
    // append
    Footer.append(date, copyRight);
    cardBody.append(cardTitle, cardText, saveText, Footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}
function upDateDom(page) {
  //  get fav from local storage
  if (localStorage.getItem("NasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("NasaFavorites"));
    // console.log("fav ->", favorites);
  }
  imagesContainer.textContent = "";
  createDomNodes(page);
  showContent(page);
}

//  get 10 images from nasa api
async function getNasaPicture() {
  // show loader
  loader.classList.remove("hidden");

  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    upDateDom("results");
    // console.log(resultsArray);
  } catch (e) {
    console.log(e);
  }
}

// add result to fav
function saveFavorites(itemUrl) {
  // loop through result array to select fav
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // console.log(JSON.stringify(favorites));

      // show save confirm
      saveConfirmed.hidden = false;

      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);

      //  set fav to local storage

      localStorage.setItem("NasaFavorites", JSON.stringify(favorites));
    }
  });
}

// remove result from fav

function removeFavorites(itemUrl) {
  // loop through result array to select fav

  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // console.log(JSON.stringify(favorites));

    //  set fav to local storage

    localStorage.setItem("NasaFavorites", JSON.stringify(favorites));
    upDateDom("favorites");
  }
}

//  on load

getNasaPicture();
