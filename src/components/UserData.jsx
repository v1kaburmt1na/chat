import cn from "classnames";
import { Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export const UserData = (props) => { // компонент данных пользователя
  const { user, position } = props; // берем инфу о юзере, данные которого мы будем отображать и расположение этих данных
  const { t } = useTranslation(); // функция локализации

  const userDataClassname = cn("user-data", {
    "user-data-end": position === "end",
  });

  return (
    <div className={userDataClassname}>
      <div className="user-data-wrapper">
        <span>ФИО:</span>
        <div className="user-data-inner">
          <Badge>{user.secondName}</Badge> { /* фамилия */ }
          <Badge>{user.name}</Badge> { /* имя */ }
          <Badge>{user.thirdName}</Badge> { /* отчество  */ }
        </div>
      </div>
      <div className="user-data-wrapper">
        <span>Отдел:</span>
        <Badge>{user.department}</Badge> { /* отдел */ }
      </div>
      <div className="user-data-wrapper">
        <span>Должность:</span>
        <Badge>{user.post}</Badge> { /* должность */ }
      </div>
      {position !== "end" && user.access !== 'ceo' && ( // если показывем инфу о юзерах в модалке И уровень доступа не равно исп директор
        <div className="user-data-wrapper">
          <span>Уровень доступа:</span>
          <Badge>{t(`access.${user.access}`)}</Badge> { /* уровень доступа */ }
        </div>
      )}
    </div>
  );
};
