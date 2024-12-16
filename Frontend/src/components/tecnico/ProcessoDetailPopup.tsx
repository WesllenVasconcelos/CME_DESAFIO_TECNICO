import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box, TableContainer, TableHead, Table, TableRow, TableCell, TableBody, Paper } from '@mui/material';

interface Material {
  nome: string;
  tipo: string;
  status: string;
}

interface Etapa {
  tipo: string;
  status: string;
}

interface ProcessoDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  onRelatarFalha: () => void;
  onIniciarProximaEtapa: () => void;
  onFinalizarEtapa: () => void;
  material: Material | null;
  etapa: Etapa | null;
  falhas: any[];
}

const ProcessoDetailsPopup: React.FC<ProcessoDetailsPopupProps> = ({
    open,
    onClose,
    onRelatarFalha,
    onIniciarProximaEtapa,
    onFinalizarEtapa,
    material,
    etapa,
    falhas,
  }) => {
    const etapaCompleta = etapa?.status === "completa";

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalhes do Processo</DialogTitle>
      <DialogContent>
          <Box>
            <Typography><strong>Material:</strong> {material?.nome}</Typography>
            <Typography><strong>Tipo:</strong> {material?.tipo}</Typography>
            <Typography><strong>Status do Material:</strong> {material?.status}</Typography>
            <Typography sx={{ mt: 3 }} variant="h6">Etapa Atual</Typography>
            {etapa ? (
              <>
                <Typography><strong>Tipo:</strong> {etapa.tipo}</Typography>
                <Typography><strong>Status:</strong> {etapa.status}</Typography>
              </>
            ) : (
              <Typography>Nenhuma etapa vinculada.</Typography>
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
      <DialogActions>
        {etapaCompleta || !etapa ? (
          <Button onClick={onIniciarProximaEtapa} color="primary">Iniciar Próxima Etapa</Button>
        ) : (
          <>
            <Button onClick={onFinalizarEtapa} color="primary">Finalizar Etapa</Button>
            <Button onClick={onRelatarFalha} color="secondary">Relatar Falha</Button>
          </>
        )}
        <Button onClick={onClose} color="primary">Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcessoDetailsPopup;
