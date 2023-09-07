export const delay = (interval = 300) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
};