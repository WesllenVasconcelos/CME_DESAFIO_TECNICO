import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';


interface FalhaFormPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tipoFalha: string, descricao: string) => void;
}

const FalhaFormPopup: React.FC<FalhaFormPopupProps> = ({ open, onClose, onSubmit }) => {
  const [tipoFalha, setTipoFalha] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = () => {
    onSubmit(tipoFalha, descricao);
    setTipoFalha('');
    setDescricao('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Relatar Falha</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Tipo de Falha"
          value={tipoFalha}
          onChange={(e) => setTipoFalha(e.target.value)}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Descrição"
          multiline
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSubmit} color="primary">Submeter</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FalhaFormPopup;
