import { db } from "./init.js";
import store from "../slices/index.js";
import { actions } from "../slices/userSlice.js";
import {
  query,
  collection,
  getDoc,
  where,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { toast } from "react-toastify";
import i18next from "i18next";
import { actions as mainActions } from "../slices/mainSlice.js";

const usersCollection = collection(db, "users"); // коллекция всех пользователей

export const login = async (data, type) => { // авторизация
  let userQuery;

  if (type === 'auth') {
    if (!data.token) { // если токена нет
      store.dispatch(mainActions.setLoading(false)); // прекращаем загрузку если токена нет
      return;
    }
    
    userQuery = query(usersCollection, where('token', '==', data.token)); // ищем среди всех юзеров того, у кого свойство токен равно переданному
  } else {
    if (!data.username || !data.password) {
      store.dispatch(mainActions.setLoading(false)); // прекращаем загрузку если нет юзернейма или пароля
      return;
    }

    userQuery = query( // ищем среди всех юзеров того, у кого свойства юзернейм и пароль равно переданным
      usersCollection,
      where("username", "==", data.username),
      where("password", "==", data.password)
    );
  }

  const userSnapshot = await getDocs(userQuery); // ищем пользователя по сгенерированному запросу
  if (userSnapshot.size !== 1) { // если количество пользователей не равно 1 тогда
    toast.error(i18next.t("errors.auth")); // уведомляем о том, что нет юзера с таким логином и паролем
    store.dispatch(mainActions.setLoading(false)); // прекращаем загрузку
    localStorage.removeItem('token'); // удаляем из localstorage токен
    throw error("404"); // дропаем ошибку со статус кодом 404 - НЕ НАЙДЕНО
  }
  const { isActive } = userSnapshot.docs[0].data();  // берем свойство is active
  if (!isActive) { // если учетка не активно
    // проверяем активирован ли пользователь
    toast.error(i18next.t("errors.needActivate")); // уведомляем о том, что учетка не активна
    store.dispatch(mainActions.setLoading(false)); // прекращаем загрузку
    localStorage.removeItem('token'); // удаляем из localstorage токен
    throw error("403"); // дропаем ошибку со статус кодом 403 - НЕ АВТОРИЗИРОВАН
  }

  onSnapshot(userQuery, (userSnap) => { // выполняется если произлошло изменение в запросе userQuery
    const userData = userSnap.docs[0].data(); // берем данные пользователя
    const userId = userSnap.docs[0].id; // берем его id

    const newUserObj = {
      // создаем удобный объект пользователя и в дальнейшем его передадим в хранилище
      ...userData,
      id: userId,
      isAuthorized: true,
    };

    const localStorageToken = localStorage.getItem("token"); // достаю токен из локалстораджа
    if (
      localStorageToken === null || // если токена нет ИЛИ токен такой же как у текущего юзера
      userId === localStorageToken
    ) {
      localStorage.setItem('token', userId); // обновляем значение токен в localstorage
      
      store.dispatch(actions.setUser(newUserObj)); // обновляем юзера в хранилище
      store.dispatch(mainActions.setLoading(false)); // прекращаем загрузку
    }
  });
};

export const readMessage = async (data) => { // чтение сообщения
  const { user, chat, count } = data; // берем id юзера, id чата, количество прочитанных
  const userDoc = doc(db, "users", user); // находим документ юзера
  const userRef = await getDoc(userDoc); // получаем данные ссылки
  const { chats } = userRef.data(); // берем все чаты из данных
  const newChats = {
    ...chats, // раскрываем все чаты
    [chat]: count, // обновляем количество прочитанных в переданном чате
  };
  await updateDoc(userDoc, { // обновляем документ
    chats: newChats,
  });
};
