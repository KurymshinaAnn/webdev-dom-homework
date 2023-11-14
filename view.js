import { formatDateTime } from './utils.js';

const listElement = document.getElementById('list');
const addFormElement = document.getElementById('add-form');
const authDiv = document.getElementById("auth-form");


export const renderAuthForm = () => {
  authDiv.innerHTML = `<div class="add-form-login">
  <p class="add-form-login-text">Форма входа</p>
  <input type="text" class="add-form-sign-in-name" id="user-login" placeholder="Имя пользователя">
  <input type="password" class="add-form-sign-in-name" id="user-password" placeholder="Пароль">
  <button class="add-form-sign-in-button" id="add-button-login">Войти</button>
  <a class="add-form-sign-up" id="reg-button">Зарегистрироваться</a>
  </div>`
};

export const renderRegForm = () => {
  authDiv.innerHTML = `<div class="add-form-login">
  <p class="add-form-login-text">Форма регистрации</p>
  <input type="text" class="add-form-sign-in-name" id="user-name" placeholder="Введите Имя пользователя">
  <input type="text" class="add-form-sign-in-name" id="user-login" placeholder="Введите логин">
  <input type="password" class="add-form-sign-in-name" id="user-password" placeholder="Введите пароль">
  <button class="add-form-sign-in-button" id="add-button-reg">Зарегистрироваться</button>
  <a class="add-form-sign-up" id="login-button">Войти</a>
  </div>`
};

export const renderAddForm = (isCreating, user, name = '', text = '') => {
  if (user === null){
    addFormElement.innerHTML = `
    <div class="registration-block">
    <p>Что бы добавить комментарий, <a class="registration-link" id="registration-link">зарегистрируйтесь</a>.</p>
    </div>`
    return;
  }

  if (isCreating) {
      addFormElement.innerHTML = `
      <div class="add-form-info">
          <p class="add-form-addition">Комментарий загружается</p>
          <div class="add-form-spinner">
              <div class="dots"></div>
          </div>
      </div>`
  } else {
      addFormElement.innerHTML = `
      <input type="text" class="add-form-name" id="name-input" placeholder="Введите ваше имя" disabled value="${user.name}"/>
      <textarea type="textarea" class="add-form-text" id="text-input" placeholder="Введите ваш коментарий"
        rows="4">${text}</textarea>
      <div class="add-form-row">
        <button class="add-form-button" id="add-button">Написать</button>
      </div>`
  }
};

export const renderComments = (comments, isLoading) => {
  if (isLoading) {
    listElement.innerHTML = `
        <div class="add-form-info">
            <p class="add-form-addition">Пожалуйста подождите, загружаем комментарии</p>
        </div>`
  } else {
    const commentsHtml = comments.map((comment, index) => {
      return `<li class="comment" data-name="${comment.name}" data-text="${comment.text}">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${formatDateTime(comment.time)}</div>
        </div>
        <div class="comment-body">
          ${renderCommentsText(comment)}
        </div>
        <div class="comment-footer">
          <div class="comment-button">
            <button class="comment-button-edit ${comment.isEdit ? "comment-button-edit-save" : ""}" 
            id="comment-button-edit" data-index=${index}>
            ${comment.isEdit ? "Сохранить" : "Редактировать"}
            </button>
          </div>
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${comment.liked ? "-active-like" : ""}" data-index="${index}"></button>
          </div>
        </div>
      </li>`
    }).join('');
    listElement.innerHTML = commentsHtml;
  }
};

const renderCommentsText = (comment) => {
  if (comment.isEdit) {
    return `<textarea class="comment-text-edit" id="edit-textarea" value="">${comment.text}</textarea>`
  } else {
    const renderedText = comment.text
      .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
      .replaceAll("QUOTE_END", "</div>");
    return `<div class="comment-text" data-text="${comment.text}">
      ${renderedText}
      </div>`
  }
};
