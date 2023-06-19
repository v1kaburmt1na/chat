import {
  Modal,
  FormControl,
  Badge,
  CloseButton,
  Button,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { addDepartment, removeDepartment } from "../../services/department";
import { useState } from "react";

export const Departments = (props) => {
  // Модалка отделов
  const { onHide } = props;
  const depts = useSelector((state) => state.department.depts); // получаем все отделы из хранилища
  const [newDept, setNewDept] = useState(""); // новый отдел
  const removeDept = (dept) => () => {
    // удаление отдела
    removeDepartment({ dept });
  };

  const addDept = (e) => {
    // добавить отдел
    const formattedDept = newDept.trim();
    e.preventDefault();
    if (depts.includes(formattedDept)) {
      // если отдел, который мы вписали уже есть - ничего не делаем
      return;
    }
    if (formattedDept.length > 0) {
      addDepartment({ dept: newDept }); // добавляем новый отдел
      setNewDept(""); // очищаем поле для добавления нового отдела
    }
  };
  return (
    <Modal show onHide={onHide}>
      {/* Компонент модалки, сразу ставим проп show = true чтоб показывать */}
      <Modal.Header closeButton onHide={onHide}>
        {/* Обертка, которой добавляем кнопку и добавляем обработчик на закрытие */}
        <Modal.Title>Отделы</Modal.Title>
        {/* заголовок модалки */}
      </Modal.Header>

      <Modal.Body>
        <div className="depts-wrapper">
          {depts.map(
            (
              dept // отрисовываем отделы
            ) => (
              <Badge key={dept} className="p-2 dept">
                <div className="d-flex align-items-center">
                  <span>{dept}</span>
                  <CloseButton
                    variant="white"
                    className="ms-2"
                    onClick={removeDept(dept)} // при нажатии удалить отдел на который нажали
                  />
                </div>
              </Badge>
            )
          )}
        </div>
        <form className="dept-add" onSubmit={addDept}>
          <FormControl
            value={newDept} // input со значением из состояние
            onChange={(e) => setNewDept(e.target.value)} // при изменении input менять состояние
          />
          <Button
            disabled={newDept.length === 0} // отключаем возможность нажать на кнопку если название отдела не было введено
            type="submit"
            className="dept-add-btn"
          >
            Добавить отдел
          </Button>{" "}
          {/* делаем неактивной если наше состояние пустое */}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={onHide} variant="secondary">
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
