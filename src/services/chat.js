import store from "../slices/index.js";
import { db } from "./init.js";
import { actions } from "../slices/chatSlice.js";
import {
  query,
  collection,
  onSnapshot,
  addDoc,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  arrayUnion,
  updateDoc,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { toast } from "react-toastify";
import i18next from "i18next";
import sound from "../../assets/sound.wav"; // звук уведомления при получения сообщения
import { usersCollection } from "./users.js";
import { v4 } from "uuid";

export const chatCollection = collection(db, "chat");

export const fetchChats = async (ctx) => {
  // запрос всех чатов для юзера
  const { access, department } = ctx;
  let queryChats;
  if (access === "smm-manager") {
    // если уровень доступа не сотрудник - запрашиваются все чаты
    queryChats = query(chatCollection, orderBy("updatedAt", "desc"));
  } else {
    // иначе запрашиваются только те чаты, к которым имеет доступ юзер исходя из его отдела
    queryChats = query(
      chatCollection,
      where("haveAccess", "array-contains", department),
      orderBy("updatedAt", "desc")
    );
  }

  onSnapshot(queryChats, async (querySnapshot) => {
    querySnapshot.docChanges().forEach(async (change) => {
      if (change.type === "modified") {
        const { chats, currentChat } = store.getState().chat; // берем информацию о чатах из хранилища
        const currentChatObj = chats.find((chat) => chat.id === change.doc.id); // находим чат, в котором произошло изменение (по id), среди своих чатов
        const modifiedChat = change.doc.data(); // получаем дату измененного чата
        if (
          modifiedChat.messages.length > currentChatObj.messages.length && // проверка на то, что инициатор изменения = новое сообщение
          currentChat !== change.doc.id // уведомлять пользователя если сообщение пришло в другом канале
        ) {
          const audio = new Audio(sound); // взаимодействие со звуком
          audio.volume = 0.3; // уменьшаем громкость до 30%
          audio.play(); // включаем звук
          const { name, messages } = modifiedChat; // берем сообщения и название из чата
          const { content, author } = messages.at(-1); // берем последнее сообщение
          const authorDoc = doc(db, "users", author.id); // получаем документ автора сообщения
          const authorRef = await getDoc(authorDoc); // получаем документ автора сообщения
          const { name: firstName, secondName, thirdName } = authorRef.data(); // получаем ФИО отправителя
          const fullName = `${secondName} ${firstName.at(0)}. ${thirdName.at(
            0
          )}.`; // генерируем ФИО отправителя
          const newMessageNotification = `${name} ${fullName}: ${content}`; // генерируем уведомление
          toast.info(newMessageNotification);
        }
      }
    });
  });

  onSnapshot(queryChats, async (data) => {
    // обновляем наше redux хранилище с чатами
    const chatsArr = data.docs.map(async (docItem) => {
      const { name: chatName, messages, haveAccess } = docItem.data(); // берем название чата, сообщения и массив отделов
      const newMessages = messages.map(async (msg) => {
        // генерируем новый массив сообщений для удобной обработки
        const authorDoc = doc(db, "users", msg.author.id); // получаем автора конкретного сообщения
        const authorRef = await getDoc(authorDoc); // получаем автора конкретного сообщения
        const { name, secondName, thirdName, post } = authorRef.data(); // получаем данные из автора

        let newReply = null;

        if (msg.reply) {
          const { author, content, id } = msg.reply;
          if (author === msg.author.id) {
            newReply = {
              content,
              author: {
                name,
                secondName,
                thirdName,
              },
              id,
            };
          } else {
            try {
              const authorReplyDoc = doc(db, "users", author);
              const authorReplyRef = await getDoc(authorReplyDoc);
              const { name, secondName, thirdName } = authorReplyRef.data();

              newReply = {
                content,
                author: {
                  name,
                  secondName,
                  thirdName,
                },
                id,
              };
            } catch (e) {}
          }
        }

        return {
          ...msg,
          author: {
            id: authorRef.id,
            name,
            secondName,
            thirdName,
            post,
          },
          reply: newReply,
        };
      });
      return {
        id: docItem.id, // id чата
        name: chatName, // name chat
        haveAccess, // отделы с доступом
        messages: await Promise.all(newMessages), // дожидаемся выполнения всех асинхронных функций
      };
    });

    const result = await Promise.all(chatsArr); // дожидаемся выполнения всех асинхронных функций
    store.dispatch(actions.setChats(result)); // обновляем redux хранилище
  });
};

export const createChat = async (data) => {
  const { name } = data; // берем будущее название чата
  const newChat = {
    name,
    messages: [],
    haveAccess: store.getState().department.depts,
    updatedAt: Date.now(),
  }; // генерируем объект чата
  try {
    const chatsRef = await getDocs(chatCollection);
    const findedChat = chatsRef.docs.find((chat) => {
      return chat.data().name.toLowerCase() === data.name.toLowerCase();
    });

    if (findedChat) {
      toast.error(i18next.t("errors.uniqueChat"));
      return;
    }

    const ref = await addDoc(chatCollection, newChat); // добавляем чат
    addChatToUser(ref.id);
    toast.success(i18next.t("success.create")); // уведомляем об успешном добавлении чата
  } catch (e) {
    toast.error(i18next.t("errors.createChat")); // уведомляем о неудачном добавлении чата
  }
};

export const updateChat = async (data, id) => {
  try {
    const chatsRef = await getDocs(chatCollection);
    const findedChat = chatsRef.docs.find((chat) => {
      const currentChat = chat.data();
      return (
        currentChat.name.toLowerCase() === data.name.toLowerCase() &&
        chat.id !== id
      );
    });

    if (findedChat) {
      toast.error(i18next.t("errors.uniqueChat"));
      return;
    }

    const newData = {
      ...data,
      updatedAt: Date.now(),
    };

    const chatRef = doc(db, "chat", id); // получаем ссылку на нужный нам чат
    await setDoc(chatRef, newData); // обновляем его
    toast.success(i18next.t("success.rename"));
  } catch (e) {
    toast.error(i18next.t("errors.renameChat"));
  }
};

export const removeChat = async (id) => {
  // удаление чата по id
  try {
    const chatRef = doc(db, "chat", id); // получение ссылки на документ (чат)
    await deleteDoc(chatRef); // удаление документа по ссылке
    store.dispatch(actions.setDefaultChat());
    toast.success(i18next.t("success.remove"));
  } catch (e) {
    toast.error(i18next.t("errors.removeChat"));
  }
};

export const addMessage = async (data, id, reply) => {
  let newReply = null;

  if (reply) {
    const { content, author, id } = reply.item;
    newReply = {
      author: author.id,
      content,
      id,
    };
  }

  const chatRef = doc(db, "chat", id); // получение ссылки на документ (чат)
  const currentDate = Date.now();
  const newMessage = {
    ...data,
    date: currentDate, // числовое представление даты (timestamp)
    id: v4(), // задаем id для сообщения,
    reply: newReply,
  };
  await updateDoc(chatRef, {
    // обновляем документ добавляя в массив сообщений новое с помощью arrayUnion
    messages: arrayUnion(newMessage),
    updatedAt: currentDate
  });
};

export const addChatToUser = async (id) => {
  const users = await getDocs(usersCollection);
  users.forEach(async (snap) => {
    const userData = snap.data();
    const { chats } = userData;
    const userRef = snap.ref;
    const newChats = {
      ...chats,
      [id]: 0,
    };
    await updateDoc(userRef, {
      chats: newChats,
    });
  });
};
