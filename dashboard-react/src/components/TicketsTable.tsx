import React, { useState, useEffect } from 'react';

interface Ticket {
  id: string;
  payment_status: string;
  status: string;
  price: number;
  category?: string;
  distance?: number;
  purchase_date?: string;
  name?: string;
  email?: string;
  ticket_type?: string;
}

interface Filters {
  status: string;
  category: string;
  distance: string;
}

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

interface TicketsTableProps {
  tickets: Ticket[];
  allTickets: Ticket[];
  loading: boolean;
  onFiltersChange: (filters: Filters) => void;
  onRefresh: () => void;
  onTicketClick: (ticketId: string) => void;
}

const TicketsTable: React.FC<TicketsTableProps> = ({ tickets, allTickets, loading, onFiltersChange, onRefresh, onTicketClick }) => {
  const [filters, setFilters] = useState<Filters>({
    status: '',
    category: '',
    distance: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'purchase_date',
    direction: 'desc'
  });
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const categorySet = new Set(allTickets.map(t => t.category).filter(Boolean));
    const uniqueCategories = Array.from(categorySet) as string[];
    setCategories(uniqueCategories);
  }, [allTickets]);

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSort = (field: string) => {
    const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, direction });
  };

  const getSortedTickets = () => {
    if (!sortConfig.field) return tickets;

    return [...tickets].sort((a, b) => {
      let aValue = (a as any)[sortConfig.field];
      let bValue = (b as any)[sortConfig.field];

      if (sortConfig.field === 'purchase_date') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else if (sortConfig.field === 'price' || sortConfig.field === 'distance') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (sortConfig.field === 'payment_status') {
        const statusPriority = {
          'approved': 0, 'paid': 0,
          'pending': 1,
          'failed': 2, 'rejected': 2,
          'cancelled': 3
        };
        aValue = (statusPriority as any)[aValue] !== undefined ? (statusPriority as any)[aValue] : 4;
        bValue = (statusPriority as any)[bValue] !== undefined ? (statusPriority as any)[bValue] : 4;
      } else {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      }

      if (sortConfig.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const getSortIcon = (field: string) => {
    if (sortConfig.field !== field) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getBadge = (status: string) => {
    const statusMap = {
      'approved': { class: 'success', text: 'Paid' },
      'paid': { class: 'success', text: 'Paid' },
      'pending': { class: 'warning', text: 'Pending' },
      'failed': { class: 'error', text: 'Failed' },
      'rejected': { class: 'error', text: 'Rejected' },
      'cancelled': { class: 'neutral', text: 'Cancelled' }
    };

    const config = (statusMap as any)[status] || { class: 'neutral', text: status || 'Unknown' };
    return (
      <span className={`badge badge-${config.class}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const exportData = () => {
    // Simple CSV export for now
    const csvContent = [
      ['Ticket ID', 'Customer Name', 'Email', 'Category', 'Distance', 'Price', 'Purchase Date', 'Payment Status'],
      ...allTickets.map(ticket => [
        ticket.id || 'N/A',
        ticket.name || 'N/A',
        ticket.email || 'N/A',
        ticket.category || 'N/A',
        ticket.distance ? `${ticket.distance}m` : 'N/A',
        `$${(ticket.price || 0).toFixed(2)}`,
        formatDate(ticket.purchase_date),
        ticket.payment_status || ticket.status || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleTicketClick = (ticketId: string) => {
    onTicketClick(ticketId);
  };

  if (loading) {
    return (
      <div className="data-card">
        <div className="data-card-header">
          <h2 className="data-card-title">Recent Tickets</h2>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading tickets...</p>
        </div>
      </div>
    );
  }

  const sortedTickets = getSortedTickets();

  return (
    <div className="data-card">
      <div className="data-card-header">
        <h2 className="data-card-title">Recent Tickets</h2>
        <div className="data-card-actions">
          <button className="btn btn-secondary" onClick={exportData}>
            <span>↓</span> Export
          </button>
          <button className="btn btn-primary" onClick={onRefresh}>
            <span>↻</span> Refresh
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label className="filter-label">Status:</label>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Distance:</label>
          <select
            className="filter-select"
            value={filters.distance}
            onChange={(e) => handleFilterChange('distance', e.target.value)}
          >
            <option value="">All distances</option>
            <option value="1000">1000m</option>
            <option value="2000">2000m</option>
          </select>
        </div>
      </div>

      {sortedTickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <h3 className="empty-title">No tickets found</h3>
          <p className="empty-description">
            {allTickets.length === 0 ? 'No tickets have been created yet.' : 'Try adjusting your filters to see more results.'}
          </p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th className="sortable-header" onClick={() => handleSort('name')}>
                Customer
                <span className={`sort-indicator ${sortConfig.field === 'name' ? 'active' : ''}`}>
                  {getSortIcon('name')}
                </span>
              </th>
              <th className="sortable-header" onClick={() => handleSort('email')}>
                Email
                <span className={`sort-indicator ${sortConfig.field === 'email' ? 'active' : ''}`}>
                  {getSortIcon('email')}
                </span>
              </th>
              <th className="sortable-header" onClick={() => handleSort('category')}>
                Category
                <span className={`sort-indicator ${sortConfig.field === 'category' ? 'active' : ''}`}>
                  {getSortIcon('category')}
                </span>
              </th>
              <th className="sortable-header" onClick={() => handleSort('distance')}>
                Distance
                <span className={`sort-indicator ${sortConfig.field === 'distance' ? 'active' : ''}`}>
                  {getSortIcon('distance')}
                </span>
              </th>
              <th className="sortable-header" onClick={() => handleSort('price')}>
                Amount
                <span className={`sort-indicator ${sortConfig.field === 'price' ? 'active' : ''}`}>
                  {getSortIcon('price')}
                </span>
              </th>
              <th className="sortable-header" onClick={() => handleSort('purchase_date')}>
                Date
                <span className={`sort-indicator ${sortConfig.field === 'purchase_date' ? 'active' : ''}`}>
                  {getSortIcon('purchase_date')}
                </span>
              </th>
              <th className="sortable-header" onClick={() => handleSort('payment_status')}>
                Payment
                <span className={`sort-indicator ${sortConfig.field === 'payment_status' ? 'active' : ''}`}>
                  {getSortIcon('payment_status')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTickets.map(ticket => (
              <tr
                key={ticket.id}
                onClick={() => handleTicketClick(ticket.id)}
                style={{ cursor: 'pointer' }}
              >
                <td><strong>#{ticket.id ? String(ticket.id).substring(0, 8) : 'N/A'}</strong></td>
                <td>{ticket.name || 'N/A'}</td>
                <td>{ticket.email || 'N/A'}</td>
                <td>{ticket.category || 'N/A'}</td>
                <td>{ticket.distance ? ticket.distance + 'm' : 'N/A'}</td>
                <td><strong>${(ticket.price || 0).toLocaleString('en-US')}</strong></td>
                <td>{formatDate(ticket.purchase_date)}</td>
                <td>{getBadge(ticket.payment_status || ticket.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketsTable;