import { getDocs, query, where } from "firebase/firestore";
import { chatCollection } from "../services/chat";

export const setChats = async (data, chats) => {
  const searchQuery =
    data.access === "chat-operator" || data.access === "ceo"
      ? query(chatCollection)
      : query(
          chatCollection,
          where("haveAccess", "array-contains", data.department)
        );

  const chatsObj = {};
  const availableChats = await getDocs(searchQuery);
  availableChats.forEach((chatSnap) => {
    const id = chatSnap.id;
    let readedMessages = 0;

    if (chats && chats[id]) {
      readedMessages = chats[id];
    }

    chatsObj[id] = readedMessages;
  });

  return chatsObj;
};
