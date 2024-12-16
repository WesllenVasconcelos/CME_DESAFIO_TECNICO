import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import EditPopup from './EditPopup';
import CreatePopup from './CreatePopup';

interface Material {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  serial: string;
  data_validade: string;
}

const MaterialsTab: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8001/esterilizacao/materiais/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setMaterials(data))
      .catch((error) => console.error('Error fetching materials:', error));
  }, []);

  const handleEdit = (user: any) => {
    setSelectedMaterial(user);
    setOpenEditPopup(true);
  };

  const handleSave = (updatedMaterial: any) => {
    fetch(`http://localhost:8001/esterilizacao/materiais/${updatedMaterial.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(updatedMaterial),
    }).then(() => {
      setMaterials((prev: any) =>
        prev.map((u: any) => (u.id === updatedMaterial.id ? updatedMaterial : u))
      );
    });
  };

  const handleCreate = (newMaterial: any) => {
    fetch('http://localhost:8001/esterilizacao/materiais/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(newMaterial),
    })
      .then((response) => response.json())
      .then((data) => {
        setMaterials((prev) => [...prev, data]);
        setOpenCreatePopup(false);
      })
      .catch((error) => console.error('Error creating material:', error));
  };

  return (
    <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Materiais</Typography>
        <Button variant="contained" onClick={() => setOpenCreatePopup(true)}>
        Criar Material
        </Button>
    </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Serial</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Data de Validade</TableCell>
            <TableCell>Ação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>{material.serial}</TableCell>
              <TableCell>{material.nome}</TableCell>
              <TableCell>{material.tipo}</TableCell>
              <TableCell>{material.status}</TableCell>
              <TableCell>{material.data_validade}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(material)} variant="outlined">
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
        initialData={selectedMaterial}
        fields={[
          { label: 'Nome', name: 'nome' },
          { label: 'Tipo', name: 'tipo' },
          { label: 'Data de Validade', name: 'data_validade', type: 'date' },
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
            { label: 'Nome', name: 'nome' },
            { label: 'Tipo', name: 'tipo' },
            { label: 'Data de Validade', name: 'data_validade', type: 'date' },
        ]}
      />
    </Box>
  );
};

export default MaterialsTab;
