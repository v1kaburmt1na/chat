import { useSelector } from "react-redux";
import { ChatButton } from "../components/ChatButton.jsx";
import { useState } from "react";
import { FormControl } from "react-bootstrap";

export const ChatList = () => {
  const { chats } = useSelector((state) => state.chat); // достаем все чаты из хранилища чатов
  const [findChat, setFindChat] = useState(""); // создаем состояние поиска чата
  const findedChats = chats.filter(({ name }) => // фильтруем все чаты так, что оставляем только те, которые в названии содержут то, что мы ищем
    name.toLowerCase().includes(findChat.toLowerCase())
  );
  const list = findedChats.map(
    (
      { id, name } // для каждого канала отрисовываем компонент кнопки
    ) => <ChatButton key={id} id={id} name={name} />
  );

  if (chats.length === 0) { // если у юзера нет каналов - показываем, что их нет
    return <p className="no-chats">Список каналов пуст</p>;
  }

  return (
    <>
      <div className="chat-find">
        <FormControl
          placeholder="Поиск"
          value={findChat} // значение этого поля - состояние, которое отвечает за то, какой чат мы ищем
          onChange={(e) => setFindChat(e.target.value)} // при изменении изменяем состояние, которое отвечает за то, какой чат мы ищем
        />
      </div>
      <div className="chats">{list}</div>
    </>
  );
};
