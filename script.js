"use strict";

const buttonElementDel = document.getElementById("add-button-delete");
const listElement = document.getElementById("list");
const commentElements = document.querySelectorAll('.comment');
const addFormElement = document.querySelectorAll(".add-form")[0];
let isLoading = true;

const nameInputElement = () => document.getElementById("name-input");
const textInputElement = () => document.getElementById("text-input");
const buttonElement = () => document.getElementById("add-button");

const requestComment = () => {
    const fetchPromise = fetch('https://wedev-api.sky.pro/api/v1/:ann-kurymshina/comments', {
        method: "GET"
    });

    isLoading = true;
    renderAddForm();

    fetchPromise.then((response) => {
        const jsonPromise = response.json();

        jsonPromise.then((responseData) => {
            console.log(responseData);

            commentsAll = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    text: comment.text,
                    time: new Date(comment.date),
                    likes: comment.likes,
                    liked: comment.false,
                    isEdit: comment.isEdit,
                };
            });
            isLoading = false;
            renderComments();
            renderAddForm();
        });
    });

};

let commentsAll = [];

const initEventListeners = () => {
    initLikeListeners();
    initEditListeners();
    initAnswerComments();
};

const renderComments = () => {
    const commentsHtml = commentsAll.map((comment, index) => {
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
    initEventListeners();
};

const renderAddForm = () => {
    if (isLoading) {
        addFormElement.innerHTML = `
        <div class="add-form-info">
            <p class="add-form-addition">Загружаем комментарии</p>
            <div class="add-form-spinner">
                <div class="dots"></div>
            </div>
        </div>`
    } else {
        addFormElement.innerHTML = `
        <input type="text" class="add-form-name" id="name-input" ; placeholder="Введите ваше имя" />
        <textarea type="textarea" class="add-form-text" id="text-input" ; placeholder="Введите ваш коментарий"
          rows="4"></textarea>
        <div class="add-form-row">
          <button class="add-form-button" id="add-button">Написать</button>
        </div>`
        initFormListeners();
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
    };
};

const initLikeListeners = () => {
    for (const likeButton of document.querySelectorAll('.like-button')) {
        likeButton.addEventListener("click", (event) => {
            event.stopPropagation();

            if (commentsAll[likeButton.dataset.index].liked) {
                commentsAll[likeButton.dataset.index].likes--;
                commentsAll[likeButton.dataset.index].liked = false;
            } else {
                commentsAll[likeButton.dataset.index].likes++;
                commentsAll[likeButton.dataset.index].liked = true;
            };

            renderComments();
        });
    };
};

const initEditListeners = () => {
    for (const editButton of document.querySelectorAll('.comment-button-edit')) {
        editButton.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = parseInt(editButton.dataset.index);
            commentsAll.filter((c, i) => i !== index).forEach((c) => c.isEdit = false);
            const comment = commentsAll[index];
            if (comment.isEdit) {
                comment.text = document.getElementById('edit-textarea').value;
                comment.isEdit = false;
            } else {
                comment.isEdit = true;
            }
            renderComments();
        });
    };
};

const initAnswerComments = () => {
    for (const pressComments of document.querySelectorAll('.comment')) {
        pressComments.addEventListener("click", () => {
            const answer = pressComments.dataset.text;
            const anotherAnswer = pressComments.dataset.name;

            textInputElement().value = "QUOTE_BEGIN" + anotherAnswer + "\n" + answer + "QUOTE_END\n";
            textInputElement().focus();
            textInputElement().scrollTo();
        });
    };
};

const initFormListeners = () => {
    nameInputElement().addEventListener('keyup', (ev) => {
        if (ev.key === 'Enter') {
            comments();
        }
    });

    textInputElement().addEventListener('keyup', (ev) => {
        if (ev.key === 'Enter') {
            comments();
        }
    });

    buttonElement().addEventListener("click", () => {
        comments();
    });
}

buttonElementDel.addEventListener("click", () => {
    commentsDel();
});

function comments() {

    let isValid = true;

    nameInputElement().classList.remove("add-form-error");
    if (nameInputElement().value === '') {
        nameInputElement().classList.add("add-form-error");
        isValid = false;
        nameInputElement().focus();
    };

    textInputElement().classList.remove("add-form-error");
    if (textInputElement().value === '') {
        textInputElement().classList.add("add-form-error");
        isValid = false;
        textInputElement().focus();
    };

    buttonElement().classList.remove("add-form-button-error");
    if (!isValid) {
        buttonElement().classList.add("add-form-button-error");
        return;
    };

    const fetchPromise = fetch('https://wedev-api.sky.pro/api/v1/:ann-kurymshina/comments', {
        method: "POST",
        body: JSON.stringify({
            text: textInputElement().value,
            name: nameInputElement().value,
        }),
    });
    isLoading = true;
    renderAddForm();

    fetchPromise.then((response) => {
        response.json().then((responseData) => {
            console.log(responseData);
            requestComment();
        });
    });
};

function formatDateTime(date) {
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

function commentsDel() {
    const newOldListHtml = listElement.innerHTML;
    listElement.innerHTML =
        (newOldListHtml.substring
            (0, newOldListHtml.lastIndexOf('<li class="comment">')));
};

requestComment();
renderAddForm();

