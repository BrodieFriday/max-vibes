import { useState, useEffect } from 'react';
import MapComponent from './components/Map';
import Sidebar from './components/Sidebar';
import 'leaflet/dist/leaflet.css';
import './App.css';
import './components/Sidebar.css';

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [position, setPosition] = useState([51.505, -0.09]);
    const [markerInfo, setMarkerInfo] = useState(null);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [waypoints, setWaypoints] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }, [recentSearches]);

    const geocodeAddress = async (address) => {
        if (!address) return null;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
        const data = await response.json();
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            return [parseFloat(lat), parseFloat(lon)];
        }
        return null;
    };

    const handleSearch = async () => {
        const newPosition = await geocodeAddress(searchQuery);
        if (newPosition) {
            setPosition(newPosition);
            setMarkerInfo({ position: newPosition, name: searchQuery });

            // Add to recent searches
            setRecentSearches(prevSearches => {
                const newSearches = [searchQuery, ...prevSearches.filter(s => s !== searchQuery)];
                return newSearches.slice(0, 5); // Keep last 5 searches
            });
        } else {
            alert('Location not found!');
        }
    };

    const handleGetDirections = async () => {
        if (!startLocation || !endLocation) {
            alert('Please enter both a start and end location.');
            return;
        }
        const startPoint = await geocodeAddress(startLocation);
        const endPoint = await geocodeAddress(endLocation);

        if (startPoint && endPoint) {
            setWaypoints([startPoint, endPoint]);
        } else {
            alert('Could not find one or both locations. Please check the addresses.');
        }
    };

    const handleMyLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(pos => {
                const { latitude, longitude } = pos.coords;
                const newPosition = [latitude, longitude];
                setPosition(newPosition);
                setMarkerInfo({ position: newPosition, name: 'Your Location' });
            }, () => {
                alert('Could not retrieve your location.');
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    return (
        <div className="App">
            <Sidebar 
                isOpen={isSidebarOpen}
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                handleMyLocation={handleMyLocation}
                startLocation={startLocation}
                setStartLocation={setStartLocation}
                endLocation={endLocation}
                setEndLocation={setEndLocation}
                handleGetDirections={handleGetDirections}
                recentSearches={recentSearches}
            />
            <MapComponent position={position} markerInfo={markerInfo} waypoints={waypoints} />
        </div>
    );
}

export default App;
