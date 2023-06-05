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
  const { t } = useTranslation();
  const { user, setUser } = props;
  const users = useSelector((state) => state.users.users);
  let currentUser = users.find((u) => u.id === user);

  if (user === null) {
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
  const departments = useSelector((state) => state.department.depts);
  const formik = useFormik({
    validationSchema: schema,
    initialValues: setValues(currentUser),
  });
  const { values, errors, handleChange, setFieldValue, setFieldError } = formik;
  useEffect(() => {
    formik.setValues(setValues(currentUser));
  }, [currentUser]);

  const removeCurrentUser = () => {
    removeUser(currentUser?.id);
    setUser(undefined);
  };

  const updateCurrentUser = () => {
    updateUser(values, currentUser?.id, currentUser.chats);
  };

  const registerUser = () => {
    register(values);
    setUser(undefined);
  };

  const errorsCount = Object.keys(errors).length;
  const canEditOrAdd = errorsCount === 0;

  const className = cn("user", {
    "users-blank": user === undefined,
  });

  return (
    <div className={className}>
      {user !== undefined ? (
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
                isInvalid={!!errors.username}
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.username}
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
                isInvalid={!!errors.password}
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.password}
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
                isInvalid={!!errors.secondName}
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.secondName}
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
                isInvalid={!!errors.name}
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.name}
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
                isInvalid={!!errors.thirdName}
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.thirdName}
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
                isInvalid={!!errors.post}
              />
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.post}
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
                        setFieldValue("department", dept);
                      }}
                      key={dept}
                    >
                      {dept}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.department}
              </div>
            </FormGroup>
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
                {errors.access}
              </div>
            </FormGroup>
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
                {errors.isActive}
              </div>
            </FormGroup>
          </div>
          <div className="d-flex justify-content-end user-footer">
            {user ? (
              <>
                <Button onClick={removeCurrentUser} variant="secondary">
                  Удалить
                </Button>
                <Button
                  disabled={!canEditOrAdd}
                  onClick={updateCurrentUser}
                  variant="primary"
                >
                  Изменить
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                disabled={!canEditOrAdd}
                onClick={registerUser}
              >
                Добавить
              </Button>
            )}
          </div>
        </form>
      ) : (
        <div className="choose-user rounded">
          Добавьте сотрудника или выберите из списка
        </div>
      )}
    </div>
  );
};
