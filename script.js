"use strict";

const newBtn = document.querySelector(".newBtn");
const overlay = document.querySelector(".overlay");
const btnX = document.querySelector(".btnX");
const title = document.querySelector(".title");
const author = document.querySelector(".author");
const pages = document.querySelector(".pages");
const bookList = document.querySelector(".bookList");
const currentForm = document.querySelector(".currentForm");
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

function cardCreator(parametar, title, author, pages) {
  let id = crypto.randomUUID();
  let isChecked = parametar;
  let isEditing = false;
  let titleValue = title;
  let authorValue = author;
  let pagesValue = pages;

  const setTitle = (value) => {
    titleValue = value;
  };

  const getTitle = () => {
    return titleValue;
  };

  const setAuthor = (value) => {
    authorValue = value;
  };

  const getAuthor = () => {
    return authorValue;
  };

  const setPages = (value) => {
    pagesValue = value;
  };

  const getPages = () => {
    return pagesValue;
  };

  const switchIsEditing = () => {
    isEditing = !isEditing;
    return isEditing;
  };

  const getIsEditing = () => isEditing;

  const getId = () => id;

  const switchIsChecked = () => {
    isChecked = !isChecked;
    return isChecked;
  };

  const getIsChecked = () => {
    return isChecked;
  };

  return {
    getId,
    switchIsChecked,
    getIsChecked,
    switchIsEditing,
    getIsEditing,
    setTitle,
    getTitle,
    setAuthor,
    getAuthor,
    setPages,
    getPages,
  };
}

const newCard = cardCreator();

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

function createCard(id, isChecked, title, author, pages) {
  const card = document.createElement("li");
  card.id = id;
  card.classList.add("card");
  card.innerHTML = `
  <button class="editBtn">Edit</button>
  <div class="textDiv"><p class="title-p"> ${title}</p>
  <p class="author-p">- ${author}</p>
  <p class="pages-p">${pages} pages</p>
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
  const checkBtn = card.querySelector(".checkBtn");

  if (e.target.closest(".checkBtn")) {
    data.switchIsChecked();
    checkBtn.textContent = data.getIsChecked() ? "Read ✔️" : "Unread ❌";
  }

  if (e.target.closest(".deleteBtn")) {
    card.remove();
    manager.removeCard(id);
  }

  if (e.target.closest(".editBtn")) {
    data.switchIsEditing();

    if (data.getIsEditing()) {
      card.innerHTML = `
        <form class="editingForm">
          <button class="finishEditBtn" type="submit">Finish Editing</button>
          <input type="text" class="editedTitle edit-I" value="${data.getTitle()}" />
          <input type="text" class="editedName edit-I" value="${data.getAuthor()}" />
          <input type="number" class="editedNum edit-I" value="${data.getPages()}" />
        </form>
      `;

      const editingForm = card.querySelector(".editingForm");

      editingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newTitle = editingForm.querySelector(".editedTitle").value;
        const newAuthor = editingForm.querySelector(".editedName").value;
        const newPages = editingForm.querySelector(".editedNum").value;

        data.setTitle(newTitle);
        data.setAuthor(newAuthor);
        data.setPages(newPages);
        data.switchIsEditing();

        card.innerHTML = `
          <button class="editBtn">Edit</button>
          <div class="textDiv">
            <p class="title-p">${data.getTitle()}</p>
            <p class="author-p">- ${data.getAuthor()}</p>
            <p class="pages-p">${data.getPages()} pages</p>
            <div class="cardBtns">
              <button class="checkBtn">${
                data.getIsChecked() ? "Read ✔️" : "Unread ❌"
              }</button>
              <button class="deleteBtn">Delete Book</button>
            </div>
          </div>
        `;
      });
    }
  }
});

currentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newCard = cardCreator(isInputChecked, titleText, authorName, pagesNum);
  manager.addData(newCard);

  const card = createCard(
    newCard.getId(),
    newCard.getIsChecked(),
    newCard.getTitle(),
    newCard.getAuthor(),
    newCard.getPages()
  );
  bookList.appendChild(card);

  title.value = "";
  author.value = "";
  pages.value = "";
  check.checked = false;
  isInputChecked = false;

  overlay.classList.add("hidden");
});
