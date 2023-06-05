import sound from "../../assets/sound.wav"; // звук уведомления при получения сообщения
import { toast } from "react-toastify";

export const notifyUser = async (message, chatName) => {
  const audio = new Audio(sound); // взаимодействие со звуком
  audio.volume = 0.3; // уменьшаем громкость до 30%
  audio.play(); // включаем звук
  const { author, content } = message;
  const { secondName, name, thirdName } = author;
  const fullName = `${secondName} ${name.at(0)}. ${thirdName.at(0)}.`; // генерируем ФИО отправителя
  const newMessageNotification = `${chatName} \n ${fullName}: ${JSON.parse(content)}`; // генерируем уведомление
  toast.info(newMessageNotification);
};
