import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material';
import { Processo, Material } from '../tecnico/MaterialTab';

interface MaterialDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  material: Material | null;
  processo: Processo | null;
  onIniciarProcesso: () => void;
}

const MaterialDetailsPopup: React.FC<MaterialDetailsPopupProps> = ({ open, onClose, material, processo, onIniciarProcesso }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalhes do Material</DialogTitle>
      <DialogContent>
        {material && (
          <Box>
            <Typography><strong>Nome:</strong> {material.nome}</Typography>
            <Typography><strong>Tipo:</strong> {material.tipo}</Typography>
            <Typography><strong>Serial:</strong> {material.serial}</Typography>
            <Typography><strong>Data de Validade:</strong> {material.data_validade}</Typography>
            <Typography><strong>Status:</strong> {material.status}</Typography>

            <Typography sx={{ mt: 3 }} variant="h6">Processo em andamento</Typography>
            {processo ? (
              <>
                <Typography sx={{ mt: 2 }}><strong>Status:</strong> {processo.status}</Typography>
                <Typography><strong>Data de Início:</strong> {new Date(processo.data_inicio).toLocaleString()}</Typography>
                <Typography><strong>Data de Conclusão:</strong> {processo.data_conclusao ? new Date(processo.data_conclusao).toLocaleString() : 'Não Concluído'}</Typography>
                <Typography><strong>Técnico Responsável:</strong> {processo.tecnico_responsavel.username}</Typography>
                <Typography><strong>Etapa Atual:</strong> {processo.etapa_atual ? processo.etapa_atual.tipo : 'Nenhuma'}</Typography>
              </>
            ) : (
              <Typography>Nenhum processo atual em andamento para este material.</Typography>
            )}

            {(!processo || processo.status === 'completo') && (
              <Button onClick={onIniciarProcesso} variant="outlined" color="primary" sx={{ mt: 2 }}>Iniciar Processo</Button>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialDetailsPopup;
