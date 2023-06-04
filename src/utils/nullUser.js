export const nullUserFormik = {
  access: "employee",
  department: "",
  isActive: false,
  name: "",
  password: "",
  post: "",
  secondName: "",
  thirdName: "",
  username: "",
};

export const nullUser = {
  ...nullUserFormik,
  id: "",
  chats: null,
};

export const setValues = (user) => {
  const result = {};

  if (!user) {
    return nullUserFormik;
  }

  for (const [key, value] of Object.entries(user)) {
    if (key !== 'id' && key !== 'chats') {
      result[key] = value;
    }
  }

  return result;
};