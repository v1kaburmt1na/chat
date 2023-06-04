const months = [
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
  const result = [];
  const cache = new Map();
  const currentYear = new Date(Date.now()).getFullYear();

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const date = new Date(item.date);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const isCurrentYear = year === currentYear;
    const formattedDate = isCurrentYear ? `${day} ${month}` : `${day} ${month} ${year}`;
    const newMsg = {
      item,
      date,
      number: i + 1
    };

    const groupDate = cache.get(formattedDate);

    if (groupDate) {
      groupDate.messages.push(newMsg);
    } else {
      const groupObj = {
        messages: [newMsg],
        formattedDate
      };
      result.push(groupObj);
      cache.set(formattedDate, groupObj)
    }
  }

  return result;
};
