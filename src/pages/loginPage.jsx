import React, { useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import loginPhoto from "/loginPhoto.jpg";
import { login } from "../services/user.js";

function LoginPage() {
  const { t } = useTranslation(); // берем функцию для перевода
  const inputEl = useRef(); // создаем ref для автофокуса на поле
  const navigate = useNavigate(); // берем функцию роутинга
  const user = useSelector((state) => state.user);
  useEffect(() => {
    inputEl.current.focus(); // автофокус при инициализации компонента
  }, []);

  console.log(user.isAuthorized);

  useEffect(() => {
    if (user.isAuthorized) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="login-page container-fluid">
      <div className="row justify-content-center align-content-center h-100">
        <div className="register-card__wrapper">
          <div className="card shadow-sm">
            <div className="card-body row p-5 register-card">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={loginPhoto}
                  width="250"
                  className="rounded-circle"
                  alt="Войти"
                />
              </div>
              <Formik
                onSubmit={({ username, password }) => {
                  const user = {
                    username,
                    password,
                  };
                  console.log(user);
                  login(user);
                }}
                initialValues={{
                  // стартовые значения
                  username: "",
                  password: "",
                }}
              >
                {({ handleSubmit, handleChange, values, errors }) => (
                  <Form
                    className="col-12 col-md-6 mt-3 mt-mb-0"
                    onSubmit={handleSubmit}
                  >
                    {" "}
                    {/* отправка формы */}
                    <h1 className="text-center mb-4">
                      {t("loginForm.headling")}
                    </h1>
                    <Form.Floating className="mb-3">
                      <Form.Control
                        id="username"
                        name="username"
                        placeholder={t(
                          "loginForm.username"
                        )} /* текст из локализации будет выведен если значение не введено */
                        required // делаем поле обязательным
                        autoComplete="username"
                        onChange={handleChange} // на изменение вызываем функцию handleChange
                        value={values.username} // введенные значения юзеренйма
                        ref={inputEl} // реф для автофокуса
                        isInvalid={
                          !!errors.username
                        } /* проверка поля на валидность */
                      />
                      <label htmlFor="username">
                        {t("loginForm.username")}
                      </label>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                      <Form.Control
                        id="password"
                        name="password"
                        placeholder={t("loginForm.password")}
                        required
                        type="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                        value={values.password}
                        isInvalid={!!errors.password}
                      />
                      <label htmlFor="password">
                        {t("loginForm.password")}
                      </label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Floating>
                    <Button
                      className="w-100"
                      variant="outline-primary"
                      type="submit"
                    >
                      {t("buttons.login")}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
