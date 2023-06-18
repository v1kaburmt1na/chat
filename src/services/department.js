import store from "../slices/index.js";
import { db } from "./init.js";
import { actions } from "../slices/departmentSlice.js";
import {
  query,
  collection,
  onSnapshot,
  doc,
  where,
  arrayUnion,
  arrayRemove,
  updateDoc,
  limit,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";
import i18next from "i18next";

const departmentsCollection = doc(db, "utils", "departments"); // для удобства доступа

export const fetchDepartments = async () => { // запрашиваем все отделы
  onSnapshot(departmentsCollection, async (doc) => { // подписываемся на изменение отделов в бд
    const result = doc.data().arr; // получаем отделы обращаясь к полю arr
    store.dispatch(actions.setDepartments(result)); // добавляем все отделы в наше redux хранилище
  });
};

export const addDepartment = async (data) => { // добавить отдел
  const { dept } = data;
  try {
    await updateDoc(departmentsCollection, { // обновляем документ по пути "utils/departments"
      arr: arrayUnion(dept), // добавляем в конец массива новый отдел
    });
    toast.success(i18next.t("success.addDept")); // оповещаем об удачном добавлении отдела
  } catch (e) {
    toast.error(i18next.t("errors.addDept")); // оповещаем о неудачном добавлении отдела
  }
};

export const removeDepartment = async (data) => { // удаление отдела
  const { dept } = data;
  const usersInDeptRef = query( // смотрим есть ли хотя бы 1 человек в отделе
    collection(db, "users"),
    where("department", "==", dept),
    limit(1)
  );
  const userInDept = (await getDocs(usersInDeptRef)).docs[0]; // получаем первого юзера
  if (userInDept) { // если он есть - дропаем ошибку
    toast.error(i18next.t("errors.userInDept"));
    return;
  }
  try {
    await updateDoc(departmentsCollection, { // удаляем отдел из массива отделов
      arr: arrayRemove(dept),
    });
    toast.success(i18next.t("success.removeDept"));
  } catch (e) {
    toast.error(i18next.t("errors.removeDept"));
  }
};
