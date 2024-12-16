import React, { useEffect, useState } from 'react';
import { Dialog,  DialogContent, DialogTitle, Typography, Box, TableContainer, TableHead, Table, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import axios from 'axios';
import GeradorRelatorioProcessoDetail from '../relatorio/GeradorRelatorioProcessoDetail';
import { Material } from './MaterialTab';

interface ProcessoDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  processo_id: number;
  material: Material | null;
  falhas: any[];
}

const ProcessoDetailsPopup: React.FC<ProcessoDetailsPopupProps> = ({
    open,
    onClose,
    processo_id,
    material,
    falhas,
  }) => {

  
  const [etapas, setEtapas] = useState([]);

  useEffect(() => {
    if (open) {
      axios.get(`http://0.0.0.0:8001/esterilizacao/processos/${processo_id}/etapas/`)
        .then(response => {
          setEtapas(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar etapas:', error);
        });
    }
  }, [open, processo_id]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalhes do Processo</DialogTitle>
      <DialogContent>
          <GeradorRelatorioProcessoDetail 
            material={material} 
            etapas={etapas} 
            falhas={falhas} 
            fileName={`Relatorio_Processo_${processo_id}`} 
          />

          <Box>
            <Typography><strong>Material:</strong> {material?.nome}</Typography>
            <Typography><strong>Tipo:</strong> {material?.tipo}</Typography>
            <Typography><strong>Status do Material:</strong> {material?.status}</Typography>

            <Typography sx={{ mt: 3 }} variant="h6">Etapas</Typography>
            {etapas.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Tipo</strong></TableCell>
                    <TableCell><strong>Data Início</strong></TableCell>
                    <TableCell><strong>Data Conclusão</strong></TableCell>
                    <TableCell><strong>Técnico Responsável</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {etapas.map((etapa:any) => (
                    <TableRow key={etapa.id}>
                      <TableCell>{etapa.tipo}</TableCell>
                      <TableCell>
                        {new Date(etapa.data_inicio).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {etapa.data_conclusao ? new Date(etapa.data_conclusao).toLocaleString('pt-BR') : 'Em andamento'}
                      </TableCell>
                      <TableCell>{etapa.tecnico_responsavel.username}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>Nenhuma etapa encontrada.</Typography>
          )}
            
            <Typography sx={{ mt: 3 }} variant="h6">Falhas Relatadas</Typography>
          {falhas.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Tipo de Falha</strong></TableCell>
                  <TableCell><strong>Descrição</strong></TableCell>
                  <TableCell><strong>Data</strong></TableCell>
                  <TableCell><strong>Etapa</strong></TableCell>
                  <TableCell><strong>Responsável</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {falhas.map((falha) => (
                  <TableRow key={falha.id}>
                    <TableCell>{falha.tipo_falha}</TableCell>
                    <TableCell>{falha.descricao}</TableCell>
                    <TableCell>
                      {new Date(falha.data_falha).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>{falha.etapa_tipo}</TableCell>
                    <TableCell>{falha.responsavel.username}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          ) : (
            <Typography>Nenhuma falha relatada.</Typography>
          )}
          </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessoDetailsPopup;
