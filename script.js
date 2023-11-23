"use strict";

import {
  createComment,
  getComments,
  apiRegistration,
  apiLogin,
} from "./api.js";
import {
  renderAuthForm,
  renderRegForm,
  renderComments,
  renderAddForm,
} from "./view.js";
import { delay } from "./utils.js";

let commentsStore = [];
let isLoading = true;
let isCreating = false;
let user = null;

const nameInputElement = () => document.getElementById("name-input");
const textInputElement = () => document.getElementById("text-input");
const buttonElement = () => document.getElementById("add-button");
const regLink = () => document.getElementById("registration-link");
const logButton = () => document.getElementById("login-button");
const regButton = () => document.getElementById("reg-button");

const commentList = document.getElementById("list");
const addForm = document.getElementById("add-form");
const authForm = document.getElementById("auth-form");

const loadComments = () => {
  displayComments();
  getComments(user).then((comments) => {
    commentsStore = comments;
    isLoading = false;
    displayComments();
  });
};

const displayComments = () => {
  commentList.style.display = "block";
  authForm.style.display = "none";
  renderComments(commentsStore, isLoading);
  initEventListeners();
};

const initEventListeners = () => {
  initLikeListeners();
  initEditListeners();
  initAnswerComments();
  registrationLink();
};

const initLikeListeners = () => {
  for (const likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      likeButton.classList.add("-loading-like");
      delay(2000).then(() => {
        if (commentsStore[likeButton.dataset.index].liked) {
          commentsStore[likeButton.dataset.index].likes--;
          commentsStore[likeButton.dataset.index].liked = false;
        } else {
          commentsStore[likeButton.dataset.index].likes++;
          commentsStore[likeButton.dataset.index].liked = true;
        }
        likeButton.classList.remove("-loading-like");
        displayComments();
      });
    });
  }
};

const initEditListeners = () => {
  for (const editButton of document.querySelectorAll(".comment-button-edit")) {
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = parseInt(editButton.dataset.index);
      commentsStore
        .filter((c, i) => i !== index)
        .forEach((c) => (c.isEdit = false));
      const comment = commentsStore[index];
      if (comment.isEdit) {
        comment.text = document.getElementById("edit-textarea").value;
        comment.isEdit = false;
      } else {
        comment.isEdit = true;
      }
      displayComments();
    });
  }
};

const initAnswerComments = () => {
  for (const pressComments of document.querySelectorAll(".comment")) {
    pressComments.addEventListener("click", () => {
      const answer = pressComments.dataset.text;
      const anotherAnswer = pressComments.dataset.name;
      textInputElement().value =
        "QUOTE_BEGIN" + anotherAnswer + "\n" + answer + "QUOTE_END\n";
      textInputElement().focus();
      textInputElement().scrollTo();
    });
  }
};

const displayAddForm = (text = "") => {
  addForm.style.display = "flex";
  renderAddForm(isCreating, user, text);
  if (!isCreating) {
    initFormListeners();
  }
};

const initFormListeners = () => {
  nameInputElement().addEventListener("keyup", (ev) => {
    if (ev.key === "Enter") {
      addComment();
    }
  });
  textInputElement().addEventListener("keyup", (ev) => {
    if (ev.key === "Enter") {
      addComment();
    }
  });
  buttonElement().addEventListener("click", () => {
    addComment();
  });
};

const addComment = () => {
  let isValid = true;

  nameInputElement().classList.remove("add-form-error");
  if (nameInputElement().value === "") {
    nameInputElement().classList.add("add-form-error");
    isValid = false;
    nameInputElement().focus();
  }

  textInputElement().classList.remove("add-form-error");
  if (textInputElement().value === "") {
    textInputElement().classList.add("add-form-error");
    isValid = false;
    textInputElement().focus();
  }

  buttonElement().classList.remove("add-form-button-error");
  if (!isValid) {
    buttonElement().classList.add("add-form-button-error");
    return;
  }

  const comment = {
    text: textInputElement().value,
    name: nameInputElement().value,
  };

  isCreating = true;
  displayAddForm();

  createComment(comment, user)
    .then(() => {
      return getComments(user);
    })
    .then((comments) => {
      commentsStore = comments;
      isCreating = false;
      displayAddForm();
      displayComments();
    })
    .catch((error) => {
      isCreating = false;
      displayAddForm(comment.name, comment.text);
      if (error.name === "APIError") {
        if (error.message === "Сервер сломался, попробуй позже") {
          addComment();
        } else {
          alert(error.message);
        }
      } else {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
      console.warn(error);
    });
};

const registr = () => {
  const regName = document.getElementById("user-name").value;
  const regLogin = document.getElementById("user-login").value;
  const regPassword = document.getElementById("user-password").value;

  if (regName === "" || regLogin === "" || regPassword === "") {
    alert("Заполните пустые поля");
    return;
  }

  const regRequest = {
    login: regLogin,
    name: regName,
    password: regPassword,
  };

  apiRegistration(regRequest)
    .then((result) => {
      user = result.user;
      loadComments();
      displayAddForm();
    })
    .catch((error) => {
      alert(error);
    });
};

const login = () => {
  const loginValue = document.getElementById("user-login").value;
  const passwordValue = document.getElementById("user-password").value;

  if (loginValue === "" || passwordValue === "") {
    alert("Заполните пустые поля");
    return;
  }

  apiLogin(loginValue, passwordValue)
    .then((result) => {
      user = result.user;
      loadComments();
      displayAddForm();
    })
    .catch((error) => {
      alert(error);
    });
};

const registrationForm = () => {
  authForm.style.display = "block";
  commentList.style.display = "none";
  addForm.style.display = "none";
  renderRegForm();
  document.getElementById("add-button-reg").addEventListener("click", registr);
  loginButton();
};

const loginForm = () => {
  commentList.style.display = "none";
  addForm.style.display = "none";
  renderAuthForm();
  document.getElementById("add-button-login").addEventListener("click", login);
  registrationButton();
};

const registrationLink = () => {
  const link = regLink();
  if (link !== null) {
    link.addEventListener("click", registrationForm);
  }
};

const loginButton = () => {
  const log = logButton();
  if (log !== null) {
    log.addEventListener("click", () => {
      loginForm();
    });
  }
};

const registrationButton = () => {
  const reg = regButton();
  if (reg !== null) {
    reg.addEventListener("click", registrationForm);
  }
};

loadComments();
displayAddForm();
