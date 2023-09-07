const apiPath = 'https://wedev-api.sky.pro/api/v1/:ann-kurymshina/comments';

export const createComment = (comment) => {
    return fetch(apiPath, {
        method: 'POST',
        body: JSON.stringify(comment)
    }).then((response) => {
        if (response.status === 201) {
            response.json();
        } else if (response.status === 400) {
            throw createError('Имя и комментарий должны быть не короче 3 символов');
        } else {
            throw createError('Сервер сломался, попробуй позже');
        }
    })
};

export const getComments = () =>{
    return fetch(apiPath, {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((responseData) => {
        return responseData.comments.map((comment) => {
            return {
                name: comment.author.name,
                text: comment.text,
                time: new Date(comment.date),
                likes: comment.likes,
                liked: comment.false,
                isEdit: comment.isEdit,
            };
        });
    })
};

const createError = (message) => {
    const err = new Error(message);
    err.name = 'APIError';
    return err;
};
