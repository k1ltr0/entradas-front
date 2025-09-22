import React from 'react';

interface Stats {
  totalTickets: number;
  paidTickets: number;
  pendingTickets: number;
  totalRevenue: number;
}

interface StatsGridProps {
  stats: Stats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">Total Sales</span>
          <span className="stat-change positive">↑ 12.5%</span>
        </div>
        <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
        <div className="stat-comparison">vs. last period</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">Total Tickets</span>
          <span className="stat-change positive">↑ 8.3%</span>
        </div>
        <div className="stat-value">{stats.totalTickets.toLocaleString()}</div>
        <div className="stat-comparison">all time</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">Paid Tickets</span>
          <span className="stat-change positive">↑ 15.2%</span>
        </div>
        <div className="stat-value">{stats.paidTickets.toLocaleString()}</div>
        <div className="stat-comparison">successfully processed</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">Pending</span>
          <span className="stat-change negative">↓ 3.1%</span>
        </div>
        <div className="stat-value">{stats.pendingTickets.toLocaleString()}</div>
        <div className="stat-comparison">awaiting payment</div>
      </div>
    </div>
  );
};

export default StatsGrid;