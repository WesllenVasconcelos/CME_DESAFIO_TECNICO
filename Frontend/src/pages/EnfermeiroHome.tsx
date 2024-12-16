import React, { useState } from 'react';
import { Container, Box, Tabs, Tab } from '@mui/material';
import Navbar from '../components/Navbar';
import MaterialTab from '../components/enfermeiro/MaterialTab';
import ProcessoTab from '../components/enfermeiro/ProcessoTab';

const EnfermeiroHome: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  
  return (
    <div>
      <Navbar cargo={"ENFERMEIRO"} />
      <Container maxWidth="lg">
        <Box sx={{ mt: 5 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
            <Tabs value={selectedTab} onChange={handleTabChange} aria-label="aba de materiais e processos">
              <Tab label="Material" />
              <Tab label="Processo" />
            </Tabs>
          </Box>

          {selectedTab === 0 && <MaterialTab />}
          {selectedTab === 1 && <ProcessoTab />}
        </Box>
      </Container>
    </div>
  );
};

export default EnfermeiroHome;
