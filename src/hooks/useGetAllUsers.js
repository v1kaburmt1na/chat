import { useEffect, useState } from 'react';
import { getUsersFromDepts } from '../services/users';

export const useGetAllUsers = (departments) => { // получаем всех пользователей
  const [users, setUsers] = useState([]); // список юзеров

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsersFromDepts(departments); // получаем всех пользотвалей по переданному массиву отделом
      setUsers(fetchedUsers); // устанавливаем пользователей
    };
  
    fetchUsers();
  }, []);

  return users;
};