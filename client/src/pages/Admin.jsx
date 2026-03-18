import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, MapPin, Calendar, CheckCircle2, ShieldAlert, List, Edit, Trash2, X } from 'lucide-react';
import { API_URL } from '../config';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('manage_events');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);

  // Get User ID from localStorage to set as creator
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Check Admin Access
  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  // State for Event Creation
  const [eventData, setEventData] = useState({ title: '', description: '', date: '', locationId: '' });

  // State for Location Creation
  const [locationData, setLocationData] = useState({ name: '', description: '', mappedinPolygonId: '', category: 'classroom' });

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to load events', err);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/locations`);
      setLocations(response.data);
    } catch (err) {
      console.error('Failed to load locations', err);
    }
  };

  useEffect(() => {
    fetchLocations(); // Always fetch locations for the dropdown
    if (activeTab === 'manage_events') {
      fetchEvents();
    }
  }, [activeTab]);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      if (editingEventId) {
        await axios.put(`${API_URL}/events/${editingEventId}`, eventData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSuccessMsg('Event updated successfully!');
        setEditingEventId(null);
      } else {
        const payload = {
          ...eventData,
          createdBy: user?.id || '000000000000000000000000' // Fail-safe
        };
        await axios.post(`${API_URL}/events`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSuccessMsg('Event created successfully!');
      }
      setEventData({ title: '', description: '', date: '', locationId: '' });
      fetchEvents();
      if (editingEventId) setActiveTab('manage_events');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save event. Ensure Location ID is valid.');
    }
  };

  const handleEditEvent = (evt) => {
    setEditingEventId(evt._id);
    setEventData({
      title: evt.title,
      description: evt.description,
      // Format date for datetime-local input
      date: new Date(evt.date).toISOString().slice(0, 16),
      locationId: evt.locationId?._id || evt.locationId || ''
    });
    setActiveTab('event');
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await axios.delete(`${API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccessMsg('Event deleted successfully!');
      fetchEvents();
    } catch (err) {
      setErrorMsg('Failed to delete event.');
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await axios.post(`${API_URL}/locations`, locationData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccessMsg(`Location "${locationData.name}" created successfully!`);
      setLocationData({ name: '', description: '', mappedinPolygonId: '', category: 'classroom' });
    } catch (err) {
      setErrorMsg('Failed to create location.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 max-w-sm">You must be logged in as Staff or an Administrator to view and edit campus data.</p>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">Manage campus locations and upcoming events.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-200/60 p-1.5 rounded-2xl mb-8 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('manage_events'); setSuccessMsg(''); setErrorMsg(''); setEditingEventId(null); setEventData({ title: '', description: '', date: '', locationId: '' }); }}
          className={`shrink-0 px-4 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'manage_events' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <List className="w-4 h-4" /> Manage Events
        </button>
        <button
          onClick={() => { setActiveTab('event'); setSuccessMsg(''); setErrorMsg(''); }}
          className={`shrink-0 px-4 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'event' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Calendar className="w-4 h-4" /> {editingEventId ? 'Edit Event' : 'Add Event'}
        </button>
        <button
          onClick={() => { setActiveTab('location'); setSuccessMsg(''); setErrorMsg(''); }}
          className={`shrink-0 px-4 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'location' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <MapPin className="w-4 h-4" /> Add Location
        </button>
      </div>

      {/* Status Messages */}
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6 text-sm font-medium border border-emerald-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> {errorMsg}
        </div>
      )}

      {/* Forms Container */}
      <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

        {/* MANAGE EVENTS LIST */}
        {activeTab === 'manage_events' && (
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No events found.</p>
            ) : (
              events.map(evt => (
                <div key={evt._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-100 rounded-xl bg-gray-50 gap-4 hover:shadow-sm transition-shadow">
                  <div>
                    <h3 className="font-bold text-gray-800">{evt.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(evt.date).toLocaleDateString()} at {new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-4 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                    <button onClick={() => handleEditEvent(evt)} className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors" title="Edit Event">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteEvent(evt._id)} className="p-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors" title="Delete Event">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ADD / EDIT EVENT FORM */}
        {activeTab === 'event' && (
          <form onSubmit={handleEventSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="e.g., Tech Symposium 2026"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                rows="3"
                placeholder="Describe the event details..."
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-sm"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Location</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-sm appearance-none bg-no-repeat"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                  value={eventData.locationId}
                  onChange={(e) => setEventData({ ...eventData, locationId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a mapped location...</option>
                  {locations.map(loc => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Don't see it? Add it in the "Add Location" tab first.</p>
              </div>
            </div>

            <button type="submit" className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(19,102,255,0.39)] transition-all mt-4 text-sm mt-8">
              {editingEventId ? <Edit className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
              {editingEventId ? 'Update Event' : 'Publish Event'}
            </button>
            {editingEventId && (
              <button
                type="button"
                onClick={() => { setEditingEventId(null); setActiveTab('manage_events'); setEventData({ title: '', description: '', date: '', locationId: '' }); }}
                className="w-full flex justify-center items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 rounded-xl transition-all mt-4 text-sm"
              >
                <X className="w-5 h-5" /> Cancel Edit
              </button>
            )}
          </form>
        )}


        {/* ADD LOCATION FORM */}
        {activeTab === 'location' && (
          <form onSubmit={handleLocationSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="e.g., Computer Science Lab A"
                value={locationData.name}
                onChange={(e) => setLocationData({ ...locationData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                rows="2"
                placeholder="What is this location used for?"
                value={locationData.description}
                onChange={(e) => setLocationData({ ...locationData, description: e.target.value })}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-sm appearance-none"
                  value={locationData.category}
                  onChange={(e) => setLocationData({ ...locationData, category: e.target.value })}
                  required
                >
                  <option value="classroom">Classroom</option>
                  <option value="lab">Lab</option>
                  <option value="office">Office</option>
                  <option value="facility">Facility</option>
                  <option value="amenity">Amenity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mappedin Polygon ID</label>
                <input
                  type="text"
                  placeholder="e.g., polygon-293"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-sm text-gray-600 font-mono"
                  value={locationData.mappedinPolygonId}
                  onChange={(e) => setLocationData({ ...locationData, mappedinPolygonId: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-black text-white font-medium py-3.5 rounded-xl shadow-lg transition-all mt-4 text-sm mt-8">
              <PlusCircle className="w-5 h-5" /> Save Location
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
