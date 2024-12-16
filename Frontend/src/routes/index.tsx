import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import AdminHome from '../pages/AdminHome';
import TecnicoHome from '../pages/TecnicoHome';
import EnfermeiroHome from '../pages/EnfermeiroHome';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin-home" element={<AdminHome />} />
      <Route path="/tecnico-home" element={<TecnicoHome />} />
      <Route path="/enfermeiro-home" element={<EnfermeiroHome />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
