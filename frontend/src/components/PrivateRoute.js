// frontend/src/components/PrivateRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.userLogin);

  // Se o usuário estiver logado, renderiza o conteúdo da rota (Outlet).
  // Se não, navega para a página de login.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;