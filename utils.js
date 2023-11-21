import format from "date-fns/format";

export const delay = (interval = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
};

export const formatDateTime = (date) => {
  return format(date, "yyyy-MM-dd hh.mm.ss");
};
