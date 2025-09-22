import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenExpiry');
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <TopBar onLogout={logout} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;