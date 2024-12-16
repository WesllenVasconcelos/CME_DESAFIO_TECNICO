import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';
import { Material, Processo } from './MaterialTab';
import ProcessoDetailsPopup from './ProcessoDetailsPopup';
import GeradorRelatorioMateriaisDetails from '../relatorio/GeradorRelatorioMateriaisDetails';

interface MaterialDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  material: Material | null;
  processos: Processo[];
}

const MaterialDetailsPopup: React.FC<MaterialDetailsPopupProps> = ({ open, onClose, material, processos }) => {

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [processoId, setProcessoId] = useState<number>();
  const [falhas, setFalhas] = useState<any[]>([]);
  
    const handleOpenPopup = (processo: Processo) => {
        setProcessoId(processo.id)
        axios.get(`http://localhost:8001/esterilizacao/processos/${processo.id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
          .then((response) => {
            setSelectedMaterial(response.data.material);
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
            setFalhas([]);
            setOpenPopup(true);
          });
      };
  
      const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectedMaterial(null);
      };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalhes do Material</DialogTitle>
      <DialogContent>
        {material && (
          
          <Box>
            <Box sx={{ mt: 2 }}>
              <GeradorRelatorioMateriaisDetails 
                material={material} 
                processos={processos} 
                fileName={`Relatorio_Material_${material.nome}`} 
              />
            </Box>

            <Typography><strong>Nome:</strong> {material.nome}</Typography>
            <Typography><strong>Tipo:</strong> {material.tipo}</Typography>
            <Typography><strong>Serial:</strong> {material.serial}</Typography>
            <Typography><strong>Data de Validade:</strong> {material.data_validade}</Typography>
            <Typography><strong>Status:</strong> {material.status}</Typography>

            <Typography sx={{ mt: 3 }} variant="h6">Processos</Typography>
            {processos.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
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
            </TableContainer>
            ) : (
                <Typography>Nenhum processo iniciado.</Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Fechar</Button>
      </DialogActions>
        <ProcessoDetailsPopup
            open={openPopup}
            onClose={handleClosePopup}
            processo_id={processoId || 0}
            material={selectedMaterial}
            falhas={falhas}
            />
    </Dialog>
  );
};

export default MaterialDetailsPopup;
