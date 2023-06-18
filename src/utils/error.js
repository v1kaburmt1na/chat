export const error = (code) => { // передаем код ошибки
  const err = new Error(); // создаем объект ошибки
  err.code = code; // ставим в объект этой ошибки переданный код
  return err; // возвращаем ошибку
}