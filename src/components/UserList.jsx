import { useSelector } from "react-redux";
import { Button, Table } from "react-bootstrap";

export const UserList = (props) => {
  const { setUser } = props; // берем функцию для выбора юзера
  const users = useSelector((state) => state.users.users); // берем всех юзеров из хранилища
  return (
    <div className="users-list">
      <Table striped bordered hover className="users-table">
        <thead>
          <tr>
            <th>Логин</th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
            <th>Должность</th>
            <th>Отдел</th>
            <th>Активирован</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const {
              id,
              username,
              secondName,
              name,
              thirdName,
              post,
              department,
              isActive,
            } = user; // достаем данные из юзера, которые в дальнейшем будем отображать
            return (
              <tr onClick={() => setUser(user.id)} key={id}>
                <th>{username}</th> { /* юзернейм */ }
                <th>{secondName}</th> { /* фамилия */ }
                <th>{name}</th> { /* имя */ } 
                <th>{thirdName}</th> { /* отчество */ }
                <th>{post}</th> { /* должность */ }
                <th>{department}</th> { /* отдел */ }
                <th>{isActive ? "Да" : "Нет"}</th> { /* активен ли аккаунт */ }
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Button onClick={() => setUser(null)}>Добавить сотрудника</Button> { /* при нажатии меняем текущего юзера на null и регистрируем */ }
    </div>
  );
};
