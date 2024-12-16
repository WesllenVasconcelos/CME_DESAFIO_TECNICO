import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import ProcessoDetailsPopup from './ProcessoDetailPopup';
import FalhaFormPopup from './FalhaFormPopup';

interface Etapa {
    id: number;
    tipo: string;
    status: string;
  }
  
  interface Processo {
    id: number;
    serial: string;
    data_inicio: string;
    status: string;
    etapa_atual: Etapa | null;
  }

  interface Material {
    nome: string;
    tipo: string;
    status: string;
  }

const ProcessoTab: React.FC = () => {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedEtapa, setSelectedEtapa] = useState<Etapa | null>(null);
  const [openFalhaPopup, setOpenFalhaPopup] = useState(false);
  const [falhas, setFalhas] = useState<any[]>([]); 

  const handleRelatarFalha = () => setOpenFalhaPopup(true);

  const fetchProcessos = () => {
    axios
      .get('http://localhost:8001/esterilizacao/processos/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => setProcessos(response.data))
      .catch((error) => console.error("Erro ao buscar processos:", error));
  };

  const handleIniciarProximaEtapa = async () => {
    try {
      const response = await fetch(`http://localhost:8001/esterilizacao/processos/${selectedProcesso?.id}/criar-etapa/`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        fetchProcessos();
        handleClosePopup();
      } else {
        alert(data.detail);
      }
    } catch (error) {
      console.error("Erro ao iniciar próxima etapa:", error);
    }
  };

  const handleFinalizarEtapa = async () => {
    try {
      const response = await fetch(`http://localhost:8001/esterilizacao/etapas/${selectedEtapa?.id}/atualizar-status/`, {
        method: 'PATCH',
      });
      const data = await response.json();
      if (response.ok) {
        fetchProcessos();
        handleClosePopup();
      } else {
        alert(data.detail);
      }
    } catch (error) {
      console.error("Erro ao finalizar etapa:", error);
    }
  };

  const handleSubmitFalha = async(tipoFalha: string, descricao: string) => {
    const id = selectedEtapa?.id || 0
    
    const newFalhaData = {
      etapa:id,
      tipo_falha:tipoFalha,
      descricao:descricao,
      tecnico_responsavel_id: Number(localStorage.getItem('user_id')) || 0,
      data_falha: new Date().toISOString(),
    };

    try {
      await axios.post(`http://localhost:8001/esterilizacao/falhas/`, newFalhaData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }).then(() => {
        fetchProcessos();
        handleClosePopup();
      })
      setOpenFalhaPopup(false);
    } catch (error) {
      console.error("Erro ao relatar falha:", error);
    }
  }


  useEffect(() => {
    axios.get('http://localhost:8001/esterilizacao/processos/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => setProcessos(response.data))
      .catch((error) => console.error("Erro ao buscar processos:", error));
  }, []);

    const handleOpenPopup = (processo: Processo) => {
      axios.get(`http://localhost:8001/esterilizacao/processos/${processo.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response) => {
          setSelectedProcesso(processo)
          setSelectedMaterial(response.data.material);
          setSelectedEtapa(processo.etapa_atual);
          setOpenPopup(true);

          if (processo.etapa_atual) {
            axios
              .get(`http://localhost:8001/esterilizacao/processos/${processo.id}/falhas/`, {
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
          setSelectedEtapa(null);
          setFalhas([]);
          setOpenPopup(true);
        });
    };
  
    const handleClosePopup = () => {
      setOpenPopup(false);
      setSelectedMaterial(null);
      setSelectedEtapa(null);
    };
  
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Gerenciar Processos</Typography>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Serial</TableCell>
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
            material={selectedMaterial}
            etapa={selectedEtapa}
            onRelatarFalha={() => handleRelatarFalha()}
            onIniciarProximaEtapa={() => handleIniciarProximaEtapa()}
            onFinalizarEtapa={() => handleFinalizarEtapa()}
            falhas={falhas}
            />
          <FalhaFormPopup
            open={openFalhaPopup}
            onClose={() => setOpenFalhaPopup(false)}
            onSubmit={handleSubmitFalha}
          />
        </TableContainer>
      </Box>
    );
};

export default ProcessoTab;
