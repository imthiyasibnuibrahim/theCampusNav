import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <form onSubmit={handleSubmit} className="relative shadow-lg rounded-full overflow-hidden bg-white/90 backdrop-blur-md border border-gray-200">
        <div className="flex items-center px-4 py-3">
          <Search className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search classrooms, labs, events..."
            className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            Find
          </button>
        </div>
      </form>
    </div>
  );
}
