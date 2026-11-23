import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RotaPrivada({ perfis }) {
  const { estaLogado, usuario } = useAuth();

  if (!estaLogado) {
    return <Navigate to="/login" replace />;
  }

  if (perfis && !perfis.includes(usuario.perfil)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
