
import React, { useState } from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery, onSearch, isLoading }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What product are you looking for?"
        className="w-full pl-5 pr-14 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-main-accent focus:ring-2 focus:ring-main-accent/50 transition-all duration-300 shadow-sm hover:shadow-md"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center justify-center w-14 h-full text-white bg-main-accent rounded-r-full hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        disabled={isLoading}
      >
        <SearchIcon className="w-6 h-6" />
      </button>
    </form>
  );
};

export default SearchBar;