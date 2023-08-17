'use strict';

import { createComment, getComments } from './api.js';
import { renderComments, renderAddForm } from './view.js';
import { delay } from './utils.js';

let commentsStore = [];
let isLoading = true;
let isCreating = false;

const nameInputElement = () => document.getElementById('name-input');
const textInputElement = () => document.getElementById('text-input');
const buttonElement = () => document.getElementById('add-button');

const loadComments = () => {
    displayComments();
    getComments().then(comments => {
        commentsStore = comments;
        isLoading = false;
        displayComments();
    });
};

const displayComments = () => {
    renderComments(commentsStore, isLoading);
    initEventListeners();
}

const initEventListeners = () => {
    initLikeListeners();
    initEditListeners();
    initAnswerComments();
};

const initLikeListeners = () => {
    for (const likeButton of document.querySelectorAll('.like-button')) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            likeButton.classList.add('-loading-like');
            delay(2000).then(() => {
                if (commentsStore[likeButton.dataset.index].liked) {
                    commentsStore[likeButton.dataset.index].likes--;
                    commentsStore[likeButton.dataset.index].liked = false;
                } else {
                    commentsStore[likeButton.dataset.index].likes++;
                    commentsStore[likeButton.dataset.index].liked = true;
                }
                likeButton.classList.remove('-loading-like');
                displayComments();
            });
        });
    };
};

const initEditListeners = () => {
    for (const editButton of document.querySelectorAll('.comment-button-edit')) {
        editButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = parseInt(editButton.dataset.index);
            commentsStore.filter((c, i) => i !== index).forEach((c) => c.isEdit = false);
            const comment = commentsStore[index];
            if (comment.isEdit) {
                comment.text = document.getElementById('edit-textarea').value;
                comment.isEdit = false;
            } else {
                comment.isEdit = true;
            }
            displayComments();
        });
    };
};

const initAnswerComments = () => {
    for (const pressComments of document.querySelectorAll('.comment')) {
        pressComments.addEventListener('click', () => {
            const answer = pressComments.dataset.text;
            const anotherAnswer = pressComments.dataset.name;
            textInputElement().value = 'QUOTE_BEGIN' + anotherAnswer + '\n' + answer + 'QUOTE_END\n';
            textInputElement().focus();
            textInputElement().scrollTo();
        });
    };
};

const displayAddForm = (name = '', text = '') => {
    renderAddForm(isCreating, name, text);
    if(!isCreating){
        initFormListeners();
    }
};

const initFormListeners = () => {
    nameInputElement().addEventListener('keyup', (ev) => {
        if (ev.key === 'Enter') {
            addComment();
        }
    });
    textInputElement().addEventListener('keyup', (ev) => {
        if (ev.key === 'Enter') {
            addComment();
        }
    });
    buttonElement().addEventListener("click", () => {
        addComment();
    });
};

const addComment = () => {
    let isValid = true;

    nameInputElement().classList.remove('add-form-error');
    if (nameInputElement().value === '') {
        nameInputElement().classList.add('add-form-error');
        isValid = false;
        nameInputElement().focus();
    };

    textInputElement().classList.remove('add-form-error');
    if (textInputElement().value === '') {
        textInputElement().classList.add('add-form-error');
        isValid = false;
        textInputElement().focus();
    };

    buttonElement().classList.remove('add-form-button-error');
    if (!isValid) {
        buttonElement().classList.add('add-form-button-error');
        return;
    };

    const comment = {
        text: textInputElement().value,
        name: nameInputElement().value,
    }

    isCreating = true;
    displayAddForm();

    createComment(comment).then(() => {
        return getComments();
    }).then((comments) => {
        commentsStore = comments;
        isCreating = false;
        displayAddForm();
        displayComments();
    }).catch((error) => {
        isCreating = false;
        displayAddForm(comment.name, comment.text);
        if (error.name === 'APIError') {
            if (error.message === 'Сервер сломался, попробуй позже') {
                addComment();
            } else {
                alert(error.message);
            }
        } else {
            alert('Кажется, у вас сломался интернет, попробуйте позже');
        }
        console.warn(error);
    });
};

loadComments();
displayAddForm();
