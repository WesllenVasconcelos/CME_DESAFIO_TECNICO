import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import EditPopup from './EditPopup';
import CreatePopup from './CreatePopup';

interface User {
  id: number;
  username: string;
  email: string;
  cargo: string;
}

const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [cargoOptions, setCargoOptions] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8001/core/users',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch('http://localhost:8001/core/cargos')
      .then((res) => res.json())
      .then((data) => setCargoOptions(data));
  }, []);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setOpenEditPopup(true);
  };

  const handleSave = (updatedUser: any) => {
    fetch(`http://localhost:8001/core/users/${updatedUser.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(updatedUser),
    }).then(() => {
      setUsers((prev: any) =>
        prev.map((u: any) => (u.id === updatedUser.id ? updatedUser : u))
      );
    });
  };

  const handleCreate = (newUser: any) => {
    fetch('http://localhost:8001/core/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers((prev:any) => [...prev, data]);
        setOpenCreatePopup(false);
      })
      .catch((error) => console.error('Error creating user:', error));
  };

  return (
    <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Usuários</Typography>
        <Button variant="contained" onClick={() => setOpenCreatePopup(true)}>
          Criar Usuário
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Cargo</TableCell>
            <TableCell>Ação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.cargo}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(user)} variant="outlined">
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditPopup
        open={openEditPopup}
        onClose={() => setOpenEditPopup(false)}
        onSave={handleSave}
        initialData={selectedUser}
        fields={[
          { label: 'Username', name: 'username' },
          { label: 'Email', name: 'email' },
          { label: 'Cargo', name: 'cargo', type: 'select', options: cargoOptions },
        ]}
      />
      <CreatePopup
        open={openCreatePopup}
        onClose={() => setOpenCreatePopup(false)}
        onSave={(newData) => {
          handleCreate(newData);
          setOpenCreatePopup(false);
        }}
        fields={[
          { label: 'Username', name: 'username' },
          { label: 'Email', name: 'email' },
          { label: 'Senha', name: 'password', type: 'password' },
          { label: 'Cargo', name: 'cargo', type: 'select', options: cargoOptions },
        ]}
      />
    </Box>
  );
};

export default UsersTab;
