import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Loader2, Heart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Add JWT Token to axios requests
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/users/favorites`, getAuthHeaders());
            // The backend populates the location objects for this endpoint
            setFavorites(response.data);
        } catch (err) {
            setError('Failed to load favorites');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (locationId) => {
        try {
            // Optimistic UI update
            setFavorites(favorites.filter(loc => loc._id !== locationId));
            await axios.post(`${API_URL}/users/favorites/${locationId}`, {}, getAuthHeaders());
        } catch (err) {
            console.error('Failed to remove favorite');
            fetchFavorites(); // Revert on failure
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
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
                    <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                    My Favorites
                </h1>
                <p className="text-gray-500">Your saved classrooms, labs, and offices.</p>
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
                        <p>Loading favorites...</p>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No favorites yet</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">You haven't saved any locations. Tap the heart icon in the Directory to add a location here.</p>
                        <button
                            onClick={() => navigate('/directory')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors"
                        >
                            Browse Directory
                        </button>
                    </div>
                ) : (
                    favorites.map((loc) => (
                        <div
                            key={loc._id}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        {loc.name}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFavorite(loc._id); }}
                                            className="text-red-500 hover:text-gray-400 transition-colors focus:outline-none"
                                            title={"Remove from Favorites"}
                                        >
                                            <Heart className="h-5 w-5 transition-transform fill-red-500 scale-110 hover:scale-100" />
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
