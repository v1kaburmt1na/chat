import {
  FormControl,
  FormGroup,
  Button,
  FormLabel,
  Dropdown,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { useEffect } from "react";
import { updateUser, removeUser } from "../services/users";
import { register } from "../services/users";
import cn from "classnames";
import { nullUser, setValues } from "../utils/nullUser";

export const UserInfo = (props) => {
  const { t } = useTranslation(); // функция локализации
  const { user, setUser } = props; // берем id юзера, которого сейчас будем редактировать/удалять и функцию для изменения текущего юзера
  const users = useSelector((state) => state.users.users); // берем ВСЕХ юзеров из хранилища юзеров
  let currentUser = users.find((u) => u.id === user); // находим нужного нам сравнивая id

  if (user === null) { // если id равен null - показываем пустые значения
    currentUser = nullUser;
  }

  const schema = yup.object().shape({
    // объект валидации
    username: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username"))
      .max(20, t("errors.username")),
    password: yup
      .string()
      .required(t("errors.required"))
      .min(6, t("errors.password")),
    name: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")),
    secondName: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")),
    thirdName: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")),
    post: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")),
    department: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")),
  });
  const departments = useSelector((state) => state.department.depts); // достаем отделы из хранилища отделов
  const formik = useFormik({
    validationSchema: schema,
    initialValues: setValues(currentUser),
  }); // задаем начальные значения и схему валидации для библиотеки валидации форм
  const { values, errors, handleChange, setFieldValue, setFieldError } = formik; // берем нужные нам переменные из объекта формик
  useEffect(() => {
    formik.setValues(setValues(currentUser)); // изменяем поля юзера
  }, [currentUser]); // этот хук сработает если мы изменим пользователя

  const removeCurrentUser = () => { // функция, которая удалит юзера
    removeUser(currentUser?.id); // удаление юзера
    setUser(undefined); // меняем значение текущего ющера на пусто
  };

  const updateCurrentUser = () => { // обновить текущего юзера
    updateUser(values, currentUser?.id, currentUser.chats);
  };

  const registerUser = () => { // регистрация юзера
    register(values);
    setUser(undefined); // меняем значение текущего ющера на пусто
  };

  const errorsCount = Object.keys(errors).length; // получаем ошибки в введенных данных
  const canEditOrAdd = errorsCount === 0; // если ошибок в данных нет, то можно отправлять запрос на изменение/добавление юзера

  const className = cn("user", {
    "users-blank": user === undefined,
  });

  const isCeoPost = values.post === "Исполнительный директор"; // сверяем введенную должность с испол директором и возвращаем является ли юзер испол диром

  useEffect(() => {
    if (isCeoPost && values.access !== "ceo") { // если должность исп дир И текущий уровень доступа НЕ исп дир
      formik.setFieldValue("access", "ceo"); // изменяем уровень доступа на исп дир
    }
  }, [isCeoPost]); // хук вызывается если должность поменялась

  return (
    <div className={className}>
      {user !== undefined ? ( // если юзера равен null или id - показывем форму для добавления/изменения/удаления
        <form>
          <div className="user-section">
            <FormGroup>
              <FormLabel>{t("registrationForm.username")}</FormLabel>
              <FormControl
                onChange={handleChange}
                value={values.username}
                data-testid="input-body"
                name="username"
                id="username"
                className="mb-2"
                isInvalid={!!errors.username} // если есть ошибки - подсвечиваем красным
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.username} { /* ошибка связанная с неправильно введенными данными */ }
              </div>
            </FormGroup>
            <FormGroup>
              <FormLabel>{t("registrationForm.password")}</FormLabel>
              <FormControl
                onChange={handleChange}
                value={values.password}
                data-testid="input-body"
                name="password"
                id="password"
                className="mb-2"
                isInvalid={!!errors.password} // если есть ошибки - подсвечиваем красным
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.password} { /* ошибка связанная с неправильно введенными данными */ }
              </div>
            </FormGroup>
          </div>
          <div className="user-section">
            <FormGroup>
              <FormLabel>{t("registrationForm.secondName")}</FormLabel>
              <FormControl
                onChange={handleChange}
                value={values.secondName}
                data-testid="input-body"
                name="secondName"
                id="secondName"
                isInvalid={!!errors.secondName} // если есть ошибки - подсвечиваем красным
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.secondName} { /* ошибка связанная с неправильно введенными данными */ }
              </div>
            </FormGroup>
            <FormGroup>
              <FormLabel>{t("registrationForm.name")}</FormLabel>
              <FormControl
                onChange={handleChange}
                value={values.name}
                data-testid="input-body"
                name="name"
                id="name"
                isInvalid={!!errors.name} // если есть ошибки - подсвечиваем красным
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.name} { /* ошибка связанная с неправильно введенными данными */ }
              </div>
            </FormGroup>
            <FormGroup>
              <FormLabel>{t("registrationForm.thirdName")}</FormLabel>
              <FormControl
                onChange={handleChange}
                value={values.thirdName}
                data-testid="input-body"
                name="thirdName"
                id="thirdName"
                isInvalid={!!errors.thirdName} // если есть ошибки - подсвечиваем красным
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.thirdName} { /* ошибка связанная с неправильно введенными данными */ }
              </div>
            </FormGroup>
          </div>
          <div className="user-section">
            <FormGroup>
              <FormLabel>{t("data.post")}</FormLabel>
              <FormControl
                onChange={handleChange}
                value={values.post}
                data-testid="input-body"
                name="post"
                id="post"
                isInvalid={!!errors.post} // если есть ошибки - подсвечиваем красным
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.post} { /* ошибка связанная с неправильно введенными данными */ }
              </div>
            </FormGroup>
            <FormGroup>
              <FormLabel>{t("data.department")}</FormLabel>
              <Dropdown>
                <Dropdown.Toggle variant="secondary">
                  {values.department ? values.department : "Отдел"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {departments.map((dept) => (
                    <Dropdown.Item
                      onClick={() => {
                        setFieldValue("department", dept); // 
                      }}
                      key={dept}
                    >
                      {dept}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.department} { /* ошибка связанная с невыбранным отделом */ }
              </div>
            </FormGroup>
            {!isCeoPost && (
              <FormGroup>
                <FormLabel>{t("data.access")}</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary">
                    {t(`access.${values.access}`)}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        setFieldValue("access", "employee");
                      }}
                    >
                      {t(`access.employee`)}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setFieldValue("access", "chat-operator");
                      }}
                    >
                      {t(`access.chat-operator`)}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setFieldValue("access", "hr-manager");
                      }}
                    >
                      {t(`access.hr-manager`)}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setFieldValue("access", "ceo");
                      }}
                    >
                      {t(`access.ceo`)}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.access} { /* ошибка связанная с невыбранным уровнем доступа */ }
                </div>
              </FormGroup>
            )}
            <FormGroup>
              <FormLabel>{t("data.activate")}</FormLabel>
              <Dropdown>
                <Dropdown.Toggle variant="secondary">
                  {values.isActive ? "Да" : "Нет"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      if (Object.keys(errors).length > 0) {
                        setFieldError("isActive", t("errors.activate"));
                      } else {
                        setFieldValue("isActive", true);
                      }
                    }}
                  >
                    Да
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setFieldValue("isActive", false);
                    }}
                  >
                    Нет
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.isActive} { /* ошибка связанная с активацией */ }
              </div>
            </FormGroup>
          </div>
          <div className="d-flex justify-content-end user-footer">
            {user ? (
              <>
                <Button onClick={removeCurrentUser} variant="secondary"> { /* на клик вешаем удаление юзера */ }
                  Удалить
                </Button>
                <Button
                  disabled={!canEditOrAdd} // запрещаем нажатие если есть ошибки
                  onClick={updateCurrentUser} // на клик вешаем обновление юзера
                  variant="primary"
                >
                  Изменить
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                disabled={!canEditOrAdd} // запрещаем нажатие если есть ошибки
                onClick={registerUser} // на клик вешаем регистрацию юзера
              >
                Добавить
              </Button>
            )}
          </div>
        </form>
      ) : ( // если user равен undefined - показывем выбор сотрудника
        <div className="choose-user rounded">
          Добавьте сотрудника или выберите из списка
        </div>
      )}
    </div>
  );
};
