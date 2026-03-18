import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, LogOut, Mail, Building, GraduationCap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user info from localStorage (since we stored it on login)
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUserData(JSON.parse(userStr));
            setLoading(false);
        } else {
            // Kick them out if no user data
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Clear auth tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login page
        navigate('/login', { replace: true });

        // Full page reload to clear any lingering React state in memory
        window.location.reload();
    };

    if (loading || !userData) {
        return <div className="p-8 text-center text-gray-500 font-medium">Loading profile...</div>;
    }

    // Determine Role Badge Color
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'staff': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'student': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="p-6 pb-24 max-w-2xl mx-auto min-h-screen bg-gray-50">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-500">Manage your account and preferences.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-6">

                {/* Header Banner */}
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                    <div className="absolute -bottom-10 left-6">
                        <div className="h-20 w-20 bg-white rounded-full p-1.5 shadow-lg border-2 border-white/50">
                            <div className="bg-gray-100 h-full w-full rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="pt-14 px-6 pb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getRoleColor(userData.role)}`}>
                                {userData.role}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <Mail className="h-5 w-5 text-gray-400 mr-4" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Contact Email</p>
                                <p className="text-gray-800 font-medium">{userData.email || 'Email missing - Upgrade account to view'}</p>
                            </div>
                        </div>

                        {(userData.department || userData.role === 'student' || userData.role === 'staff') && (
                            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <Building className="h-5 w-5 text-gray-400 mr-4" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Department / Faculty</p>
                                    <p className="text-gray-800 font-medium capitalize">{userData.department || 'Not Specified'}</p>
                                </div>
                            </div>
                        )}

                        {userData.role === 'admin' && (
                            <div className="flex items-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                <ShieldCheck className="h-5 w-5 text-purple-500 mr-4" />
                                <div>
                                    <p className="text-xs text-purple-700 font-medium uppercase tracking-wider mb-0.5">Admin Privileges</p>
                                    <p className="text-purple-900 font-medium text-sm">You have full access to the Map Director Dashboard.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-2xl transition-colors border border-red-100"
            >
                <LogOut className="h-5 w-5" />
                Sign Out Securely
            </button>
        </div>
    );
}
