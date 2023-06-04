import { useEffect, useState } from 'react';
import { getUsersFromDepts } from '../services/users';

export const useGetAllUsers = (departments) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsersFromDepts(departments);
      setUsers(fetchedUsers)
    };
  
    fetchUsers();
  }, []);

  return users;
};