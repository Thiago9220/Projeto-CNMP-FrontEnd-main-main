import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PrivateRoute from './pages/PrivateRoute';
import HomePageLogada from './pages/HomePageLogada';
import AdminPage from './pages/AdminPage/index';
import CadastramentoUsuarioPage from './pages/CadastramentoUsuarioPage';
import EditarPerfil from './pages/Perfil';
import MedicoesPage from './pages/Medicoes'; 


export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/medicoes" element={<MedicoesPage />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/HomePageLogada" element={<HomePageLogada />} />
        <Route path="/administracao" element={<AdminPage />} />
        <Route path="/cadastramentodeusuario" element={<CadastramentoUsuarioPage />} />
        <Route path="/perfil" element={<EditarPerfil />} />
        <Route path="*" element={<h1>404 Not Found</h1>} /> 
      </Routes>
    </Router>
  );
};

export default AppRouter;
