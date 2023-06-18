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
import { usersCollection } from "./users.js";
import { v4 } from "uuid";

export const chatCollection = collection(db, "chat");

export const fetchChats = async (ctx) => {
  // запрос всех чатов для юзера
  const { access, department } = ctx; // достаем уровень доступа и отдел
  let queryChats; // запрос чатов
  if (access === "chat-operator" || access === "ceo") { // если уровень доступа равен оператор чата или исп дир
    queryChats = query(chatCollection, orderBy("updatedAt", "desc")); // запрашиваем чаты отсортированные по последним изменениям по убыванию
  } else {
    // иначе запрашиваются только те чаты, к которым имеет доступ юзер исходя из его отдела
    queryChats = query(
      chatCollection,
      where("haveAccess", "array-contains", department),
      orderBy("updatedAt", "desc") // по убыванию по последним изменениям
    );
  }

  onSnapshot(queryChats, async (data) => {
    const chatsArr = data.docs.map(async (docItem) => {
      const { name: chatName, messages, haveAccess } = docItem.data(); // берем название чата, сообщения и массив отделов
      const newMessages = messages.map(async (msg) => {
        // генерируем новый массив сообщений для удобной обработки
        const authorDoc = doc(db, "users", msg.author.id); // получаем автора конкретного сообщения
        const authorRef = await getDoc(authorDoc); // получаем автора конкретного сообщения
        const { name, secondName, thirdName, post } = authorRef.data(); // получаем данные из автора

        let newReply = null; // создаем переменную ответа на сообщение

        if (msg.reply) { // если у сообщения есть ответ
          const { author, content, id } = msg.reply; // достаем автора, контент, id сообщения-ответа
          if (author === msg.author.id) { // если автор сообщения-ответа тот же самый, что и у самого сообщения - НЕ запрашиваем автора заново
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
              const authorReplyDoc = doc(db, "users", author); // получаем автора сообщения-ответа
              const authorReplyRef = await getDoc(authorReplyDoc); // получаем автора сообщения-ответа
              const { name, secondName, thirdName } = authorReplyRef.data(); // получаем данные из автора

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
          ...msg, // раскрываем сообщение
          author: {
            id: authorRef.id, // id автора
            name, // имя автора
            secondName,// фамилия автора
            thirdName,// отчество автора
            post,// должность автора
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
    name, // название чата
    messages: [], // массив сообщений
    haveAccess: store.getState().department.depts, // массив всех отделов
    updatedAt: Date.now(), // задаем дату последнего обновления - текущую
  }; // генерируем объект чата
  try {
    const chatsRef = await getDocs(chatCollection); // ссылка на документ чатов
    const findedChat = chatsRef.docs.find((chat) => { // ищем канал, у которого название такое же как у того, который мы создаем
      return chat.data().name.toLowerCase() === data.name.toLowerCase();
    });

    if (findedChat) { // если этот канал найден, то бросаем ошибку о том, что имя канала должно быть уникальным
      toast.error(i18next.t("errors.uniqueChat"));
      return;
    }

    const ref = await addDoc(chatCollection, newChat); // добавляем чат
    addChatToUser(ref.id); // добавляем созданный чат всем юзерам
    toast.success(i18next.t("success.create")); // уведомляем об успешном добавлении чата
  } catch (e) {
    toast.error(i18next.t("errors.createChat")); // уведомляем о неудачном добавлении чата
  }
};

export const updateChat = async (data, id) => { // обновление чата
  try {
    const chatsRef = await getDocs(chatCollection); // получаем все чаты
    const findedChat = chatsRef.docs.find((chat) => { // ищем чат, у которого название такое же как у нашего обновленного
      const currentChat = chat.data(); // получаем данные чата
      return (
        currentChat.name.toLowerCase() === data.name.toLowerCase() &&
        chat.id !== id
      );
    });

    if (findedChat) { // если нашли канал с таким же названием как у нас - выдаем ошибку о том, что канал должен быть уникальным
      toast.error(i18next.t("errors.uniqueChat"));
      return;
    }

    const newData = {
      ...data, // раскрываем данные чата
      updatedAt: Date.now(), // обновляем последнее изменение чата
    };

    const chatRef = doc(db, "chat", id); // получаем ссылку на нужный нам чат
    await setDoc(chatRef, newData); // обновляем его
    toast.success(i18next.t("success.rename")); // уведомляем пользователя о том, что чат изменился
  } catch (e) {
    toast.error(i18next.t("errors.renameChat")); // уведомляем пользователя о том, что изменить чат не удалось
  }
};

export const removeChat = async (id) => { // удаление канала
  try {
    const chatRef = doc(db, "chat", id); // получение ссылки на документ (чат)
    await deleteDoc(chatRef); // удаление документа по ссылке
    store.dispatch(actions.setDefaultChat()); // после удаления чата ставим текущий чат - null
    toast.success(i18next.t("success.remove"));
  } catch (e) {
    toast.error(i18next.t("errors.removeChat"));
  }
};

export const addMessage = async (data, id, reply) => { // добавляем новое сообщение
  let newReply = null; // создаем переменную ответа на сообщение

  if (reply) { // если сообщение является ответом на другое
    const { content, author, id } = reply.item; // берем контент, автора и id сообщ
    newReply = {
      author: author.id, // id автора
      content, // контент
      id, // id сообщения
    };
  }

  const chatRef = doc(db, "chat", id); // получение ссылки на документ (чат)
  const currentDate = Date.now(); // текущая дата в timestamp (численное представление даты с миллисекундах с 1 января 1970 года)
  const newMessage = {
    ...data, // раскрываем объект сообщения
    date: currentDate, // числовое представление даты (timestamp)
    id: v4(), // задаем id для сообщения,
    reply: newReply, // ставим значение переменной ответа на сообщение
  };
  await updateDoc(chatRef, {
    messages: arrayUnion(newMessage), // обновляем документ добавляя в массив сообщений новое с помощью arrayUnion
    updatedAt: currentDate, // ставим текущую дату (timestamp) в свойстве последнего обновления чата
  });
};

export const addChatToUser = async (id) => { // добавление чата всем юзерам
  const users = await getDocs(usersCollection); // получаем всех пользователей
  users.forEach(async (snap) => { // проходимся по каждому
    const { chats } = snap.data(); // берем чаты у пользователя
    const userRef = snap.ref; // берем ссылку на пользователя
    const newChats = { // генерируем новый объект чатов
      ...chats, // раскрываем все чаты, которые есть
      [id]: 0, // проставляем 0 прочитанных
    };
    await updateDoc(userRef, { // обновляем документ новыми данными
      chats: newChats,
    });
  });
};
