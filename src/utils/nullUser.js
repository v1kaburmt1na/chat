export const nullUserFormik = { // начальные значения пользователя для формы
  access: "employee",
  department: "",
  isActive: false,
  name: "",
  password: "",
  post: "",
  secondName: "",
  thirdName: "",
  username: "",
  isAuthorized: false
};

export const nullUser = { // начальные значения пользователя
  ...nullUserFormik,
  id: "",
  chats: null,
};

export const setValues = (user) => {
  const result = {};

  if (!user) {
    return nullUserFormik; // если нет юзера - возвращаем стандартные значения юзера для формы
  }

  for (const [key, value] of Object.entries(user)) {
    if (key !== 'id' && key !== 'chats') { // если ключ это НЕ id и НЕ chat, то ставим в result значение по этому ключу
      result[key] = value;
    }
  }

  return result;
};