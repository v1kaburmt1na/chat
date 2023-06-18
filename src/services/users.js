import { db } from "./init.js";
import store from "../slices/index.js";
import {
  query,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc,
  where,
  addDoc,
} from "firebase/firestore";
import { actions } from "../slices/usersSlice.js";
import { toast } from "react-toastify";
import i18next from "i18next";
import { setChats } from "../utils/setChats.js";
import { v4 as uuidv4 } from 'uuid';

export const usersCollection = collection(db, "users");

export const fetchUsers = async (access) => {
  // запрос всех пользователей
  if (access !== "hr-manager") {
    // если уровень доступа не специалист по найму, то не запрашиваем всех пользователей
    return;
  }
  const queryUsers = query(usersCollection); // запрашиваем все пользователей

  onSnapshot(queryUsers, async (querySnapshot) => { // подписываемся на изменение всех юзеров
    const users = querySnapshot.docs.map((user) => {
      // нормализируем объект пользователей для дальнейшей работы
      return {
        ...user.data(), // раскрываем данные пользователя
        id: user.id, // id юзера
      };
    });
    store.dispatch(actions.setUsers(users)); // сохраняем пришедших пользователей в redux хранилище
  });
};

export const updateUser = async (data, id, chats) => {
  delete data.isAuthorized; // удаление свойства авторизирован ли пользователь
  // обновить пользователя
  try {
    const userRef = doc(db, "users", id); // получаем ссылку на объект необходимого нам пользователя
    const { department } = (await getDoc(userRef)).data(); // получаем отделы у пользователя
    let newData = {
      ...data, // раскрываем данные
      chats
    };
    if (department !== data.department) { // если отдел изменился
      const chatsObj = await setChats(data, chats);

      newData = { // генерируем новые данные юзера
        ...data,
        chats: chatsObj,
      };
    }
    await setDoc(userRef, newData); // изменяем полностью документ
    toast.success("Пользователь был успешно изменен");
  } catch (e) {
    toast.error("Изменить пользователя не удалось");
  }
};

export const removeUser = async (id) => { // удаление пользователя
  try {
    const userRef = doc(db, "users", id);
    const chatsCollection = collection(db, "chat");
    const chats = await getDocs(chatsCollection); // запрашиваем все чаты
    chats.forEach((chat) => { // проходимся по чатам
      const { messages } = chat.data(); // получаем сообщения чата
      const newMessages = messages.filter((msg) => msg.author.id !== id); // оставляем сообщения только те, в которых автор не тот, кого мы пытаемся удаилть

      if (newMessages.length < messages.length) {
        // если количество сообщений в чате больше или равно отфильтрованным сообщениям, то мы в целях оптимизации НЕ обновляем документ
        updateDoc(chat.ref, {
          messages: newMessages,
        });
      }
    });
    await deleteDoc(userRef); // удаляем документ пользователя
    toast.success("Пользователь был успешно удален");
  } catch (e) {
    toast.error(i18next.t("Удалить пользователя не удалось"));
  }
};

export const getUsersFromDepts = async (departments) => { // получаем всех пользователей в отделе
  try {
    const usersPromise = departments.map(async (dept) => { // проходимся по всем отделам
      const usersQuery = query( // проходимся по всем пользователям и находим тех, у кого текущий отдел
        usersCollection,
        where("department", "==", dept)
      );

      const usersRef = await getDocs(usersQuery); // получаем пользователей
      return usersRef.docs.map((userSnapshot) => userSnapshot.data()); // возвращаем их данные
    });
    const users = await Promise.all(usersPromise); // параллельно выполняем асинхронные функции
    return users.flat(); // возвращаем массив с уменьшенным уровнем вложенности
  } catch(_e) {
    toast.error(i18next.t('Загрузить пользователей не удалось'))
  }
};

export const register = async (data) => { // добавление пользователя
  delete data.isAuthorized; // удаление инфы авторизирован ли юзер
  const isUserUniqueQuery = query(
    usersCollection,
    where("username", "==", data.username)
  ); // создаем запрос на проверку ника на уникальность
  const isUserUnique = await getDocs(isUserUniqueQuery); // проверяем ник на уникальность

  if (isUserUnique.size > 0) {
    // если есть хотя бы 1 пользователь в массиве - дропаем ошибку
    toast.error(i18next.t("errors.exist"));
    return;
  }
  const token = uuidv4(); // генерация токена

  const chats = await setChats(data); // создаем объект чатом с количеством прочитанных сообщений
  const dataWithChats = {
    ...data, // раскрываем данные юзера
    chats, // чаты
    token // токен
  };

  await setDoc(doc(db, 'users', token), dataWithChats); // добавляем документ с инфой о нашем пользователе
  toast.success(i18next.t("success.register"));
};