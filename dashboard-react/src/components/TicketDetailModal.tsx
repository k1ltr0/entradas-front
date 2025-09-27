import React, { useState, useEffect } from 'react';
import './TicketDetailModal.css';

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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/resend-email`, {
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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-dialog">
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

interface TicketDetailModalProps {
  isOpen: boolean;
  ticketId: string | null;
  onClose: () => void;
}

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ isOpen, ticketId, onClose }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);

  useEffect(() => {
    if (isOpen && ticketId) {
      loadTicketDetails(ticketId);
    }
  }, [isOpen, ticketId]);

  const loadTicketDetails = async (ticketId: string) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'bearer';

    setLoading(true);
    setError(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
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

  const handleClose = () => {
    setTicket(null);
    setError(false);
    setShowResendModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`ticket-modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleClose}>
        <div className={`ticket-modal ${isOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="ticket-modal-header">
            <div className="ticket-modal-title">
              {ticket ? (
                <>
                  <div className="ticket-id-badge">#{ticket.id}</div>
                  <h2>{ticket.name || 'Ticket Details'}</h2>
                </>
              ) : (
                <h2>Ticket Details</h2>
              )}
            </div>
            <div className="ticket-modal-actions">
              {ticket && (
                <>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowResendModal(true)}>
                    <span>📧</span> Resend Email
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                    <span>🖨️</span> Print
                  </button>
                </>
              )}
              <button className="modal-close-btn" onClick={handleClose}>
                ×
              </button>
            </div>
          </div>

          <div className="ticket-modal-body">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading ticket details...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h3 className="error-title">Ticket not found</h3>
                <p className="error-description">The ticket you're looking for doesn't exist or may have been deleted.</p>
              </div>
            )}

            {ticket && (
              <div className="content-layout">
                <div className="main-section">
                  {/* Customer Information */}
                  <div className="info-card">
                    <div className="info-card-header">
                      <h3 className="info-card-title">
                        <span>👤</span> Customer Information
                      </h3>
                    </div>
                    <div className="info-card-body">
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
                  <div className="info-card">
                    <div className="info-card-header">
                      <h3 className="info-card-title">
                        <span>🏊</span> Event Information
                      </h3>
                    </div>
                    <div className="info-card-body">
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
                  <div className="info-card">
                    <div className="info-card-header">
                      <h3 className="info-card-title">
                        <span>💳</span> Payment
                      </h3>
                    </div>
                    <div className="info-card-body">
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
                  <div className="info-card">
                    <div className="info-card-header">
                      <h3 className="info-card-title">
                        <span>📅</span> Timeline
                      </h3>
                    </div>
                    <div className="info-card-body">
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
            )}

            {/* Notes Section (conditional) */}
            {ticket?.notes && (
              <div className="notes-section">
                <div className="notes-title">
                  <span>📝</span> Additional Notes
                </div>
                <div className="notes-content">
                  {ticket.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ResendEmailModal
        isOpen={showResendModal}
        ticket={ticket}
        onClose={() => setShowResendModal(false)}
      />
    </>
  );
};

export default TicketDetailModal;