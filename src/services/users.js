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

export const usersCollection = collection(db, "users");

export const fetchUsers = async (access) => {
  // запрос всех пользователей
  if (access !== "hr-manager") {
    // если уровень доступа не админ, то не запрашиваем всех пользователей
    return;
  }
  const queryUsers = query(usersCollection);

  onSnapshot(queryUsers, async (querySnapshot) => {
    const users = querySnapshot.docs.map((user) => {
      // нормализируем объект пользователей для дальнейшей работы
      return {
        ...user.data(),
        id: user.id,
      };
    });
    store.dispatch(actions.setUsers(users)); // сохраняем пришедших пользователей в redux хранилище
  });
};

export const updateUser = async (data, id, chats) => {
  // обновить пользователя
  try {
    const userRef = doc(db, "users", id); // получаем ссылку на объект необходимого нам пользователя
    const { department } = (await getDoc(userRef)).data();
    let newData = {
      ...data,
      chats
    };
    if (department !== data.department) {
      const chatsObj = await setChats(data, chats);

      newData = {
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

export const removeUser = async (id) => {
  // удаление пользователя
  try {
    const userRef = doc(db, "users", id);
    const chatsCollection = collection(db, "chat");
    const chats = await getDocs(chatsCollection); // запрашиваем все чаты
    chats.forEach((chat) => {
      // проходимся по чатам
      const { messages } = chat.data();
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

export const getUsersFromDepts = async (departments) => {
  try {
    const usersPromise = departments.map(async (dept) => {
      const usersQuery = query(
        usersCollection,
        where("department", "==", dept)
      );

      const usersRef = await getDocs(usersQuery);
      return usersRef.docs.map((userSnapshot) => userSnapshot.data());
    });
    const users = await Promise.all(usersPromise);
    return users.flat();
  } catch(_e) {
    toast.error(i18next.t('Загрузить пользователей не удалось'))
  }
};

export const register = async (data) => {
  const isUserUniqueQuery = query(
    usersCollection,
    where("username", "==", data.username)
  ); // проверяем ник на уникальность
  const isUserUnique = await getDocs(isUserUniqueQuery); // проверяем ник на уникальность

  if (isUserUnique.size > 0) {
    // если есть хотя бы 1 пользователь в массиве - дропаем ошибку
    toast.error(i18next.t("errors.exist"));
    return;
  }

  const chats = await setChats(data);
  const dataWithChats = {
    ...data,
    chats
  };

  await addDoc(usersCollection, dataWithChats); // добавляем документ с инфой о нашем пользователе
  // const userSnapshot = await getDoc(userRef); // получаем этот документ для уведолмения юзера и сохранения инфы в хранилище
  toast.success(i18next.t("success.register"));
};