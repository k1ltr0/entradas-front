import React from 'react';

interface TopBarProps {
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogout }) => {
  return (
    <header className="top-bar">
      <button className="icon-button mobile-menu">
        <span>☰</span>
      </button>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search tickets, customers, events..."
        />
      </div>

      <div className="top-bar-actions">
        <button className="icon-button">
          <span>🔔</span>
        </button>
        <button className="icon-button">
          <span>❓</span>
        </button>
        <div className="user-menu" onClick={onLogout}>
          <div className="user-avatar">A</div>
          <span style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;