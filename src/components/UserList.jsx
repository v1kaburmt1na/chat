import { useSelector } from "react-redux";
import { Button, Table } from "react-bootstrap";

export const UserList = (props) => {
  const { setUser } = props;
  const users = useSelector((state) => state.users.users);
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
            } = user;
            return (
              <tr onClick={() => setUser(user.id)} key={id}>
                <th>{username}</th>
                <th>{secondName}</th>
                <th>{name}</th>
                <th>{thirdName}</th>
                <th>{post}</th>
                <th>{department}</th>
                <th>{isActive ? "Да" : "Нет"}</th>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Button onClick={() => setUser(null)}>Добавить сотрудника</Button>
    </div>
  );
};
