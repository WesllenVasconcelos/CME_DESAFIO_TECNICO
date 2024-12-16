import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import ProcessoDetailsPopup from './ProcessoDetailsPopup';
import GeradorRelatorioProcessos from '../relatorio/GeradorRelatorioProcessos';
import { Material } from './MaterialTab';
// import ProcessoDetailsPopup from './ProcessoDetailPopup';
// import FalhaFormPopup from './FalhaFormPopup';

interface Etapa {
    id: number;
    tipo: string;
    status: string;
  }
  
  interface Processo {
    id: number;
    serial: string;
    material: {
        nome: string;
    }
    data_inicio: string;
    status: string;
    etapa_atual: Etapa | null;
  }

const ProcessoTab: React.FC = () => {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [processoId, setProcessoId] = useState<number>();
  const [falhas, setFalhas] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://0.0.0.0:8001/esterilizacao/processos/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => setProcessos(response.data))
      .catch((error) => console.error("Erro ao buscar processos:", error));
  }, []);

    const handleOpenPopup = (processo: Processo) => {
      setProcessoId(processo.id)

      axios.get(`http://0.0.0.0:8001/esterilizacao/processos/${processo.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response) => {
          setSelectedMaterial(response.data.material);
          setOpenPopup(true);

          if (processo.etapa_atual) {
            axios
              .get(`http://0.0.0.0:8001/esterilizacao/processos/${processo.id}/falhas/`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
              })
              .then((response) => setFalhas(response.data))
              .catch((error) => console.error("Erro ao buscar falhas:", error));
          } else {
            setFalhas([]);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar material:", error);
          setSelectedMaterial(null);
          setFalhas([]);
          setOpenPopup(true);
        });
    };
  
    const handleClosePopup = () => {
      setOpenPopup(false);
      setSelectedMaterial(null);
    };
  
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Gerenciar Processos</Typography>

        <GeradorRelatorioProcessos
          data={processos}
          fileName="Processos"
          columns={[
            { header: 'ID', key: 'id' },
            { header: 'Serial', key: 'serial' },
            { header: 'Nome do Material', key: 'material.nome' },
            { header: 'Data de Início', key: 'data_inicio' },
            { header: 'Status', key: 'status' },
            { header: 'Etapa Atual', key: 'etapa_atual.tipo' }
          ]}
        />
        
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Serial</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Data Início</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Etapa Atual</TableCell>
                <TableCell>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell>{processo.id}</TableCell>
                  <TableCell>{processo.serial}</TableCell>
                  <TableCell>{processo.material.nome}</TableCell>
                  <TableCell>{new Date(processo.data_inicio).toLocaleString()}</TableCell>
                  <TableCell>{processo?.status}</TableCell>
                  <TableCell>{processo.etapa_atual ? processo.etapa_atual.tipo : 'Nenhuma'}</TableCell>
                  <TableCell>
                  <Button onClick={() => handleOpenPopup(processo)} variant="outlined">Detalhes</Button>
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ProcessoDetailsPopup
            open={openPopup}
            onClose={handleClosePopup}
            processo_id={processoId || 0}
            material={selectedMaterial}
            falhas={falhas}
            />
        </TableContainer>
      </Box>
    );
};

export default ProcessoTab;
