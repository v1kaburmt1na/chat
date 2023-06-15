export const formatDate = (num) => { // 
  const str = `${num}`; // переводим переданное число в строку
  if (str.length === 1) { // если ее длина === 1, то добавляем в начале ноль
    return `0${str}`;
  }
  return str; // иначе возвращаем как есть
};