import sound from "../../assets/sound.wav"; // звук уведомления при получения сообщения
import { toast } from "react-toastify";

export const notifyUser = async (message, chatName) => {
  const audio = new Audio(sound); // взаимодействие со звуком
  audio.volume = 0.3; // уменьшаем громкость до 30%
  audio.play(); // включаем звук
  const { author, content } = message; // берем автора и контент
  const { secondName, name, thirdName } = author; // берем ФИО из автора
  const fullName = `${secondName} ${name.at(0)}. ${thirdName.at(0)}.`; // генерируем ФИО отправителя
  const parsedMsg = JSON.parse(content); // форматируем сообщение
  const removeAllTagsRegexp = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g; // регулярное выражение, которое удаляет все html теги из сообщ
  const msgContent = parsedMsg.replace(removeAllTagsRegexp, ''); // удаляем все html теги из сообщ
  const newMessageNotification = `${chatName} \n ${fullName}: ${msgContent}`; // генерируем уведомление
  toast.info(newMessageNotification); // уведомляем юзера
};
