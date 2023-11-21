export const delay = (interval = 300) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
};

export const formatDateTime = (date) => {
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