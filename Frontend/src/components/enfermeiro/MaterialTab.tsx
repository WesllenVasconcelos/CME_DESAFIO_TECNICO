import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import MaterialDetailsPopup from './MaterialDetailsPopup';
import GeradorRelatorioMateriais from '../relatorio/GeradorRelatorioMateriais';

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
    const [open, setOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [processos, setProcessos] = useState<Processo[]>([]);

    useEffect(() => {
      axios.get('http://0.0.0.0:8001/esterilizacao/materiais/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response: any) => setMateriais(response.data))
        .catch((error) => console.error("Erro ao buscar materiais:", error));
    }, []);

    const handleOpenDialog = (material: Material) => {
        setSelectedMaterial(material);
        axios.get(`http://0.0.0.0:8001/esterilizacao/materiais/${material.id}/processos`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        })
        .then((response) => {
            setProcessos(response.data);
            setOpen(true);
        })
        .catch((error) => {
            console.error("Erro ao buscar os processos:", error);
        });
      };
    
      const handleCloseDialog = () => {
        setOpen(false);
        setSelectedMaterial(null);
      };
  
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Gerenciar Materiais</Typography>

          <GeradorRelatorioMateriais
          data={materiais}
          fileName="Materiais"
          columns={['serial', 'nome', 'tipo', 'status', 'data_validade']}
        />

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
            processos={processos}
        />
      </Box>
    );
};

export default MaterialTab;
