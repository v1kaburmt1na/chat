const months = [ // список месяцев
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export const groupDate = (arr) => {
  const result = []; // массив с результатом
  const cache = new Map(); // кэш
  const currentYear = new Date(Date.now()).getFullYear(); // получаем полностью текущий год

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]; // получил сообщение
    const date = new Date(item.date); // нормализуем дату
    const day = date.getDate(); // берем день месяца
    const month = months[date.getMonth()]; // берем месяц
    const year = date.getFullYear(); // берем год
    const isCurrentYear = year === currentYear; // было ли это сообщение было отправлено в этом году
    const formattedDate = isCurrentYear ? `${day} ${month}` : `${day} ${month} ${year}`; // 15.06 либо 15.06.2022
    const newMsg = { // создаем новый объект сообщения
      item, // само сообщение
      date, // дата
      number: i + 1 // его номер
    };

    const groupDate = cache.get(formattedDate); // 

    if (groupDate) {
      groupDate.messages.push(newMsg);
    } else {
      const groupObj = {
        messages: [newMsg],
        formattedDate
      };
      result.push(groupObj);
      cache.set(formattedDate, groupObj) // если даты в кэше нет, то добавляем новое поле в кэш
    }
  }

  return result;
};
