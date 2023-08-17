const listElement = document.getElementById('list');
const addFormElement = document.getElementById('add-form');

export const renderAddForm = (isCreating, name = '', text = '') => {
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
      <input type="text" class="add-form-name" id="name-input" placeholder="Введите ваше имя" value="${name}"/>
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

const formatDateTime = (date) => {
  let day = '' + date.getDate();
  let month = '' + (date.getMonth() + 1);
  let year = ('' + date.getFullYear()).substring(2);
  let hours = date.getHours();
  let minutes = '' + date.getMinutes();

  if (day.length < 2)
    day = '0' + day;
  if (month.length < 2)
    month = '0' + month;
  if (minutes.length < 2)
    minutes = '0' + minutes;
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};