import React, { useState, useEffect, useCallback } from 'react';
import Spinner from './components/Spinner';
import LaunchCard from './components/LaunchCard'; 
import './App.css';
import { fetchLaunches } from './apiService'; 

const App = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const [sortOption, setSortOption] = useState('');

  const loadLaunches = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLaunches(page, 10); 
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setLaunches((prev) => [...prev, ...data]);
      }
    } catch (error) {
      console.error('Failed to load launches:', error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    loadLaunches();
  }, [loadLaunches]);

  useEffect(() => {
    let filtered = [...launches];

    if (query) {
      filtered = filtered.filter((launch) =>
        launch.mission_name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sortOption === 'date') {
      filtered.sort((a, b) => new Date(b.launch_date_utc) - new Date(a.launch_date_utc));
    } else if (sortOption === 'name') {
      filtered.sort((a, b) => a.mission_name.localeCompare(b.mission_name));
    } else if (sortOption === 'status') {
      filtered.sort((a, b) => {
        if (b.launch_success === a.launch_success) return 0;
        return b.launch_success ? -1 : 1;
      });
    }

    setFilteredLaunches(filtered);
  }, [launches, query, sortOption]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="App">
      <div className='filter-container'>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleSearch}
          className="search-box"
        />
        
        <div className="filter-sort">
          <select onChange={handleSort}>
            <option value="">Sort by</option>
            <option value="date">Launch Date</option>
            <option value="name">Mission Name</option>
            <option value="status">Launch Status</option>
          </select>
        </div>
      </div>
      <div className="launches">
        {filteredLaunches.map((launch) => (
          <LaunchCard key={launch.flight_number} launch={launch} />
        ))}
        {query && filteredLaunches.length === 0 && !loading && (
          <p className="no-results">No results found for "{query}".</p>
        )}
      </div>
      
      {loading && <Spinner />}
      {!hasMore && !loading && <p className="end-of-list">No more launches to show.</p>}
    </div>
  );
};

export default App;
