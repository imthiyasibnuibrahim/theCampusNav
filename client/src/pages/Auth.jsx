import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, User, Building, GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../config';

export default function Auth() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        role: 'student',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Splash Screen Timer
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // 1.5 seconds loading animation
        return () => clearTimeout(timer);
    }, []);

    const handleToggle = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side Validation (only for registration)
        if (!isLogin) {
            const emailLower = formData.email.toLowerCase();
            if (formData.role === 'student') {
                const studentRegex = /^[a-z]?[a-z]{3}\d{2}[a-z]{2}\d{3}@gecskp\.ac\.in$/;
                if (!studentRegex.test(emailLower)) {
                    setError('Invalid Student Email format. Use your 10 or 11-character ID (e.g., pkd23cs028@gecskp.ac.in)');
                    return;
                }
            } else if (formData.role === 'staff') {
                if (!emailLower.endsWith('@gecskp.ac.in')) {
                    setError('Staff must use an official @gecskp.ac.in domain.');
                    return;
                }
            }
        }

        // Determine the endpoint: /auth/login or /auth/register
        const endpoint = isLogin ? '/login' : '/register';
        const url = `${API_URL}/auth${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isLogin
                    ? { email: formData.email, password: formData.password }
                    : { ...formData, role: formData.role.toLowerCase() }
                )
            });

            const data = await response.json();

            if (!response.ok) {
                // Check for MongoDB Timeout Error
                if (response.status === 500 && (data.details?.includes('buffering timed out') || data.message === 'Server error')) {
                    throw new Error('Database connection failed. Please check your MongoDB Atlas Network Access IP Whitelist.');
                }
                throw new Error(data.message || 'Something went wrong');
            }

            if (isLogin) {
                // Save token and user details
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                // Redirect to Home
                navigate('/home');
            } else {
                // Switch to login after successful registration
                setIsLogin(true);
                alert('Registration successful! Please sign in.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // --- 1. SPLASH SCREEN (LOADING) ---
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600 transition-opacity duration-500">
                <div className="animate-bounce mb-6">
                    <div className="bg-white rounded-3xl p-5 shadow-2xl flex items-center justify-center">
                        <Map className="w-14 h-14 text-blue-600" strokeWidth={2.5} />
                    </div>
                </div>
                <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">CampusNav</h1>
                <p className="text-blue-100 uppercase tracking-[0.2em] text-sm font-semibold">Find Your Way</p>
            </div>
        );
    }

    // --- 2. AUTHENTICATION SCREEN ---
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8 relative">
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-10 p-8">

                {/* Logo Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600 rounded-[1.5rem] p-4 shadow-xl shadow-blue-600/20 flex items-center justify-center mb-5">
                        <Map className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-[26px] font-bold text-gray-900 mb-1">CampusNav</h1>
                    <p className="text-gray-500 text-[15px]">Navigate your campus with ease</p>
                </div>

                {/* Form Container */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 outline-none transition-all text-[15px] text-gray-800 placeholder-gray-400"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 outline-none transition-all text-[15px] text-gray-800 appearance-none bg-no-repeat"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                                        required
                                    >
                                        <option value="" disabled>Select Department</option>
                                        <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                                        <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Other / Non-Engineering">Other</option>
                                    </select>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <GraduationCap className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 outline-none transition-all text-[15px] text-gray-800 appearance-none bg-no-repeat"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                                        required
                                    >
                                        <option value="student">Student</option>
                                        <option value="staff">Staff / Faculty</option>
                                        <option value="visitor">Visitor</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder={isLogin ? "Email Address" : (formData.role === 'student' ? 'e.g., pkd23cs028@gecskp.ac.in' : formData.role === 'staff' ? 'e.g., name@gecskp.ac.in' : 'Email Address')}
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 outline-none transition-all text-[15px] text-gray-800 placeholder-gray-400"
                                required
                            />
                        </div>

                        {!isLogin && formData.role === 'student' && (
                            <p className="text-xs text-blue-600 ml-2 mt-1">
                                Students must use their 10-character official ID email.
                            </p>
                        )}
                        {!isLogin && formData.role === 'staff' && (
                            <p className="text-xs text-blue-600 ml-2 mt-1">
                                Staff must use an official @gecskp.ac.in domain.
                            </p>
                        )}

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-12 pr-12 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 outline-none transition-all text-[15px] text-gray-800 placeholder-gray-400"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl shadow-[0_4px_14px_0_rgba(19,102,255,0.39)] hover:shadow-[0_6px_20px_rgba(19,102,255,0.23)] hover:-translate-y-0.5 transition-all mt-6 text-[15px]"
                        >
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <p className="text-gray-500 text-[14px]">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                onClick={handleToggle}
                                className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                {isLogin ? 'Register' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
