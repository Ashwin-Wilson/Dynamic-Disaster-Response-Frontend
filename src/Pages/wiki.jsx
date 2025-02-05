import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import routeIconImage from 'leaflet/dist/images/marker-icon-2x.png';
import shelterIconImage from 'leaflet/dist/images/marker-icon.png';
import shadowImage from 'leaflet/dist/images/marker-shadow.png';

// Custom icons for different markers
const routeIcon = L.icon({ iconUrl: routeIconImage, shadowUrl: shadowImage });
const shelterIcon = L.icon({ iconUrl: shelterIconImage, shadowUrl: shadowImage });

const HomePage = () => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [language, setLanguage] = useState('en');
    const [feedback, setFeedback] = useState('');
    const [feedbackList, setFeedbackList] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    const evacuationRoutes = [
        { lat: 28.6139, lng: 77.2090, name: "Route 1", description: "Main route" },
        { lat: 28.6200, lng: 77.2150, name: "Route 2", description: "Alternative route" },
    ];

    const safeShelters = [
        { lat: 28.6150, lng: 77.2100, name: "Shelter 1", description: "Main evacuation center" },
        { lat: 28.6220, lng: 77.2150, name: "Shelter 2", description: "Secondary evacuation center" },
    ];

    const disasterPrecautions = [
        { type: "🌧️ Landslides", precautions: "Monitor weather forecasts. Avoid steep slopes and deforested areas. Have an emergency kit ready." },
        { type: "🌊 Flood", precautions: "Move to higher ground. Avoid walking or driving through floodwaters." },
        { type: "🌍 Earthquake", precautions: "Drop, cover, and hold on. Stay away from windows." },
        { type: "🌀 Hurricane", precautions: "Stay indoors, away from windows. Secure loose outdoor items." },
        { type: "🔥 Wildfire", precautions: "Evacuate immediately if advised. Close all windows and doors." },
        { type: "🌞 Heatwaves", precautions: "Stay hydrated, stay cool, and avoid direct sunlight. Check on vulnerable individuals." },
    ];

    useEffect(() => {
        const fetchAlerts = () => {
            // Simulate API call
            setAlerts([
                { type: "🌍 Earthquake", message: "Minor tremors reported. Stay alert." },
                { type: "📢 Drill", message: "Evacuation drill in Sector 4 at 2 PM." },
                // Add more simulated alerts here
            ]);
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 60000); // Fetch new alerts every minute

        // Get user's location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            () => console.error("Location access denied"),
            { enableHighAccuracy: true }
        );

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (feedback.trim()) {
            setFeedbackList([...feedbackList, feedback]);
            setFeedback('');
            alert("Thank you for your feedback!");
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 p-6 text-white">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-5xl font-bold mb-2">🚨 Emergency Evacuation System</h1>
                    <p className="text-lg">Stay informed and safe with real-time alerts and evacuation routes.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/login-page')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
                    <button onClick={() => navigate('/signup')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Sign Up</button>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-gray-700 text-white rounded px-3 py-2">
                        <option value="en">English</option>
                        <option value="hi">Malayalam</option>
                    </select>
                </div>
            </header>

            {/* Real-time Alerts */}
            <section className="mb-8">
                <h2 className="text-3xl mb-4">🔔 Real-time Alerts</h2>
                <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                    {alerts.map((alert, index) => (
                        <div key={index} className={`p-2 rounded ${alert.type.includes("Drill") ? 'bg-blue-500/20 text-blue-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                            <strong>{alert.type}:</strong> {alert.message}
                        </div>
                    ))}
                </div>
            </section>

            {/* Disaster Precautions */}
            <section className="mb-8">
                <h2 className="text-3xl mb-4">⚠️ Natural Disasters Precautions</h2>
                <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                    {disasterPrecautions.map((disaster, index) => (
                        <div key={index}>
                            <strong>{disaster.type}:</strong> {disaster.precautions}
                        </div>
                    ))}
                </div>
            </section>

            {/* Map Section */}
            <section className="mb-8 h-[500px] bg-gray-800 rounded-lg">
                <h2 className="text-3xl mb-4">🗺️ Evacuation Map</h2>
                <MapContainer center={[9.85, 76.97]} zoom={10} scrollWheelZoom={true} className="h-full w-full rounded-lg">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Evacuation Routes */}
                    {evacuationRoutes.map((route, index) => (
                        <Marker key={index} position={[route.lat, route.lng]} icon={routeIcon}>
                            <Popup>{route.name} - {route.description}</Popup>
                        </Marker>
                    ))}

                    {/* Safe Shelters */}
                    {safeShelters.map((shelter, index) => (
                        <Marker key={index} position={[shelter.lat, shelter.lng]} icon={shelterIcon}>
                            <Popup>{shelter.name} - {shelter.description}</Popup>
                        </Marker>
                    ))}

                    {/* User Location */}
                    {userLocation && (
                        <Marker position={[userLocation.lat, userLocation.lng]}>
                            <Popup>📍 Your Location</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </section>

            {/* Feedback Section */}
            <section className="mb-8">
                <h2 className="text-3xl mb-4">💬 User Feedback</h2>
                <form onSubmit={handleFeedbackSubmit} className="bg-gray-800 rounded-lg p-4">
                    <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded" placeholder="Share your thoughts..." />
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">Submit</button>
                </form>
                <ul className="mt-4">{feedbackList.map((f, i) => <li key={i} className="mb-2">🗨️ {f}</li>)}</ul>
            </section>
        </div>
    );
};

export default HomePage;
