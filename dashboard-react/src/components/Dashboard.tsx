import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import StatsGrid from './StatsGrid';
import TicketsTable from './TicketsTable';
import TicketDetailModal from './TicketDetailModal';
import './Dashboard.css';

interface Ticket {
  id: string;
  payment_status: string;
  status: string;
  price: number;
  category?: string;
  distance?: number;
}

interface Stats {
  totalTickets: number;
  paidTickets: number;
  pendingTickets: number;
  totalRevenue: number;
}

interface Filters {
  status?: string;
  category?: string;
  distance?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Stats>({
    totalTickets: 0,
    paidTickets: 0,
    pendingTickets: 0,
    totalRevenue: 0
  });

  // Get ticket ID from URL params
  const selectedTicketId = searchParams.get('ticket');
  const showTicketModal = !!selectedTicketId;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token || !tokenExpiry || Date.now() >= parseInt(tokenExpiry)) {
      navigate('/login');
      return;
    }

    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle URL changes for ticket modal
  useEffect(() => {
    const ticketParam = searchParams.get('ticket');
    if (ticketParam && tickets.length > 0) {
      // Verify the ticket exists in our data
      const ticketExists = tickets.some(t => t.id === ticketParam);
      if (!ticketExists) {
        // Remove invalid ticket parameter
        setSearchParams({});
      }
    }
  }, [searchParams, tickets, setSearchParams]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // The URL change is already handled by React Router and useSearchParams
      // This effect is just for any additional cleanup if needed
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const loadTickets = async () => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'bearer';

    setLoading(true);

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
        let ticketsData = [];

        if (Array.isArray(data)) {
          ticketsData = data;
        } else if (data && Array.isArray(data.tickets)) {
          ticketsData = data.tickets;
        } else if (data && data.data && Array.isArray(data.data)) {
          ticketsData = data.data;
        }

        setTickets(ticketsData);
        setFilteredTickets(ticketsData);
        updateStats(ticketsData);
      } else if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('tokenExpiry');
        navigate('/login');
      } else {
        throw new Error(`Error ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (ticketsData: Ticket[]) => {
    const totalTickets = ticketsData.length;
    const paidTickets = ticketsData.filter(t =>
      t.payment_status === 'approved' || t.status === 'paid'
    ).length;
    const pendingTickets = ticketsData.filter(t =>
      t.payment_status === 'pending' || t.status === 'pending'
    ).length;
    const totalRevenue = ticketsData
      .filter(t => t.payment_status === 'approved' || t.status === 'paid')
      .reduce((sum, t) => sum + (t.price || 0), 0);

    setStats({
      totalTickets,
      paidTickets,
      pendingTickets,
      totalRevenue
    });
  };

  const handleFiltersChange = (filters: Filters) => {
    const filtered = tickets.filter(ticket => {
      const statusMatch = !filters.status ||
        ticket.status === filters.status ||
        ticket.payment_status === filters.status;
      const categoryMatch = !filters.category || ticket.category === filters.category;
      const distanceMatch = !filters.distance || ticket.distance === parseInt(filters.distance);

      return statusMatch && categoryMatch && distanceMatch;
    });

    setFilteredTickets(filtered);
  };


  const handleTicketClick = (ticketId: string) => {
    // Update URL with ticket parameter and add to browser history
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('ticket', ticketId);
    setSearchParams(currentParams, { replace: false });
  };

  const handleCloseModal = () => {
    // Remove ticket parameter from URL and maintain browser history
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete('ticket');
    setSearchParams(currentParams, { replace: false });
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Overview of your ticket sales and event performance</p>
      </div>

      <StatsGrid stats={stats} />

      <TicketsTable
        tickets={filteredTickets}
        allTickets={tickets}
        loading={loading}
        onFiltersChange={handleFiltersChange}
        onRefresh={loadTickets}
        onTicketClick={handleTicketClick}
      />

      <TicketDetailModal
        isOpen={showTicketModal}
        ticketId={selectedTicketId}
        onClose={handleCloseModal}
      />
    </Layout>
  );
};

export default Dashboard;