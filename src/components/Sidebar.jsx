import React, { useState } from 'react';

function Sidebar({ 
    isOpen, 
    toggleSidebar, 
    searchQuery, 
    setSearchQuery, 
    handleSearch, 
    handleMyLocation, 
    startLocation, 
    setStartLocation, 
    endLocation, 
    setEndLocation, 
    handleGetDirections, 
    recentSearches, 
    onSearch 
}) {
    const [isRecentOpen, setRecentOpen] = useState(false);

    return (
        <>
            <button className={`sidebar-toggle ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
                {isOpen ? '‹' : '›'}
            </button>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                    <h2>Map Controls</h2>
                    
                    <div className="control-group">
                        <h3>Location Search</h3>
                        <input
                            type="text"
                            placeholder="Search for a location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch}>Search</button>
                        <button onClick={handleMyLocation}>My Location</button>
                    </div>

                    <div className="control-group">
                        <h3>Get Directions</h3>
                        <input 
                            type="text" 
                            placeholder="Start location" 
                            value={startLocation} 
                            onChange={(e) => setStartLocation(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="End location" 
                            value={endLocation} 
                            onChange={(e) => setEndLocation(e.target.value)} 
                        />
                        <button onClick={handleGetDirections}>Get Directions</button>
                    </div>

                    {recentSearches && recentSearches.length > 0 && (
                        <div className="sidebar-section">
                            <h3 onClick={() => setRecentOpen(!isRecentOpen)} className="collapsible-header">
                                Recent Searches
                                <span className={`arrow ${isRecentOpen ? 'open' : ''}`}>▼</span>
                            </h3>
                            {isRecentOpen && (
                                <ul className="recent-searches-list">
                                    {recentSearches.map((search, index) => (
                                        <li key={index} onClick={() => onSearch(search)}>
                                            {search}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Sidebar;
