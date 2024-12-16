import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import MaterialDetailsPopup from './MaterialDetailsPopup';

interface Etapa {
    tipo: string;
  }

  interface TecnicoResponsavel {
    username: string;
  }
  
export interface Material {
    id: number,
    serial: string;
    nome: string;
    tipo: string;
    status: string;
    data_validade: string;
  }
  
export interface Processo {
    id: number;
    material__serial: string;
    data_inicio: string;
    data_conclusao: string;
    status: string;
    etapa_atual: Etapa;
    material: Material;
    tecnico_responsavel: TecnicoResponsavel;
  }

const MaterialTab: React.FC = () => {
    const [materiais, setMateriais] = useState<Material[]>([]);
    //const [processos, setProcessos] = useState<Processo[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null);
  
    const fetchMaterias = () => {
      axios
        .get('http://localhost:8001/esterilizacao/materiais/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        .then((response) => setMateriais(response.data))
        .catch((error) => console.error("Erro ao buscar materiais:", error));
    };

    useEffect(() => {
      axios.get('http://localhost:8001/esterilizacao/materiais/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response: any) => setMateriais(response.data))
        .catch((error) => console.error("Erro ao buscar materiais:", error));
    }, []);

    const handleOpenDialog = (material: Material) => {
        setSelectedMaterial(material);
        axios.get(`http://localhost:8001/esterilizacao/materiais/${material.id}/processo`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        })
        .then((response) => {
            setSelectedProcesso(response.data);
            setOpen(true);
        })
        .catch((error) => {
            console.error("Erro ao buscar o processo em andamento:", error);
            setSelectedProcesso(null);
            setOpen(true);
        });
      };
    
      const handleCloseDialog = () => {
        setOpen(false);
        setSelectedMaterial(null);
        setSelectedProcesso(null);
      };
    
      const handleIniciarProcesso = () => {
        if (selectedMaterial) {
          const newProcessData = {
            material_id: selectedMaterial.id,
            tecnico_responsavel_id: Number(localStorage.getItem('user_id')) || 0,
            status: 'em_andamento',
            data_inicio: new Date().toISOString(),
          };
    
          axios.post('http://localhost:8001/esterilizacao/processos/', newProcessData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          })
            .then(() => {
              fetchMaterias();
              setOpen(false);
              axios.get('http://localhost:8001/esterilizacao/processos/', {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
              })
                //.then((response) => setProcessos(response.data));
            })
            .catch((error) => console.error("Erro ao criar processo:", error));
        }
      };
  
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Gerenciar Materiais</Typography>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materiais.map((material) => (
                <TableRow key={material.serial}>
                  <TableCell>{material.serial}</TableCell>
                  <TableCell>{material.nome}</TableCell>
                  <TableCell>{material.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenDialog(material)} variant="outlined">
                        VISUALIZAR
                    </Button>
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <MaterialDetailsPopup
            open={open}
            onClose={handleCloseDialog}
            material={selectedMaterial}
            processo={selectedProcesso}
            onIniciarProcesso={handleIniciarProcesso}
        />
      </Box>
    );
};

export default MaterialTab;
