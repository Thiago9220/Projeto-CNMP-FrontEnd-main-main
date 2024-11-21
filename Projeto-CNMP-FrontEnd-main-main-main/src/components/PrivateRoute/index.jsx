import React from 'react';
import { Navigate } from 'react-router-dom';

// Função para obter o perfil do usuário do localStorage
const getUserProfile = () => {
  const perfil = localStorage.getItem('perfil');
  return perfil || null;
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token'); // Verifica se o usuário está logado
  const userProfile = getUserProfile(); // Obtém o perfil do usuário

  // Se o usuário não estiver logado, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Se o perfil do usuário não estiver incluído nos papéis permitidos, bloqueia o acesso
  if (!allowedRoles.includes(userProfile)) {
    return <Navigate to="/medicoes" />; // Redireciona o usuário para a página de medição de indicadores
  }

  // Se o usuário estiver autenticado e tiver permissão, renderiza o componente
  return children;
};

export default PrivateRoute;
