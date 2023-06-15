import { getDocs, query, where } from "firebase/firestore";
import { chatCollection } from "../services/chat";

export const setChats = async (data, chats) => { // устанавливаем чаты для пользователя при его изменении или при регистрации
  const searchQuery = // если доступ === оператор чата или ген. дир - то загружаем все чаты
    data.access === "chat-operator" || data.access === "ceo"
      ? query(chatCollection)
      : query( // иначе те, которые доступны ему по отделу
          chatCollection,
          where("haveAccess", "array-contains", data.department)
        );

  const chatsObj = {}; // новый объект чатов
  const availableChats = await getDocs(searchQuery); // получаем все документы по запросу
  availableChats.forEach((chatSnap) => { // проходимся по документам
    const id = chatSnap.id;
    let readedMessages = 0;

    if (chats && chats[id]) { // если есть объект чатов и в нем есть нужный нам чат, то мы меняем количество прочитанных сообщ
      readedMessages = chats[id];
    }

    chatsObj[id] = readedMessages; // ставим количество прочитанных сообщений
  });

  return chatsObj;
};
