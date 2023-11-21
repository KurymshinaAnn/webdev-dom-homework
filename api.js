const apiPath = 'https://wedev-api.sky.pro/api/v2/:ann-kurymshina/comments';
const apiReg = 'https://wedev-api.sky.pro/api/user';
const apiLog = 'https://wedev-api.sky.pro/api/user/login';

export const createComment = (comment, user) => {
    return fetch(apiPath, {
        method: 'POST',
        body: JSON.stringify(comment),
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
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

export const apiRegistration = (regRequest) => {
    return fetch(apiReg, {
        method: 'POST',
        body: JSON.stringify(regRequest)
    }).then((response) => {
        if (response.status === 201) {
            return response.json();
        } else if (response.status === 400) {
            throw createError('Пользователь с таким именем уже существует');
        } else {
            throw createError('Сервер сломался, попробуй позже');
        }
    })
};

export const apiLogin = (login, password) => {
    return fetch(apiLog, {
        method: 'POST',
        body: JSON.stringify({ 'login': login, 'password': password })
    }).then((response) => {
        if (response.status === 201) {
            return response.json();
        } else if (response.status === 400) {
            throw createError('Пользователя с таким именем или паролем не существует');
        } else {
            throw createError('Сервер сломался, попробуй позже');
        }
    })
};

export const getComments = (user) => {
    return fetch(apiPath, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${user ? user.token : ''}`
        }
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
