export const formatDate = (num) => {
  const str = `${num}`;
  if (str.length === 1) {
    return `0${str}`;
  }
  return str;
};