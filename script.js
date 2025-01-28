"use strict";

const newBtn = document.querySelector(".newBtn");
const overlay = document.querySelector(".overlay");
const btnX = document.querySelector(".btnX");
const title = document.querySelector(".title");
const author = document.querySelector(".author");
const pages = document.querySelector(".pages");
const bookList = document.querySelector(".bookList");
const form = document.querySelector("form");
const check = document.querySelector(".check");

let titleText;
let authorName;
let pagesNum;
let isInputChecked;

check.addEventListener("change", (e) => {
  isInputChecked = check.checked;
});

title.addEventListener("input", (e) => {
  titleText = e.target.value;
});

author.addEventListener("input", (e) => {
  authorName = e.target.value;
});

pages.addEventListener("input", (e) => {
  pagesNum = e.target.value;
});

newBtn.addEventListener("click", () => {
  overlay.classList.remove("hidden");
});

btnX.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

function cardCreator(parametar) {
  let id = crypto.randomUUID();
  let isChecked = parametar;
  let isEditing = false;

  const getId = () => id;

  const switchIsChecked = () => {
    isChecked = !isChecked;
    return isChecked;
  };

  const getIsChecked = () => {
    return isChecked;
  };

  return { getId, switchIsChecked, getIsChecked };
}

function cardManager() {
  let cardData = [];

  const addData = (data) => {
    cardData.push(data);
  };

  const getData = (data) => {
    return cardData;
  };

  const setData = (data) => {
    cardData = data;
  };

  const removeCard = (id) => {
    const updatedCards = manager
      .getData()
      .filter((data) => data.getId() !== id);
    setData(updatedCards);
  };

  return {
    addData,
    getData,
    setData,
    removeCard,
  };
}

const manager = cardManager();

function createCard(id, isChecked) {
  const card = document.createElement("li");
  card.id = id;
  card.classList.add("card");
  card.innerHTML = `
  <button class="editBtn">Edit</button>
  <div class="textDiv"><p class="title-p"> ${titleText}</p>
  <p class="author-p">- ${authorName}</p>
  <p class="pages-p">${pagesNum} pages</p>
  <div class="cardBtns">
  <button class="checkBtn">${isChecked ? "Read ✔️" : "Unread ❌"}</button>
  <button class="deleteBtn">Delete Book</button></div>
  `;

  return card;
}

bookList.addEventListener("click", (e) => {
  const card = e.target.closest("li");
  if (!card) return;

  const id = card.id;
  const data = manager.getData().find((data) => data.getId() === id);
  if (e.target.classList.contains("checkBtn")) {
    data.switchIsChecked();

    data.getIsChecked()
      ? (checkBtn.textContent = "Read ✔️")
      : (checkBtn.textContent = "Unread ❌");
  }
  if (e.target.closest(".deleteBtn")) {
    card.remove();
    manager.removeCard(id);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newCard = cardCreator(isInputChecked);
  manager.addData(newCard);

  const card = createCard(newCard.getId(), newCard.getIsChecked());
  bookList.appendChild(card);

  title.value = "";
  author.value = "";
  pages.value = "";
  check.checked = false;
  isInputChecked = false;

  overlay.classList.add("hidden");
});
