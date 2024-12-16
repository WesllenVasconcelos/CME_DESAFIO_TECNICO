import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

interface EditPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any | null; 
  fields: { label: string; name: string; type?: string; options?: { value: string; label: string }[] }[];
}

const EditPopup: React.FC<EditPopupProps> = ({ open, onClose, onSave, initialData, fields }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev:any) => ({ ...prev, [name as string]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!formData) return null; 

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: '400px',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Editar
        </Typography>
        {fields.map((field) => (
          <Box key={field.name} sx={{ mb: 2 }}>
            {field.type === 'select' ? (
              <FormControl fullWidth>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e: any) => handleChange(e)}
                  label={field.label}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                label={field.label}
                name={field.name}
                type={field.type || 'text'}
                value={formData[field.name] || ''}
                onChange={handleChange}
                fullWidth
              />
            )}
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditPopup;
