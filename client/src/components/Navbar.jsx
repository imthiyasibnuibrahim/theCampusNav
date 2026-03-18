import { NavLink } from 'react-router-dom';
import { Home, Map, BookOpen, Calendar, Heart, User } from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Map', icon: Map, path: '/map' },
    { name: 'Directory', icon: BookOpen, path: '/directory' },
    { name: 'Events', icon: Calendar, path: '/events' },
    { name: 'Favorites', icon: Heart, path: '/favorites' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
