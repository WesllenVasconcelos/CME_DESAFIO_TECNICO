import React, { useState } from 'react';
import { Container, Box, Tabs, Tab } from '@mui/material';
import Navbar from '../components/Navbar';
import MaterialsTab from '../components/admin/MaterialsTab';
import UsersTab from '../components/admin/UsersTab';

const AdminHome: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Navbar cargo={"ADMINISTRADOR"} />
      <Container maxWidth="lg">
        <Box sx={{ mt: 5 }}>
          <Box sx={{ mt: 4 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Materiais" />
              <Tab label="Usuários" />
            </Tabs>

            {tabValue === 0 && <MaterialsTab />}
            {tabValue === 1 && <UsersTab />}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AdminHome;
