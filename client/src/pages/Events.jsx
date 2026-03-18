import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, MapPin, Clock, Loader2, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Get current user role from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user?.role === 'admin' || user?.role === 'staff';

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/events`);
            setEvents(response.data);
        } catch (err) {
            setError('Failed to load events. Is the backend running?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="p-6 pb-24 max-w-2xl mx-auto min-h-screen bg-gray-50">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Campus Events</h1>
                    <p className="text-gray-500">Discover what's happening around you.</p>
                </div>

                {isAdmin && (
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-colors font-medium text-sm"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add Event
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            {/* Events List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
                        <p>Loading events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No events upcoming</h3>
                        <p className="text-gray-500 text-sm mt-1">Check back later for new activities!</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div
                            key={event._id}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5"
                        >
                            {/* Date Box */}
                            <div className="shrink-0 bg-blue-50 rounded-xl p-3 flex flex-col items-center justify-center w-20 h-20 text-blue-700 text-center mx-auto sm:mx-0">
                                <span className="text-xs font-bold uppercase tracking-wider">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                <span className="text-2xl font-black">{new Date(event.date).getDate()}</span>
                            </div>

                            {/* Event Details */}
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{event.title}</h3>
                                <p className="text-gray-500 text-sm mb-3">{event.description}</p>

                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                                        {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </div>

                                    {event.locationId && (
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                                            onClick={() => {
                                                if (event.locationId.mappedinPolygonId) {
                                                    navigate(`/map?location=${event.locationId.mappedinPolygonId}`);
                                                } else {
                                                    alert("This event's location does not have a map ID assigned yet.");
                                                }
                                            }}
                                        >
                                            <MapPin className="h-3.5 w-3.5 text-rose-500" />
                                            {event.locationId.name || 'Campus Location'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
