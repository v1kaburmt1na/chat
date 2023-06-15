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

const usersCollection = collection(db, "users");

export const login = async (data) => {
  if (!data.username || !data.password) {
    store.dispatch(mainActions.setLoading(false));
    return;
  }

  // авторизация (вход в учетку)
  const userQuery = query(
    usersCollection,
    where("username", "==", data.username),
    where("password", "==", data.password)
    ); // ищем пользователя с переданным логином и паролем
    const userSnapshot = await getDocs(userQuery); // ищем пользователя с переданным логином и паролем
    if (userSnapshot.size !== 1) {
      toast.error(i18next.t("errors.auth"));
      store.dispatch(mainActions.setLoading(false));
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      return;
    }
    const { isActive } = userSnapshot.docs[0].data();
    if (!isActive) {
      // проверяем активирован ли польхователь
      toast.error(i18next.t("errors.needActivate"));
      store.dispatch(mainActions.setLoading(false));
      return;
    }
    
    onSnapshot(userQuery, (userSnap) => {
      const userData = userSnap.docs[0].data();
      const userId = userSnap.docs[0].id;
      
      const newUserObj = {
        // создаем удобный объект пользователя и в дальнейшем его передадим в хранилище
        ...userData,
        id: userId,
        isAuthorized: true
      };
      
      const localStorageUsername = localStorage.getItem('username');
      if (localStorageUsername === null || userData.username === localStorageUsername) {
      
      localStorage.setItem("username", userData.username);
      localStorage.setItem("password", userData.password);
  
      store.dispatch(actions.setUser(newUserObj));
      store.dispatch(mainActions.setLoading(false));
    }
  });
};

export const readMessage = async (data) => {
  const { user, chat, count } = data;
  const userDoc = doc(db, "users", user);
  const userRef = await getDoc(userDoc);
  const { chats } = userRef.data();
  const newChats = {
    ...chats,
    [chat]: count,
  };
  await updateDoc(userDoc, {
    chats: newChats,
  });
};
