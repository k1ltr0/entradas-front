import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './TicketDetail.css';

interface Ticket {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  age?: string | number;
  gender?: string;
  category?: string;
  distance?: number;
  club?: string;
  test_type?: string;
  stage?: string;
  price: number;
  payment_status: string;
  payment_id?: string;
  purchase_date?: string;
  created_at?: string;
  notes?: string;
}

interface ResendEmailModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
}

const ResendEmailModal: React.FC<ResendEmailModalProps> = ({ isOpen, ticket, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isOpen && ticket?.email) {
      setEmail(ticket.email);
    }
  }, [isOpen, ticket]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      setAlert({ type: 'error', message: 'Please enter an email address' });
      return;
    }

    if (!isValidEmail(email)) {
      setAlert({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const token = localStorage.getItem('authToken');
      const tokenType = localStorage.getItem('tokenType') || 'bearer';

      const requestBody = {
        ticket_id: ticket?.id,
        custom_email: email !== ticket?.email ? email : null
      };

      const response = await fetch('https://entradas-back-66181581846.europe-west1.run.app/api/tickets/resend-email', {
        method: 'POST',
        headers: {
          'Authorization': `${tokenType} ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        setAlert({ type: 'success', message: `Email sent successfully to ${email}` });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || 'Failed to send email';
        setAlert({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setAlert(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            <span>📧</span> Resend Ticket Email
          </h2>
          <button type="button" className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {alert && (
            <div className={`alert alert-${alert.type}`}>
              {alert.message}
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="resendEmailInput">Email Address</label>
            <input
              type="email"
              id="resendEmailInput"
              className="form-input"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="form-help">
              A copy of the ticket will be sent to this email address
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
            onClick={handleResendEmail}
            disabled={loading}
          >
            <span>Send Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token || !tokenExpiry || Date.now() >= parseInt(tokenExpiry)) {
      navigate('/login');
      return;
    }

    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    loadTicketDetails(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const loadTicketDetails = async (ticketId: string) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'bearer';

    try {
      const response = await fetch('https://entradas-back-66181581846.europe-west1.run.app/api/tickets', {
        method: 'GET',
        headers: {
          'Authorization': `${tokenType} ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        let allTickets: Ticket[] = [];

        if (Array.isArray(data)) {
          allTickets = data;
        } else if (data && Array.isArray(data.tickets)) {
          allTickets = data.tickets;
        } else if (data && data.data && Array.isArray(data.data)) {
          allTickets = data.data;
        }

        const foundTicket = allTickets.find(t => t.id === ticketId);

        if (foundTicket) {
          setTicket(foundTicket);
        } else {
          setError(true);
        }
      } else if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('tokenExpiry');
        navigate('/login');
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error loading ticket:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getBadgeHTML = (status: string) => {
    const statusMap = {
      'approved': { class: 'success', text: 'Paid' },
      'paid': { class: 'success', text: 'Paid' },
      'pending': { class: 'warning', text: 'Pending' },
      'failed': { class: 'error', text: 'Failed' },
      'rejected': { class: 'error', text: 'Rejected' },
      'cancelled': { class: 'neutral', text: 'Cancelled' }
    };

    const config = (statusMap as any)[status] || { class: 'neutral', text: status || 'Unknown' };
    return <span className={`badge badge-${config.class}`}>{config.text}</span>;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenExpiry');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="app-container ticket-detail">
        <Sidebar />
        <div className="main-wrapper">
          <header className="top-bar">
            <nav className="breadcrumb">
              <button onClick={() => navigate('/dashboard')} className="breadcrumb-item">Dashboard</button>
              <span className="breadcrumb-separator">›</span>
              <button onClick={() => navigate('/dashboard')} className="breadcrumb-item">Tickets</button>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-current">Loading...</span>
            </nav>
            <div className="top-bar-actions">
              <button className="icon-button">
                <span>🔔</span>
              </button>
              <button className="icon-button">
                <span>❓</span>
              </button>
              <div className="user-menu" onClick={logout}>
                <div className="user-avatar">A</div>
                <span style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>
                  Admin
                </span>
              </div>
            </div>
          </header>
          <main className="main-content">
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading ticket details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="app-container ticket-detail">
        <Sidebar />
        <div className="main-wrapper">
          <header className="top-bar">
            <nav className="breadcrumb">
              <button onClick={() => navigate('/dashboard')} className="breadcrumb-item">Dashboard</button>
              <span className="breadcrumb-separator">›</span>
              <button onClick={() => navigate('/dashboard')} className="breadcrumb-item">Tickets</button>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-current">Error</span>
            </nav>
            <div className="top-bar-actions">
              <button className="icon-button">
                <span>🔔</span>
              </button>
              <button className="icon-button">
                <span>❓</span>
              </button>
              <div className="user-menu" onClick={logout}>
                <div className="user-avatar">A</div>
                <span style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>
                  Admin
                </span>
              </div>
            </div>
          </header>
          <main className="main-content">
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3 className="error-title">Ticket not found</h3>
              <p className="error-description">The ticket you're looking for doesn't exist or may have been deleted.</p>
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ marginTop: '16px' }}>
                ← Back to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container ticket-detail">
      <Sidebar />
      <div className="main-wrapper">
        <header className="top-bar">
          <nav className="breadcrumb">
            <button onClick={() => navigate('/dashboard')} className="breadcrumb-item">Dashboard</button>
            <span className="breadcrumb-separator">›</span>
            <button onClick={() => navigate('/dashboard')} className="breadcrumb-item">Tickets</button>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Ticket #{ticket.id}</span>
          </nav>
          <div className="top-bar-actions">
            <button className="icon-button">
              <span>🔔</span>
            </button>
            <button className="icon-button">
              <span>❓</span>
            </button>
            <div className="user-menu" onClick={logout}>
              <div className="user-avatar">A</div>
              <span style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>
                Admin
              </span>
            </div>
          </div>
        </header>

        <main className="main-content">
          {/* Print Header (only visible when printing) */}
          <div className="print-header">
            <div className="print-title">Event Ticketing Platform</div>
            <div className="print-subtitle">Official Ticket Receipt</div>
            <div className="print-ticket-id">#{ticket.id}</div>
          </div>

          <div className="page-header">
            <div className="page-title-section">
              <div className="ticket-id-badge">#{ticket.id}</div>
              <h1 className="page-title">{ticket.name || 'Ticket Details'}</h1>
            </div>
            <div className="page-actions">
              <button className="btn btn-primary" onClick={() => setShowResendModal(true)}>
                <span>📧</span> Resend Email
              </button>
              <button className="btn btn-secondary" onClick={() => window.print()}>
                <span>🖨️</span> Print
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                <span>←</span> Back
              </button>
            </div>
          </div>

          <div className="content-layout">
            <div className="main-section">
              {/* Customer Information */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <span>👤</span> Customer Information
                  </h2>
                </div>
                <div className="card-body">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Full Name</span>
                      <span className="detail-value">{ticket.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{ticket.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{ticket.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Age</span>
                      <span className="detail-value">{ticket.age || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Gender</span>
                      <span className="detail-value">{ticket.gender || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <span>🏊</span> Event Information
                  </h2>
                </div>
                <div className="card-body">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Category</span>
                      <span className="detail-value">{ticket.category || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Distance</span>
                      <span className="detail-value">{ticket.distance ? ticket.distance + ' meters' : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Club</span>
                      <span className="detail-value">{ticket.club || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Test Type</span>
                      <span className="detail-value">{ticket.test_type || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Stage</span>
                      <span className="detail-value">{ticket.stage || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              {/* Payment Information */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <span>💳</span> Payment
                  </h2>
                </div>
                <div className="card-body">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Amount</span>
                      <span className="detail-value highlight">${(ticket.price || 0).toLocaleString('en-US')}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className="detail-value">{getBadgeHTML(ticket.payment_status)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment ID</span>
                      <span className="detail-value">
                        {ticket.payment_id
                          ? `${ticket.payment_id.substring(0, 12)}${ticket.payment_id.length > 12 ? '...' : ''}`
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <span>📅</span> Timeline
                  </h2>
                </div>
                <div className="card-body">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Purchase Date</span>
                      <span className="detail-value">{formatDate(ticket.purchase_date)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Created</span>
                      <span className="detail-value">{formatDate(ticket.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section (conditional) */}
          {ticket.notes && (
            <div className="notes-section">
              <div className="notes-title">
                <span>📝</span> Additional Notes
              </div>
              <div className="notes-content">
                {ticket.notes}
              </div>
            </div>
          )}

          {/* Print Footer (only visible when printing) */}
          <div className="print-footer">
            <div>This ticket is valid for the event specified above.</div>
            <div>Generated on {formatDate(new Date().toISOString())}</div>
            <div>© Event Ticketing Platform - All Rights Reserved</div>
          </div>
        </main>
      </div>

      <ResendEmailModal
        isOpen={showResendModal}
        ticket={ticket}
        onClose={() => setShowResendModal(false)}
      />
    </div>
  );
};

export default TicketDetail;