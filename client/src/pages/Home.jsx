import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, BookOpen, Calendar, Star, Info, Users, GraduationCap } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Set dynamic greeting based on time of day
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // Get user name from local storage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserName(user.name || 'Student');
            } catch (e) {
                setUserName('Student');
            }
        } else {
            setUserName('Guest');
        }
    }, []);

    return (
        <div className="p-6 pb-24 max-w-2xl mx-auto min-h-screen bg-gray-50 flex flex-col gap-6 relative overflow-hidden">
            {/* Background elements for aesthetic */}
            <div className="absolute top-[-5%] left-[-10%] w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-[10%] right-[-10%] w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Header section */}
            <div className="relative z-10 pt-4">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">
                    {greeting},
                </h1>
                <h2 className="text-3xl font-bold text-gray-900 mt-1 capitalize leading-tight">
                    {userName}
                </h2>
                <p className="text-gray-500 mt-2 font-medium">Ready to explore the campus today?</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 relative z-10 mt-2">
                <button onClick={() => navigate('/map')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-blue-200 transition-all group transform hover:-translate-y-1">
                    <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <Map size={28} />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Campus Map</span>
                </button>
                <button onClick={() => navigate('/directory')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-purple-200 transition-all group transform hover:-translate-y-1">
                    <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner">
                        <BookOpen size={28} />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Directory</span>
                </button>
                <button onClick={() => navigate('/events')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-emerald-200 transition-all group transform hover:-translate-y-1">
                    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                        <Calendar size={28} />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Events</span>
                </button>
                <button onClick={() => navigate('/favorites')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-rose-200 transition-all group transform hover:-translate-y-1">
                    <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-inner">
                        <Star size={28} />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Favorites</span>
                </button>
            </div>

            {/* Our Aim Card */}
            <div className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[2rem] p-7 shadow-2xl text-white overflow-hidden mt-4 border border-gray-700">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] scale-150 transform translate-x-4 -translate-y-4">
                    <Info size={180} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-500/20 p-2.5 rounded-xl text-blue-400 border border-blue-500/30">
                            <Info size={22} className="shrink-0" />
                        </div>
                        <h3 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-50 tracking-wide">Our Mission</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed font-medium">
                        To provide a seamless, smart, and interactive digital navigation experience for students, faculty, and visitors. <span className="text-white font-bold">CampusNav</span> bridges the gap between you and your destination effortlessly.
                    </p>
                </div>
            </div>

            {/* Credits Section */}
            <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-[2rem] p-7 shadow-lg border border-gray-100 mt-2">
                <h3 className="font-extrabold text-gray-900 flex items-center gap-3 mb-6 text-lg">
                    <Users size={24} className="text-blue-600" />
                    Project Team Credits
                </h3>

                <div className="space-y-4">
                    {/* Developers */}
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-gray-700 border border-gray-100 shrink-0">
                            <GraduationCap size={24} className="text-indigo-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-2 text-indigo-900">Developers & Creators</h4>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-700 font-semibold">• Imthiyas Ibnu Ibrahim</p>
                                <p className="text-sm text-gray-700 font-semibold">• Brillian</p>
                                <p className="text-sm text-gray-700 font-semibold">• Akhil</p>
                            </div>
                        </div>
                    </div>

                    {/* Faculty Advisor */}
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100 shrink-0">
                            <Star size={24} className="text-blue-600 fill-blue-600" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-blue-900">Faculty Advisor</h4>
                            <p className="text-xs text-blue-600/80 mt-1 font-medium mb-1">Under the expert guidance of</p>
                            <p className="text-base font-extrabold text-blue-700">Liji Dominic</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
