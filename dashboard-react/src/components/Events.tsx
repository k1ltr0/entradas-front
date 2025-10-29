import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './Events.css';

interface Event {
  id: string;
  title: string;
  description: string;
  venues: Venue[];
  created_at: string;
  updated_at: string;
}

interface Venue {
  id?: string;
  event_id?: string;
  name: string;
  venue_type: string;
  location: string;
  schedules: Schedule[];
}

interface Schedule {
  id?: string;
  venue_id?: string;
  start_datetime: string;
  end_datetime?: string;
}

interface EventCreateForm {
  title: string;
  description: string;
}

interface VenueCreateForm {
  name: string;
  venue_type: string;
  location: string;
  schedules: Schedule[];
}

const Events: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showVenueModal, setShowVenueModal] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventForm, setEventForm] = useState<EventCreateForm>({
    title: '',
    description: ''
  });
  const [venueForm, setVenueForm] = useState<VenueCreateForm>({
    name: '',
    venue_type: 'physical',
    location: '',
    schedules: []
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token || !tokenExpiry || Date.now() >= parseInt(tokenExpiry)) {
      navigate('/login');
      return;
    }

    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const loadEvents = async () => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'bearer';

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
        method: 'GET',
        headers: {
          'Authorization': `${tokenType} ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } else if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('tokenExpiry');
        navigate('/login');
      } else {
        throw new Error(`Error ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'bearer';

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Authorization': `${tokenType} ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventForm)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setEventForm({ title: '', description: '' });
        loadEvents();
      } else {
        throw new Error(`Error ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }
  };

  const handleAddVenue = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'bearer';

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${selectedEventId}/venues`, {
        method: 'POST',
        headers: {
          'Authorization': `${tokenType} ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: venueForm.name,
          venue_type: venueForm.venue_type,
          location: venueForm.location
        })
      });

      if (response.ok) {
        setShowVenueModal(false);
        setVenueForm({ name: '', venue_type: 'physical', location: '', schedules: [] });
        setSelectedEventId('');
        loadEvents();
      } else {
        throw new Error(`Error ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding venue:', error);
      alert('Error adding venue');
    }
  };

  const addScheduleToVenue = () => {
    setVenueForm({
      ...venueForm,
      schedules: [...venueForm.schedules, { start_datetime: '', end_datetime: '' }]
    });
  };

  const updateSchedule = (index: number, field: keyof Schedule, value: string) => {
    const updatedSchedules = venueForm.schedules.map((schedule, i) =>
      i === index ? { ...schedule, [field]: value } : schedule
    );
    setVenueForm({ ...venueForm, schedules: updatedSchedules });
  };

  const removeSchedule = (index: number) => {
    const updatedSchedules = venueForm.schedules.filter((_, i) => i !== index);
    setVenueForm({ ...venueForm, schedules: updatedSchedules });
  };

  return (
    <Layout>
      <div className="events-container">
        <div className="page-header">
          <h1 className="page-title">Events</h1>
          <p className="page-description">Manage your events, venues, and schedules</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Event
          </button>
        </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : (
        <div className="events-grid">
          {events.length === 0 ? (
            <div className="empty-state">
              <h3>No events yet</h3>
              <p>Create your first event to get started</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <span className="event-date">
                    {new Date(event.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="event-description">{event.description}</p>

                <div className="event-venues">
                  <h4>Venues ({event.venues?.length || 0})</h4>
                  {event.venues?.map((venue) => (
                    <div key={venue.id} className="venue-item">
                      <div className="venue-info">
                        <span className="venue-name">{venue.name}</span>
                        <span className="venue-type">{venue.venue_type}</span>
                      </div>
                      <div className="venue-location">{venue.location}</div>
                      {venue.schedules?.length > 0 && (
                        <div className="schedules">
                          {venue.schedules.map((schedule, idx) => (
                            <div key={idx} className="schedule-item">
                              <span>
                                {new Date(schedule.start_datetime).toLocaleString()}
                                {schedule.end_datetime &&
                                  ` - ${new Date(schedule.end_datetime).toLocaleString()}`
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedEventId(event.id);
                    setShowVenueModal(true);
                  }}
                >
                  Add Venue
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Event</h2>
              <button
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="modal-body">
              <div className="form-group">
                <label htmlFor="title">Event Title</label>
                <input
                  type="text"
                  id="title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Venue Modal */}
      {showVenueModal && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h2>Add Venue</h2>
              <button
                className="btn-close"
                onClick={() => setShowVenueModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddVenue} className="modal-body">
              <div className="form-group">
                <label htmlFor="venue-name">Venue Name</label>
                <input
                  type="text"
                  id="venue-name"
                  value={venueForm.name}
                  onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="venue-type">Venue Type</label>
                <select
                  id="venue-type"
                  value={venueForm.venue_type}
                  onChange={(e) => setVenueForm({ ...venueForm, venue_type: e.target.value })}
                  required
                >
                  <option value="physical">Physical</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="venue-location">Location</label>
                <input
                  type="text"
                  id="venue-location"
                  value={venueForm.location}
                  onChange={(e) => setVenueForm({ ...venueForm, location: e.target.value })}
                  placeholder={venueForm.venue_type === 'virtual' ? 'Meeting URL' : 'Physical address'}
                  required
                />
              </div>

              <div className="schedules-section">
                <div className="schedules-header">
                  <h3>Schedules</h3>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={addScheduleToVenue}
                  >
                    Add Schedule
                  </button>
                </div>

                {venueForm.schedules.map((schedule, index) => (
                  <div key={index} className="schedule-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date & Time</label>
                        <input
                          type="datetime-local"
                          value={schedule.start_datetime}
                          onChange={(e) => updateSchedule(index, 'start_datetime', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date & Time (Optional)</label>
                        <input
                          type="datetime-local"
                          value={schedule.end_datetime || ''}
                          onChange={(e) => updateSchedule(index, 'end_datetime', e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeSchedule(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowVenueModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Venue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
};

export default Events;