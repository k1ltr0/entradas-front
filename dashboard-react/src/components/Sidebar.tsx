import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (section: string) => {
    if (section === 'dashboard') {
      navigate('/dashboard');
    } else if (section === 'events') {
      navigate('/events');
    } else if (section === 'site-builder') {
      navigate('/site-builder');
    } else if (section === 'disabled') {
      // Do nothing for disabled items
      return;
    } else {
      alert(`${section} section coming soon!`);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="store-switcher">
          <div className="store-icon">ET</div>
          <div className="store-info">
            <div className="store-name">Event Tickets</div>
            <div className="store-url">Platform Admin</div>
          </div>
        </div>
      </div>

      <nav className="nav-menu">
        <div
          className="nav-item disabled"
          onClick={() => handleNavClick('disabled')}
        >
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Sales</div>
          <div
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <span className="nav-icon">🎫</span>
            <span>Tickets</span>
          </div>
          <div
            className="nav-item disabled"
            onClick={() => handleNavClick('disabled')}
          >
            <span className="nav-icon">📊</span>
            <span>Analytics</span>
          </div>
          <div
            className="nav-item disabled"
            onClick={() => handleNavClick('disabled')}
          >
            <span className="nav-icon">👥</span>
            <span>Customers</span>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Content</div>
          <div
            className={`nav-item ${location.pathname === '/events' ? 'active' : ''}`}
            onClick={() => handleNavClick('events')}
          >
            <span className="nav-icon">📅</span>
            <span>Events</span>
          </div>
          <div
            className={`nav-item ${location.pathname === '/site-builder' ? 'active' : ''}`}
            onClick={() => handleNavClick('site-builder')}
          >
            <span className="nav-icon">🎨</span>
            <span>Site Builder</span>
          </div>
          <div
            className="nav-item disabled"
            onClick={() => handleNavClick('disabled')}
          >
            <span className="nav-icon">📢</span>
            <span>Marketing</span>
          </div>
          <div
            className="nav-item disabled"
            onClick={() => handleNavClick('disabled')}
          >
            <span className="nav-icon">💸</span>
            <span>Discounts</span>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Settings</div>
          <div
            className="nav-item disabled"
            onClick={() => handleNavClick('disabled')}
          >
            <span className="nav-icon">⚙️</span>
            <span>General</span>
          </div>
          <div
            className="nav-item disabled"
            onClick={() => handleNavClick('disabled')}
          >
            <span className="nav-icon">💳</span>
            <span>Payments</span>
          </div>
          <div
            className="nav-item disabled"
            onClick={() => handleNavClick('disabled')}
          >
            <span className="nav-icon">🔔</span>
            <span>Notifications</span>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
