"use strict";
const buttonElement = document.getElementById("add-button");
const buttonElementDel = document.getElementById("add-button-delete");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");

const commentElements = document.querySelectorAll('.comment');

const commentsAll = [
    {
        name: "Глеб Фокин",
        text: "Это будет первый комментарий на этой странице",
        time: "12.02.22 12:18",
        likes: 75,
        liked: false,
        isEdit: false,
    },
    {
        name: "Варвара Новина",
        text: "Мне нравится как оформлена эта страница! ❤",
        time: "13.02.22 19:22",
        likes: 62,
        liked: false,
        isEdit: false,
    },
];

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
          <div>${comment.time}</div>
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

            textInputElement.value = "QUOTE_BEGIN" + anotherAnswer + "\n" + answer + "QUOTE_END\n";
            textInputElement.focus();
            textInputElement.scrollTo();
        });
    };
};

renderComments();

nameInputElement.addEventListener('keyup', (ev) => {
    if (ev.key === 'Enter') {
        comments();
    }
});

textInputElement.addEventListener('keyup', (ev) => {
    if (ev.key === 'Enter') {
        comments();
    }
});


buttonElement.addEventListener("click", () => {
    comments();
});

buttonElementDel.addEventListener("click", () => {
    commentsDel();
});

function comments() {

    let isValid = true;

    nameInputElement.classList.remove("add-form-error");
    if (nameInputElement.value === '') {
        nameInputElement.classList.add("add-form-error");
        isValid = false;
        nameInputElement.focus();
    };

    textInputElement.classList.remove("add-form-error");
    if (textInputElement.value === '') {
        textInputElement.classList.add("add-form-error");
        isValid = false;
        textInputElement.focus();
    };

    buttonElement.classList.remove("add-form-button-error");
    if (!isValid) {
        buttonElement.classList.add("add-form-button-error");
        return;
    };

    const date = new Date();

    commentsAll.push({
        name: nameInputElement.value
            .replaceAll("<", "&lt;")
            .replaceAll("<", "&gt;"),
        text: textInputElement.value
            .replaceAll("<", "&lt;")
            .replaceAll("<", "&gt;"),
        time: formatDateTime(date),
        likes: 0,
        liked: false,
        isEdit: false,
    });

    renderComments();

    nameInputElement.value = '';
    textInputElement.value = '';

    nameInputElement.focus();
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


