import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Loader2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Directory() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [favorites, setFavorites] = useState([]); // Store array of favorite location IDs
    const navigate = useNavigate();

    // Add JWT Token to axios requests
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        fetchLocations();
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`${API_URL}/users/favorites`, getAuthHeaders());
            // response.data could be an array of objects or IDs depending on population, let's store just the IDs for easy checking
            const favIds = response.data.map(fav => fav._id || fav);
            setFavorites(favIds);
        } catch (err) {
            console.error('Failed to load favorites');
        }
    };

    const toggleFavorite = async (locationId) => {
        try {
            // Optimistic UI update
            if (favorites.includes(locationId)) {
                setFavorites(favorites.filter(id => id !== locationId));
            } else {
                setFavorites([...favorites, locationId]);
            }

            const response = await axios.post(`${API_URL}/users/favorites/${locationId}`, {}, getAuthHeaders());
            // Sync with server state
            setFavorites(response.data.favorites);
        } catch (err) {
            console.error('Failed to toggle favorite');
            // Revert on failure by re-fetching
            fetchFavorites();
        }
    };

    const fetchLocations = async (query = '') => {
        try {
            setLoading(true);
            setError('');
            // Use the search endpoint if there is a query, otherwise get all
            const url = query
                ? `${API_URL}/locations/search?q=${query}`
                : `${API_URL}/locations`;

            const response = await axios.get(url);
            setLocations(response.data);
        } catch (err) {
            setError('Failed to load campus directory. Is the backend running?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        // Debounce or filter locally/remotely based on preference
        // Here we will just fetch remotely for demonstration
        if (value.length > 2 || value.length === 0) {
            fetchLocations(value);
        }
    };

    // Helper function for category colors
    const getCategoryColor = (category) => {
        switch (category) {
            case 'classroom': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'lab': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'office': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'facility': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="p-6 pb-24 max-w-2xl mx-auto min-h-screen bg-gray-50">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Campus Directory</h1>
                <p className="text-gray-500">Find classrooms, labs, and offices instantly.</p>
            </div>

            {/* Directory Search Bar */}
            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by name, category, or description..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                />
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            {/* Location List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
                        <p>Loading directory...</p>
                    </div>
                ) : locations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No locations found</h3>
                        <p className="text-gray-500 text-sm mt-1">Try searching for something else like "Lab" or "Office".</p>
                    </div>
                ) : (
                    locations.map((loc) => (
                        <div
                            key={loc._id}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        {loc.name}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(loc._id); }}
                                            className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                                            title={favorites.includes(loc._id) ? "Remove from Favorites" : "Add to Favorites"}
                                        >
                                            <Heart
                                                className={`h-5 w-5 transition-transform ${favorites.includes(loc._id) ? 'fill-red-500 text-red-500 scale-110' : 'scale-100'}`}
                                            />
                                        </button>
                                    </h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getCategoryColor(loc.category)}`}>
                                        {loc.category}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm">{loc.description}</p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 font-mono">
                                    <MapPin className="h-3 w-3" />
                                    ID: {loc.mappedinPolygonId}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (loc.mappedinPolygonId) {
                                        navigate(`/map?location=${loc.mappedinPolygonId}`);
                                    } else {
                                        alert("This location does not have a map ID assigned yet.");
                                    }
                                }}
                                className="shrink-0 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-xl text-sm transition-colors"
                            >
                                View on Map
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
