import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ProcessoDetailsPopupProps {
  cargo: string;
}

const Navbar: React.FC<ProcessoDetailsPopupProps> = ({ cargo }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('cargo');
    
    navigate('/');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema de Esterilização - Cargo {cargo}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
